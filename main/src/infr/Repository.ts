/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import {MongoClient, Db, Collection} from "mongodb";
import * as Q from 'q';

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
}
