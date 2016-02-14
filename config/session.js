'use strict';

module.exports = {
    name: 'bayon.sid',
    store: false,
    secret: 'keyboard cat',
    rolling: false,
    resave: true,
    genid: false,
    proxy: undefined,
    saveUninitialized: false,
    unset: 'keep',
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: null
    }
};
