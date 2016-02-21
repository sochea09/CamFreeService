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
    }
};
