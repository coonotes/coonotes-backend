"use strict";

import {MongoClient, Db, Collection} from "mongodb";
import * as Q from 'q';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    return result || [];
}

export function ValueObject(ofType: Function) {
    return function (target: any, _: string, parameterIndex: number) {
        const parameterName = getParamNames(target)[parameterIndex];
        target.prototype._valueObjects = target.prototype._valueObjects || {};
        target.prototype._valueObjects[parameterName] = ofType;
    }

}

export function Entity(target: Function) {
    const params = getParamNames(target);
    function mapToExpected(param, value) {
        if (target.prototype._valueObjects && target.prototype._valueObjects[param]) {
            return target.prototype._valueObjects[param].prototype._constructorForMap(value);
        }
        return value;
    }

    target.prototype._constructorForMap = function (map) {
        var args = params.map(p => {
            return mapToExpected(p, map[p]);
        });

        return new (Function.prototype.bind.apply(target, [{}].concat(args)));
    };
}

export abstract class Repository<T> {
    public abstract async drop(): Promise<void>;
    protected abstract collection(): Collection;
}

export class SharedConnectionRepository<T> extends Repository<T> {
    private static sharedConnection: Db = null;

    constructor(private collectionName: string) {
        super();

        if (collectionName == null) throw new Error('Invalid Repository with empty collection name');
    }

    public static async connect(host?: string, port?: string, database?: string): Promise<void> {
        if (SharedConnectionRepository.sharedConnection != null) {
            return;
        }

        host = host || process.env.MONGODB_HOST || "localhost";
        port = port || process.env.MONGODB_PORT || "27017";
        database = database || process.env.MONGODB_DATABASE || "coonotes_dev";
        const connectionUri = "mongodb://" + host + ":" + port + "/" + database;

        const db = await Q.nfcall(MongoClient.connect, connectionUri);
        SharedConnectionRepository.sharedConnection = <Db> db;
    }

    public static async disconnect(): Promise<void> {
        if (SharedConnectionRepository.sharedConnection != null) {
            await Q.ninvoke(SharedConnectionRepository.sharedConnection, 'close', true).then(_ => SharedConnectionRepository.sharedConnection = null);
        }
    }

    public async drop(): Promise<void> {
        return await this.collection().drop();
    }

    protected collection(): Collection {
        return SharedConnectionRepository.sharedConnection.collection(this.collectionName);
    }

    public async save(object: T): Promise<T> {
        const state = <any> object;
        return await Q.ninvoke(this.collection(), 'updateOne', {id: state.id,}, state, {upsert: true}).then(() => object);
    }

    protected async findOneGeneric(entityClass: Function, query: any): Promise<T> {
        return await Q.ninvoke(this.collection(), 'findOne', query).then(this.buildFromMap(entityClass));
    }

    protected buildFromMap(entityClass: Function): (map: any) => T {
        return (map) => <T> entityClass.prototype._constructorForMap(map);
    }
}
