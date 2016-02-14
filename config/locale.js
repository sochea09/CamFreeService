module.exports = {
    // setup some locales - other locales default to en silently
    locales: ['en', 'zh', 'km'],

    // you may alter a site wide default locale
    defaultLocale: 'en',

    // sets a custom cookie name to parse locale settings from  - defaults to NULL
    cookie: null,

    // where to store json files - defaults to './locales' relative to modules directory
    directory: 'lang',

    // whether to write new locale information to disk - defaults to true
    updateFiles: true,

    // what to use as the indentation unit - defaults to "\t"
    indent: "\t",

    // setting extension of json files - defaults to '.json'
    // (you might want to set this to '.js' according to webtranslateit)
    extension: '.json',

    // setting prefix of json files name - default to none ''
    // (in case you use different locale files naming scheme (webapp-en.json), rather then just en.json)
    prefix: '',

    // enable object notation
    objectNotation: false
};
