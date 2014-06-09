var conf = require("./test.conf");

module.exports = function (config) {
    conf.logLevel = config.LOG_INFO;
    conf.browsers = ["Firefox"];
    conf.autoWatch = false;
    conf.singleRun = true;
    config.files = [
        '../dist/closeup.min.js',
        'fixtures/*.html',
        'specs/*.js',
        { pattern: 'fixtures/img/**', included: false, served: true }
    ];
    config.set(conf);
};