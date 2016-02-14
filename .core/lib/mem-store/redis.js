"use strict";

let bluebird = require("bluebird");

let redis = require("redis");

bluebird.promisifyAll(redis);

module.exports = {
    driver: redis,
    createClient: function(memStoreConfig) {
        return function() {
            if (memStoreConfig.unixSocket) {
                return redis.createClient(
                    memStoreConfig.unixSocket, memStoreConfig.options
                );
            } else {
                return redis.createClient(
                    memStoreConfig.port, memStoreConfig.host, memStoreConfig.options
                );
            }
        };
    }
};
