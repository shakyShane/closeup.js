var conf = require("./test.conf");

module.exports = function (config) {
    conf.logLevel = config.LOG_INFO;
    conf.browsers = ["Firefox"];
    conf.autoWatch = false;
    conf.singleRun = true;
    config.set(conf);
};