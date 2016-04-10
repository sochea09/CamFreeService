"use strict";

module.exports = {
    s3Read: {
        dirname: 'uploads',
        bucket: 'camfree',
        secretAccessKey: 'fM2WuIw+UAj704taDSWlPRv7oHGANFppn8LioG9U',
        accessKeyId: 'AKIAIQV7YY6HTPJ6PCDA',
        filename: function(req, file, cb) {
            cb(null, Camfree.utils.uuidV1());
        }
    },
    s3Write: {
        dirname: 'uploads',
        bucket: 'camfree',
        secretAccessKey: 'fM2WuIw+UAj704taDSWlPRv7oHGANFppn8LioG9U',
        accessKeyId: 'AKIAIQV7YY6HTPJ6PCDA',
        filename: function(req, file, cb) {
            cb(null, Camfree.utils.uuidV1());
        }
    }
};
