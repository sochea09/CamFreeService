module.exports = {
    port: process.env.PORT || 3000,
    storage: {
        "events": "https://storage.googleapis.com/test-savada-static/events/",
        "video": "https://storage.googleapis.com/test-savada-static/video/",
        "news": "https://storage.googleapis.com/test-savada-static/news/",
        "media": "https://camfree.s3.amazonaws.com/media/",
        "file": "https://camfree.s3.amazonaws.com/file/"
    }
};
