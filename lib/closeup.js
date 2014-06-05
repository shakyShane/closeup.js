(function (window, undefined) {

    "use strict";

    var STYLES = {
        wrapper: ["position: relative", "overflow: hidden"],
        baseImg: ["display: block", "z-index: 1"]
    };

    /**
     * @constructor
     */
    var Closeup = function (wrapper, baseImg, opts, cb) {

        switch(arguments.length) {
            case 2 :
                this.opts = {};
                break;
            case 3 :
                if (typeof arguments[2] === "function") {
                    this.cb = opts;
                } else {
                    this.opts = opts;
                }
                break;
            case 4 :
                this.opts = opts;
                this.cb = cb;
                break;
        }

        this.initElements(wrapper, baseImg);
    };


    /**
     * @param {string} wrapper
     * @param {string} baseImg
     */
    Closeup.prototype.initElements = function (wrapper, baseImg) {

        this.$wrapper = document.querySelector(wrapper);
        this.$baseImg = document.querySelector(baseImg);

        this.$wrapper.style.cssText = STYLES.wrapper.join(";");
        this.$baseImg.style.cssText = STYLES.baseImg.join(";");

        this.cb();
    };

    // AMD export
    if(typeof define === "function" && define.amd) {
        define(function() {
            return Closeup;
        });
        // commonjs export
    } else if(typeof module !== "undefined" && module.exports) {
        module.exports = Closeup;
        // browser export
    } else {
        window.Closeup = Closeup;
    }

})(window, Norman);