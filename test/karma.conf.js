// Karma configuration
// Generated on Wed Sep 18 2013 18:10:53 GMT+0100 (BST)
var conf = require("./test.conf");

module.exports = function (config) {
    conf.logLevel = config.LOG_DEBUG;
    config.files = [

        '../bower_components/norman.js/dist/norman.js',
        '../lib/*.js',
        'qunit-setup.js',
        'fixtures/*.html',
        'specs/*.js',
        { pattern: 'fixtures/img/**', included: false, served: true },
        'qunit-start.js'
    ];
    config.set(conf);
};