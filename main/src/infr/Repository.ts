"use strict";

import {MongoClient, Db, Collection} from "mongodb";
import * as Q from 'q';

const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
const ARGUMENT_NAMES = /([^\s,]+)/g;
function getParamNames(func) {
    var fnStr  = func.toString().replace(STRIP_COMMENTS, '');
    var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
    return result || [];
}

export function ValueObject(ofType: Function) {
    return function (target: any, _: string, parameterIndex: number) {
        const parameterName                   = getParamNames(target)[ parameterIndex ];
        target._valueObjects                  = target._valueObjects || {};
        target._valueObjects[ parameterName ] = ofType;
    }

}

export function Entity(target: any) {
    const params = getParamNames(target);

    function mapToExpected(param, value) {
        if (target._valueObjects && target._valueObjects[ param ]) {
            return target._valueObjects[ param ]._constructorForMap(value);
        }
        return value;
    }

    target._constructorForMap = function (map) {
        var args = params.map(p => {
            return mapToExpected(p, map[ p ]);
        });

        return new (Function.prototype.bind.apply(target, [ {} ].concat(args)));
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

        host                = host || process.env.MONGODB_HOST || "localhost";
        port                = port || process.env.MONGODB_PORT || "27017";
        database            = database || process.env.MONGODB_DATABASE || "coonotes_dev";
        const connectionUri = "mongodb://" + host + ":" + port + "/" + database;

        const db                                    = await Q.nfcall(MongoClient.connect, connectionUri);
        SharedConnectionRepository.sharedConnection = <Db> db;
    }

    public static async disconnect(): Promise<void> {
        if (SharedConnectionRepository.sharedConnection != null) {
            await Q.ninvoke(SharedConnectionRepository.sharedConnection, 'close', true);
            SharedConnectionRepository.sharedConnection = null;
        }
    }

    public async drop(): Promise<void> {
        return await Q.ninvoke(this.collection(), 'drop').then(() => {}, (error) => console.warn(error));
    }

    protected collection(): Collection {
        return SharedConnectionRepository.sharedConnection.collection(this.collectionName);
    }

    public async save(object: T): Promise<T> {
        const state = <any> object;
        return this.upsertOne({ id : state.id }, object);
    }

    protected async upsertOne(query: any, object: any) {
        return await Q.ninvoke(this.collection(), 'updateOne', query, object, { upsert : true }).then(() => object);
    };

    protected async findOneGeneric(entityClass: Function, query: any): Promise<T> {
        return await Q.ninvoke(this.collection(), 'findOne', query).then(this.buildFromMap(entityClass));
    }

    protected async findSomeGeneric(entityClass: Function, query: any): Promise<T[]> {
        var self = this;
        return await Q.ninvoke(this.collection(), 'find', query).then((p: any[]) => p.map(self.buildFromMap(entityClass)));
    }

    protected buildFromMap(entityClass: Function): (map: any) => T {
        const free = <any> entityClass;
        return (map) => { if (map != null) return <T> free._constructorForMap(map) }
    }
}
