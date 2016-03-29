"use strict";

let debug = require("debug")("camfree:service:socket");
let _ = require("underscore");
let moment = require("moment");
let co = require("co");
let Mem = camfree.memStore;
let pub = camfree.memStore.createClient();
camfree.memStore.share = pub;
pub.on("error", (e) => debug(`Pub client: ${e.message}, ${e.stack} `));

let Enum = require('enum');
let categoryType = new Enum({
    'event': "event",
    'news': "news",
    'scholarship': "scholarship",
    'survey': "survey",
    'career': 'career',
    'citizen': 'citizen'
});
let messageType = new Enum({
    'comment': "comment",
    'comment_like': "comment_like",
    'comment_reply': "comment_reply",
    'comment_reply_like': "comment_reply_like",
    'like': "like",
    'unlike': "unlike"
});

function getStoreKeys(ctx) {
    return {
        con: `USR:SID`,
        channel: `CHN:${ctx.auth.hash}`,
    };
}

class Subscriber {
    constructor(ctx) {
        this.sub = Mem.createClient();
        this.context = ctx;
        this.sub.on("subscribe", (c, t) => this.onSubscribe(c, t));
        this.sub.on("psubscribe", (c, t) => this.onSubscribe(c, t));
        this.sub.on("message", (c, m) => this.onMessage(c, m));
        this.sub.on("pmessage", (p, c, m) => this.onMessage(c, m, p));
        this.sub.on("unsubscribe", (c, t) => this.onUnsubscribe(c, t));
        this.sub.on("punsubscribe", (c, t) => this.onUnsubscribe(c, t));
        this.sub.on("error", (e) => this.onError(e));
        this.sub.subscribe(ctx.keys.channel);
    }

    quit() {
        this.sub.quit();
    }

    unsubscribe() {
        this.sub.unsubscribe.apply(this.sub, arguments);
    }

    onError(e) {
        debug(`Sub error - id: ${this.context.socket.id}: ${e.message}, ${e.stack} `);
    }

    onSubscribe(channel, count) {
        debug("Subscriber.onSubscribe: ", channel, count);
    }

    onMessage(channel, message, pattern) {
        debug("Subscriber.onMessage: ", channel, message, pattern);
        this.context.socket.emit("message", JSON.parse(message), function (dd) {
            debug("Subscriber.onMessage.callback: ", dd);
        });
    }

    onUnsubscribe(channel, count) {
        debug("Subscriber.onUnsubscribe: ", channel, count);
    }
}

class SocketHandler {

    constructor(socket) {
        debug("new socket instance: ", socket.id);
        debug("total connections: ", socket.nsp.sockets.length);
        debug("auth credential: ", socket.request.auth);
        this.socket = socket;
        camfree.gsocket = this.socket;
        socket.on("message", (p, c) => this.onMessage(p, c));
        socket.on("disconnect", () => this.onDisconnect());
        socket.on("error", (e) => this.onError(e));

        this.auth = socket.request.auth;
        this.opts = socket.handshake.query;
        this.keys = getStoreKeys(this);
        this.sub = new Subscriber(this);
    }

    onError(e) {
        debug(`Socket error - id: ${this.socket.id}: ${e.message}, ${e.stack} `);
    }

    onDisconnect() {
        console.log("conect");
        debug(`Socket disconnected - id: ${this.socket.id}: `, this.auth);
        pub.del(this.keys.con + this.socket.id);
        this.sub.unsubscribe();
        this.sub.quit();
        this.socket.disconnect();
    }

