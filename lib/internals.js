var utils = require("./utils");

module.exports = function (context) {

    var that = context;

    function getActive() {
        if (that.$loader) {
            that.$loader.className = utils.toggleClass(that.$loader, that.vars.loaderActiveClass);
        }
    }

    return {
        "zoom image loading": getActive,
        "zoom image loaded": getActive,
        "base image loading": getActive,
        "base image loaded": getActive
    };
};

