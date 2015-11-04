/// <reference path="../../../typings/tsd.d.ts" />
"use strict";

import {MongoClient, Db, Collection} from "mongodb";

export abstract class Repository {
    protected abstract collection(name: string): Collection;
}

export class SharedConnectionRepository extends Repository {
    private static sharedConnection: Db = null;

    public static initialize(host?: string, port?: string, database?: string, callback?: (err?: Error) => void): void {
        if (SharedConnectionRepository.sharedConnection != null) {
            return callback();
        }

        host = host || process.env.MONGODB_HOST || "localhost";
        port = port || process.env.MONGODB_PORT || "27017";
        database = database || process.env.MONGODB_DATABASE || "coonotes_dev";
        const connectionUri = "mongodb://" + host + ":" + port + "/" + database;

        MongoClient.connect(connectionUri, (err, db) => {
            if (err) {
                return callback(new Error("[FATAL] Could not connect to database: " + connectionUri + ", error: " + err));
            }

            SharedConnectionRepository.sharedConnection = db;
            callback();
        });
    }

    public static close(cb: () => void): void {
        if (SharedConnectionRepository.sharedConnection != null) {
            SharedConnectionRepository.sharedConnection.close(true, (err, _) => {
                SharedConnectionRepository.sharedConnection = null;
                cb();
            });
        } else {
            cb();
        }
    }

    protected collection(name: string): Collection {
        return SharedConnectionRepository.sharedConnection.collection(name);
    }
}
