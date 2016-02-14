/*
 * More information about options can be found here
 * https://github.com/Automattic/engine.io#methods-1
 */
module.exports = {
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 10E7,
    //allowRequest: <Function>,
    transports: ['polling', 'websocket'],
    allowUpgrades: true,
    cookie: false
};