    onMessage(payload, cb) {

        debug("message payload, ", this.socket.id, ": ", payload);
        if (!payload || !payload.to) {
            if (cb && _.isFunction(cb)) {
                return cb({
                    ok: 0,
                    msg: "invalid payload "
                });
            }
        }
        payload.from = this.auth.hash;
        payload.timestamp = moment().valueOf();
        let data = payload.data;
        let parent_id = payload.parent_id;
        let category_type = payload.category;

        let payload_for_send_to = {};
        payload_for_send_to.from = payload.from;
        payload_for_send_to.timestamp = moment().valueOf();
        payload_for_send_to.category = category_type;
        payload_for_send_to.data = data;

        let payload_for_send_from = {};
        payload_for_send_from.from = payload.from;
        payload_for_send_from.timestamp = moment().valueOf();
        payload_for_send_from.category = category_type;
        payload_for_send_from.data = data;

        switch (category_type) {
        case categoryType.event.value:
            if (data.message_type === messageType.comment.value ||
                data.message_type === messageType.comment_like.value) {
                co(function* () {
                    let users_on_event = yield savada.model.eventUserPost.findAll({
                        group: ["user_id"],
                        where: {
                            event_id: parent_id
                        }
                    });
                    let ids = _.pluck(users_on_event, "user_id");
                    console.log(ids);
                    let users = yield savada.model.user.findAll({
                        where: {
                            id: {
                                $in: ids
                            }
                        }
                    });
                    if (users.length) {
                        for (let i in users) {
                            let users_profile = yield savada.model.profile.findOne({
                                attributes: ["id", "firstname", "lastname", "photo"],
                                where: {
                                    id: users[i].id
                                }
                            });
                            payload_for_send_to.user_profile = users_profile;
                            //Broacash to other user users[i].hash
                            pub.publish("CHN:" + users[i].hash, JSON.stringify(payload_for_send_to));
                            //Broacash yourself.
                            pub.publish("CHN:" + payload.from, JSON.stringify(payload_for_send_from));

                            debug("sending data from ", payload.from, " to ", payload.to);
                        }
                    } else {
                        console.log("User not found");
                    }

                }).catch(function (err) {
                    console.err(err);
                });


            } else if (data.message_type === messageType.comment_reply.value ||
                       data.message_type === messageType.comment_reply_like.value) {
                debug("message type: " + data.message_type);
                co(function* () {
                    let users_on_event = yield savada.model.eventUserPostMessage.findAll({
                        group: ["created_by_user_id"],
                        where: {
                            event_user_post_id: parent_id
                        }
                    });
                    let ids = _.pluck(users_on_event, "created_by_user_id");
                    console.log(ids);
                    let users = yield savada.model.user.findAll({
                        where: {
                            id: {
                                $in: ids
                            }
                        }
                    });
                    if (users.length) {
                        for (let i in users) {
                            let users_profile = yield savada.model.profile.findOne({
                                attributes: ["id", "firstname", "lastname", "photo"],
                                where: {
                                    id: users[i].id
                                }
                            });
                            payload_for_send_to.user_profile = users_profile;
                            //Broacash to other user users[i].hash
                            pub.publish("CHN:" + users[i].hash, JSON.stringify(payload_for_send_to));
                            //Broacash yourself.
                            pub.publish("CHN:" + payload.from, JSON.stringify(payload_for_send_from));

                            debug("sending data from ", payload.from, " to ", payload.to);
                        }
                    } else {
                        console.log("User not found");
                    }

                }).catch(function (err) {
                    console.err(err);
                });
            }
            break;
        case categoryType.news.value:
        case categoryType.scholarship.value:
        case categoryType.survey.value:
        case categoryType.career.value:
        case categoryType.citizen.value:
            console.log(category_type);
            if (data.message_type === messageType.comment.value ||
                data.message_type === messageType.comment_like.value) {
                co(function* () {
                    let users_on_event = yield savada.model.commentUserPost.findAll({
                        group: ["user_id"],
                        where: {
                            parent_id: parent_id,
                            parent_type:category_type
                        }
                    });
                    let ids = _.pluck(users_on_event, "user_id");
                    console.log(ids);
                    let users = yield savada.model.user.findAll({
                        where: {
                            id: {
                                $in: ids
                            }
                        }
                    });
                    if (users.length) {
                        for (let i in users) {
                            let users_profile = yield savada.model.profile.findOne({
                                attributes: ["id", "firstname", "lastname", "photo"],
                                where: {
                                    id: users[i].id
                                }
                            });
                            payload_for_send_to.user_profile = users_profile;
                            //Broacash to other user users[i].hash
                            pub.publish("CHN:" + users[i].hash, JSON.stringify(payload_for_send_to));
                            //Broacash yourself.
                            pub.publish("CHN:" + payload.from, JSON.stringify(payload_for_send_from));

                            debug("sending data from ", payload.from, " to ", payload.to);
                        }
                    } else {
                        console.log("User not found");
                    }

                }).catch(function (err) {
                    console.err(err);
                });
            } else if (data.message_type === messageType.comment_reply.value ||
                       data.message_type === messageType.comment_reply_like.value) {
                debug("message type: " + data.message_type);
                co(function* () {
                    let users_on_event = yield savada.model.commentUserPostMessage.findAll({
                        group: ["created_by_user_id"],
                        where: {
                            comment_user_post_id: parent_id,
                            type:category_type
                        }
                    });
                    let ids = _.pluck(users_on_event, "created_by_user_id");
                    console.log(ids);
                    let users = yield savada.model.user.findAll({
                        where: {
                            id: {
                                $in: ids
                            }
                        }
                    });
                    if (users.length) {
                        for (let i in users) {
                            let users_profile = yield savada.model.profile.findOne({
                                attributes: ["id", "firstname", "lastname", "photo"],
                                where: {
                                    id: users[i].id
                                }
                            });
                            payload_for_send_to.user_profile = users_profile;
                            //Broacash to other user users[i].hash
                            pub.publish("CHN:" + users[i].hash, JSON.stringify(payload_for_send_to));
                            //Broacash yourself.
                            pub.publish("CHN:" + payload.from, JSON.stringify(payload_for_send_from));

                            debug("sending data from ", payload.from, " to ", payload.to);
                        }
                    } else {
                        console.log("User not found");
                    }

                }).catch(function (err) {
                    console.err(err);
                });
            }
            break;

        }
        if (cb && _.isFunction(cb)) {
            cb({
                ok: 1
            });
        }
    }

    * run() {
        try {
            yield pub.setAsync(this.keys.con + this.socket.id, this.auth.id);
        } catch (err) {
            debug("socket handler error ", err.stack);
        }
    }
}

module.exports = SocketHandler;
