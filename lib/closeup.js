(function (window, undefined) {

    "use strict";

    var STYLES = {
        wrapper: ["position: relative", "overflow: hidden"],
        baseImg: ["display: block", "z-index: 1"]
    };

    var ERRORS = {
        "no elements": "ERROR: The elements were not found"
    };

    /**
     * @constructor
     */
    var Closeup = function (wrapper, baseImg, opts, cb) {

        this.addCallbacks(opts);
        this.handleArguments(arguments);
        this.initElements(wrapper, baseImg);
    };


    /**
     * Setup instance Vars
     */
    Closeup.prototype.setVars = function () {

        this.vars = {
            zoomVisible: false,
            supports: {}
        };

        this.baseImg = new Subject(this.$baseImg);

        this.setSupports(this.vars, this.$wrapper);
    };

    /**
     * @param {Closeup.vars} vars
     * @param {HTMLElement} elem
     */
    Closeup.prototype.setSupports = function (vars, elem) {

        vars.supports["opacity"]          = typeof elem.style.opacity           !== "undefined";
        vars.supports["transforms"]       = typeof elem.style.transforms        !== "undefined";
        vars.supports["webkitTransforms"] = typeof elem.style.webkitTransforms  !== "undefined";

    };
    /**
     * @param opts
     */
    Closeup.prototype.addCallbacks = function (opts) {

        this.callbacks = (opts && opts.callbacks) ? opts.callbacks : {};
    };

    /**
     * @param args
     */
    Closeup.prototype.handleArguments = function (args) {

        switch(args.length) {
            case 2 :
                this.opts = {};
                break;
            case 3 :
                if (typeof args[2] === "function") {
                    this.callbacks["init"] = args[2];
                } else {
                    this.opts = args[2];
                }
                break;
            case 4 :
                this.opts = args[2];
                this.callbacks["init"] = args[3];
                break;
        }
    };

    /**
     * @param {string} name
     * @param {*} data
     */
    Closeup.prototype.cb = function (name, data) {

        if (typeof this.callbacks[name] === "function") {
            this.callbacks[name].call(this, data);
        }
    };

    /**
     * @param {string} wrapper
     * @param {string} baseImg
     */
    Closeup.prototype.initElements = function (wrapper, baseImg) {

        this.$wrapper = document.querySelector(wrapper);

        if (this.$wrapper) {
            this.$baseImg = this.$wrapper.querySelector(baseImg);
        }

        if (!this.$wrapper || !this.$baseImg) {
            return this.cb("init", ERRORS["no elements"]);
        }

        this.$wrapper.style.cssText = STYLES.wrapper.join(";");
        this.$baseImg.style.cssText = STYLES.baseImg.join(";");

        this.cb("init", this);

        this.setVars();
    };

    /**
     * @constructor
     */
    function Subject (elem) {

        this.x     = elem.getBoundingClientRect().left;
        this.y     = elem.getBoundingClientRect().top;
        this.$elem = elem;
    }

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