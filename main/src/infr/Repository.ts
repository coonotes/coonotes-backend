/// <reference path="../../../typings/tsd.d.ts" />

import {MongoClient, Db, Collection} from "mongodb";
"use strict";

export abstract class Repository {
    protected abstract collection(name: string): Collection;
}

export class SharedConnectionRepository extends Repository {
    private static sharedConnection: Db;

    public static initialize(host?: string, port?: string, database?: string, callback?: () => void): void {
        if (SharedConnectionRepository.sharedConnection == null) {
            return callback();
        }

        host = host || process.env.MONGODB_HOST || "localhost";
        port = port || process.env.MONGODB_PORT || "27017";
        database = database || process.env.MONGODB_DATABASE || "coonotes_dev";
        const connectionUri = "mongodb://" + host + ":" + port + "/" + database;

        MongoClient.connect(connectionUri, (err, db) => {
            if (err) {
                throw new Error("[FATAL] Could not connect to database: " + connectionUri);
            }

            SharedConnectionRepository.sharedConnection = db;
            callback();
        });
    }

    protected collection(name: string): Collection {
        return SharedConnectionRepository.sharedConnection.collection(name);
    }
}
