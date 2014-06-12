var conf = require("./test.conf");

module.exports = function (config) {
    conf.logLevel = config.LOG_DEBUG;
    conf.browsers = ["Firefox"];
    conf.autoWatch = false;
    conf.singleRun = true;
    config.files = [
        '../dist/closeup.min.js',
        'qunit-setup.js',
        'fixtures/*.html',
        'specs/*.js',
        { pattern: 'fixtures/img/**', included: false, served: true },
        'qunit-start.js'
    ];
    config.set(conf);
};