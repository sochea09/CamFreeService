module.exports = {
    home: {
        routes: [{
            handler: "Home@index",
            path: "/",
            method: "GET"
        }, {
            handler: "Home@construction",
            path: "/construction",
            method: "GET"
        }, {
            handler: "Home@ping",
            path: "/ping",
            method: "GET"
        }]
    },
    auth: {
        prefix: "/auth",
        routes: [{
            handler: "User@signin",
            method: "POST",
            path: "/signin"
        }]
    },
    userPub: {
        prefix: "/user",
        routes: [{
            handler: "User@create",
            method: "POST",
            path: "/register"
        }]
    },
    lesson_category: {
        prefix: "/lesson-category",
        routes: [{
            before: "Auth@validate",
            handler: "LessonCategory@create",
            method: "POST",
            path: "/create"
        }]
    },
    lesson: {
        prefix: "/lesson",
        routes: [{
            before: "Auth@validate",
            handler: "Lesson@create",
            method: "POST",
            path: "/create"
        }]
    },
    youtubeUpload: {
        prefix: "/youtube-upload",
        routes: [
            {
                before: "Auth@validate",
                handler: "Upload@run",
                method: "POST",
                path: "/"
            },
            {
                handler: "Upload@getAuthorizationCode",
                method: "GET",
                path: "/code"
            },
            {
                handler: "Upload@getToken",
                method: "GET",
                path: "/token"
            }, {
                handler: "Upload@resumableUpload",
                method: "POST",
                path: "/resume"
            }
        ]
    },
    media: {
        prefix: "/media",
        routes: [{
            handler: "Medias@uploadimage",
            method: "POST",
            path: "/uploadimage"
        }, {
            handler: "Medias@uploadvideo",
            method: "POST",
            path: "/uploadvideo"
        }, {
            handler: "Medias@uploadImageThumbnail",
            method: "POST",
            path: "/upload-image-with-thumbnail"
        }]
    }
};
