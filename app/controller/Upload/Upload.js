/**
 * Created by bruce on 15-Feb-16.
 */
"use strict";
let SocketRes = require("../../utils/SocketRes.js");
// YouTube will handle the YouTube API requests
let Youtube = require("youtube-api"),
    Upload = require("../Upload/Upload"),
    Fs = require("fs"),
    Opn = require("opn"),
    models = camfree.model,
    ResumableUpload = require('node-youtube-resumable-upload');

const CamFree = 'CamFree';
Upload.getAuthorizationCode = function* () {
    /*
     * Retrieve Youtube credentials from db.
     * */
    const CREDENTIALS = yield models.oauth2_credentials.find({
        where: {
            name: CamFree
        }
    });

    // Authenticate using the credentials
    var oauth2Client = Youtube.authenticate({
        type: "oauth",
        client_id: CREDENTIALS.client_id,
        client_secret: CREDENTIALS.client_secret,
        redirect_url: CREDENTIALS.redirect_url
    });

    // Open the authentication url in the default browser
    Opn(oauth2Client.generateAuthUrl({
        access_type: "offline"
        , scope: ["https://www.googleapis.com/auth/youtube.upload"]
    }));
};

Upload.getToken = function* () {
    /*
     * Retrieve Youtube credentials from db.
     * */
    const CREDENTIALS = yield models.oauth2_credentials.find({
        where: {
            name: CamFree
        }
    });

    // Authenticate using the credentials
    var oauth2Client = Youtube.authenticate({
        type: "oauth",
        client_id: CREDENTIALS.client_id,
        client_secret: CREDENTIALS.client_secret,
        redirect_url: CREDENTIALS.redirect_url
    });

    // Set your authorization code here
    let auth_code = this.query.code;

    oauth2Client.getToken(auth_code, function (err, tokens) {
        if (err) {
            console.log('Error getting token.', err);
        }
        models.oauth2_credentials.update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        }, {
            where: {
                name: CamFree
            }
        });
        console.log('tokens', tokens);
    });
};

Upload.run = function* () {

    let res = {};

    /*
    * Define our video path.
    * */
    const VIDEO_PATH = this.req.file;
    console.log('VID', VIDEO_PATH);

    if (!VIDEO_PATH) {
        res.message = 'No video provided.';
        return this.fail(res, res.message);
    }

    /*
     * Retrieve Youtube credentials from db.
     * */
    let CREDENTIALS = yield models.oauth2_credentials.find({
        where: {
            name: CamFree
        }
    });

    // Authenticate using the credentials
    var oauth2Client = Youtube.authenticate({
        type: "oauth",
        client_id: CREDENTIALS.client_id,
        client_secret: CREDENTIALS.client_secret,
        redirect_url: CREDENTIALS.redirect_url
    });

    oauth2Client.setCredentials({
        access_token: CREDENTIALS.access_token,
        refresh_token: CREDENTIALS.refresh_token
    });

    oauth2Client.refreshAccessToken(function (err, tokens) {
        if (err) console.log('Error', err);
        models.oauth2_credentials.update({
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token
        }, {
            where: {
                name: CamFree
            }
        });
        // your access_token is now refreshed and stored in oauth2Client
        // store these new tokens in a safe place (e.g. database)
        // Set new credentials
        oauth2Client.setCredentials(tokens);
    });

    let yInsert = camfree.utils.thunkify(Youtube.videos.insert, Youtube.videos);

    // And finally upload the video! Yay!
    let data = yield yInsert({
        resource: {
            // Video title and description
            snippet: {
                title: "CamFree"
                , description: "This video was upload from http://www.camfree.net"
            }
            // I don't want to spam my subscribers
            , status: {
                privacyStatus: "public"
            }
        }
        // This is for the callback function
        , part: "snippet,status"

        // Create the readable stream to upload the video
        , media: {
            body: VIDEO_PATH.buffer
        }
    });
    console.log('ID', data[0].id);
    res.videoId = data[0].id;

    yield SocketRes.onTutorial(res,this.auth.id);
    //this.res.connection.setTimeout(0);
    return this.ok(res, "Success.");
};
Upload.resumableUpload = function* () {
    try {

        let res = {};

        /*
         * Define our video path.
         * */
        const VIDEO_PATH = this.req.file;
        console.log('VIDEO_PATH:', VIDEO_PATH);
        if (!VIDEO_PATH) {
            res.message = 'No video provided.';
            return this.fail(res, res.message);
        }

        /*
         * Retrieve Youtube credentials from db.
         * */
        let CREDENTIALS = yield models.oauth2_credentials.find({
            where: {
                name: CamFree
            }
        });

        let oauth2Client = camfree.utils.thunkify(Youtube.authenticate, Youtube);

        // Authenticate using the credentials
        oauth2Client = yield oauth2Client({
            type: "oauth",
            client_id: CREDENTIALS.client_id,
            client_secret: CREDENTIALS.client_secret,
            redirect_url: CREDENTIALS.redirect_url
        });

        //return  console.log('oauth', oauth2Client);

        oauth2Client.setCredentials({
            access_token: CREDENTIALS.access_token,
            refresh_token: CREDENTIALS.refresh_token
        });

        oauth2Client.refreshAccessToken(/*function (err, tokens) {
            if (err) console.log('Error', err);
            models.oauth2_credentials.update({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token
            }, {
                where: {
                    name: Savada
                }
            });
            // your access_token is now refreshed and stored in oauth2Client
            // store these new tokens in a safe place (e.g. database)
            // Set new credentials
            oauth2Client.setCredentials(tokens);
        }*/);

        var resumableUpload = new ResumableUpload(); //create new ResumableUpload
        resumableUpload.tokens = tokens; //Google OAuth2 tokens
        resumableUpload.filepath = './video.mp4';
        resumableUpload.metadata = metadata; //include the snippet and status for the video
        resumableUpload.retry = 3; // Maximum retries when upload failed.
        resumableUpload.upload();
        resumeableUpload.on('progress', function(progress) {
            console.log(progress);
        });
        resumableUpload.on('success', function(success) {
            console.log(success);
        });
        resumableUpload.on('error', function(error) {
            console.log(error);
        });

    } catch (err) {
        this.error(err);
    }
};
