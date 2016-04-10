"use strict";
let debug = require("debug")("camfree:upoloader:uploader");
let utils = camfree.utils;
let models = camfree.model;
var AWS = require('aws-sdk');
let config = utils.getConfig('aws');

var im = require('imagemagick-stream');

let gulp = require('gulp');
let imagemin = require('gulp-imagemin');
let imageResize = require('gulp-image-resize');

let fs = require("fs");
var zlib = require('zlib');
let upload = module.exports = {};
let base64Jpeg = "data:image/jpeg;base64";
let base64Png = "data:image/png;base64";

let mime = require('mime');
let bluebird = require("bluebird");
let gm = require('gm');

bluebird.promisifyAll(gm);
bluebird.promisifyAll(gm.prototype);


AWS.config.update(config.s3Write);
let s3 = new AWS.S3({
    params: {
        Bucket: 'camfree'
    }
});

bluebird.promisifyAll(s3);

upload.saveFile = function * (file, dir, contentTypes) {

    let data = {
        ACL: "public-read",
        Body: file.buffer,
        Key: dir,
        ContentType: (contentTypes || "'application/octet-stream'") // force download if it's accessed as a top location
    };

    let result = yield s3.uploadAsync(data);

    return result;

    /*var body = fs.createReadStream(file);//.pipe(zlib.createGzip());
    var s3obj = new AWS.S3({
        params: {
            ACL: "public-read",
            Bucket: 'camfree',
            Key: dir,
            ContentType: (contentTypes || "'application/octet-stream'")
        }
    });
    s3obj.upload({
        Body: body
    }).on('httpUploadProgress', function(evt) {
        console.log(evt);
    }).send(function(err, data) {
        if (err) {
            console.log("Error uploading data: ", err);
        } else {
            console.log("Successfully uploaded data.");
        }
    });*/
};
upload.saveFileWithThumbnail = function (local, remote, options) {

    options = options || {};
    let image = bucket.file("media/" + remote);
    console.log("Error" + image);
    let readStream = fs.createReadStream(local);
    readStream.pipe(image.createWriteStream({
        resumable: false
    })).on('error', function (err) {
        debug('Error at save gcloud file: ', err.stack);
    }).on('complete', function () {
        console.log("completed" + options.meta);
        debug("completed", "completed" + options.meta);
        image.setMetadata(options.meta);
        /*
        if (!options.donotRemove) {
            fs.unlink(local, function(err) {
                if (err) debug('Error at remove file: ', err.stack);
            });
        }*/
    }).on('finish', function () {
        console.log("completed" + options.meta);
        debug("completed", "completed" + options.meta);
        image.setMetadata(options.meta);
        upload.saveFileCompress(local, remote, options);
        upload.saveFileCompressNormalSize(local, remote, options);
    });
    return image;
};
upload.saveFileCompressNormalSize = function (local, remote, options) {
    options = options || {};

    let resize = im().resize(1000, 484).quality(80);
    let image = bucket.file("media/resize-" + remote);
    let readStream = fs.createReadStream(local);
    let writeStream =
        readStream.pipe(resize).pipe(image.createWriteStream({
            resumable: false
        })).on('finish', function () {
            console.log("Finsied");
            image.setMetadata(options.meta);
            if (!options.donotRemove) {
                console.log("Remove");
                fs.unlink(local, function (err) {
                    if (err) debug('Error at remove file: ', err.stack);
                });
            }
        });

    return image;
};
upload.saveFileCompress = function (local, remote, options) {
    options = options || {};

    let resize = im().resize(200, 200).quality(90);
    let image = bucket.file("media/thumbnail-" + remote);
    let readStream = fs.createReadStream(local);
    // can also stream output to a ReadableStream
    // (can be piped to a local file or remote server)
    let writeStream =
        readStream.pipe(resize).pipe(image.createWriteStream({
            resumable: false
        })).on('finish', function () {
            console.log("Finsied");
            image.setMetadata(options.meta);
            if (!options.donotRemove) {
                console.log("Remove");
                fs.unlink(local, function (err) {
                    if (err) debug('Error at remove file: ', err.stack);
                });
            }
        });

    return image;
};

upload.getImageContentType = function (img) {
    if (img.indexOf("image/jpeg") !== -1) {
        return "image/jpeg";
    } else if (img.indexOf("image/png") !== -1) {
        return "image/png";
    } else if (img.indexOf("image/gif") !== -1) {
        return "image/gif";
    } else {
        return "image/jpg";
    }
};
upload.writeFile = function (fullPath, image) {
    try {
        fs.writeFile(fullPath, image, "base64");
        debug('Save Success: ', "Success" + fullPath);
    } catch (err) {
        debug('Error at remove file: ', err);
    }
};
upload.download = function (file_url_download, filename, remote, options, callback) {
        options = options || {};
        var fs = require('fs'),
            request = require('request');
        let image = bucket.file("media/" + remote);
        request.head(file_url_download, function (err, res, body) {
                console.log('content-type:', res.headers['content-type']);
                    console.log('content-length:', res.headers['content-length']);

                        request(file_url_download).pipe(
                                fs.createWriteStream(filename)
                            ).on('finish', function () {

                            }).on('close', function() {
                             fs.createReadStream(filename).pipe(image.createWriteStream({
                                resumable: false
                            })).on('error', function (err) {
                                debug('Error at save gcloud file: ', err.stack);
                            }).on('finish', function () {
                                console.log("completed" + options.meta);
                                debug("completed", "completed" + options.meta);
                                image.setMetadata(options.meta);
                                if (!options.donotRemove) {
                                    fs.unlink(filename, function (err) {
                                        if (err) debug('Error at remove file: ', err.stack);
                                    });
                                }
                                })
                            })
                        .on('finish', function () {

                        });

        });
};
