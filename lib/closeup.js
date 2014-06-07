(function (window, undefined) {

    "use strict";

    var STYLES = {
        wrapper: ["position: relative", "overflow: hidden"],
        baseImg: ["display: block", "z-index: 1"],
        zoomImg: ["position: absolute", "z-index: 2", "opacity: 0", "top: 0", "left: 0"]
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
        this.setMapping(this.$baseImg);
    };


    /**
     *
     */
    Closeup.prototype.setMapping = function ($elem) {

        this.mapper = new Norman({
            viewBox: {
                height: $elem.clientHeight,
                width: $elem.clientWidth
            },
            boundary: 50
        });

        this.cb("set mapping", this.mapper);
    };

    /**
     * Setup instance Vars
     */
    Closeup.prototype.setVars = function () {

        this.vars = {
            zoomVisible: false,
            hasZoomImage: false,
            supports: {}
        };

        this.baseImg = new Subject(this.$baseImg);

        this.setSupports(this.vars, this.$wrapper);
    };

    /**
     * @param {string} src
     */
    Closeup.prototype.setZoomImage = function (src) {

        var that = this;
        that.cb("zoom image loading", src);

        if (!this.$zoomImage) {

            this.$zoomImage = document.createElement("IMG");
            this.$zoomImage.className = "zoom-image";
            this.$zoomImage.src = src;
            this.$zoomImage.style.cssText = STYLES.zoomImg.join(";");
            this.$wrapper.appendChild(this.$zoomImage);

        } else {
            this.$zoomImage.src = src;
        }

        this.$zoomImage.onload = this.imageLoaded(this.$zoomImage, this.mapper);

//        function () {

//            that.cb("zoom image loaded");

//
//            mapper.mapTo({
//                height: subjectImg.height,
//                width: subjectImg.width
//            });
//
//            MAX_X = -(subjectImg.width - baseImg.width);
//            MAX_Y = -(subjectImg.height - baseImg.height);
//
//            updateElem(MAX_X / 2, MAX_Y / 2);
//
//            subjectImg.addEventListener("touchstart", onTouchStart, false);
//            subjectImg.addEventListener("touchmove", onTouchMove, false);
//
//            setTimeout(function () {
//                hideLoader();
//            }, 2000);
//        };
    };


    Closeup.prototype.imageLoaded = function ($zoomedImage, mapper) {
        var that = this;
        return function () {
            that.zoomImg = new Subject($zoomedImage);
            that.zoomImg.maxX = -($zoomedImage.width  - that.baseImg.width);
            that.zoomImg.maxY = -($zoomedImage.height - that.baseImg.height);
            that.updateElem(that.zoomImg.maxX/2, that.zoomImg.maxY/2);
            that.cb("zoom image loaded", $zoomedImage);
            mapper.mapTo({
                height: $zoomedImage.height,
                width: $zoomedImage.width
            });
        };
    };

    /**
     * @param {Closeup.vars} vars
     * @param {HTMLElement} elem
     */
    Closeup.prototype.setSupports = function (vars, elem) {

        vars.supports["opacity"]         = typeof elem.style.opacity         !== "undefined";
        vars.supports["transform"]      = typeof elem.style.transform      !== "undefined";
        vars.supports["webkitTransform"] = typeof elem.style.webkitTransform !== "undefined";

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
     * @param {number} x
     * @param {number} y
     */
    Closeup.prototype.updateElem = function (x, y) {

        x = Math.ceil(x);
        y = Math.ceil(y);

        var supports      = this.vars.supports;
        var translateText = this.translateText(x, y);

        if (this.$zoomImage) {

            if (supports.webkitTransform) {
                // Webkit + Blink
                return this.$zoomImage.style.webkitTransform = translateText;
            }

            if (supports.transform) {
                // IE 10 +
                return this.$zoomImage.style.transform = translateText;
            } else {
                // IE <= 9
                this.$zoomImage.style.left = x + "px";
                this.$zoomImage.style.top  = y + "px";
            }
        }
    };

    /**
     * String helper for Translate text
     * @param x
     * @param y
     * @returns {string}
     */
    Closeup.prototype.translateText = function(x, y) {
        var tmp = "translate3d(%xpx, %ypx, 0)";
        return tmp
            .replace("%x", x)
            .replace("%y", y);
    };

    /**
     * @constructor
     */
    function Subject (elem) {

        this.x      = elem.getBoundingClientRect().left;
        this.y      = elem.getBoundingClientRect().top;
        this.width  = elem.width;
        this.height = elem.height;
        this.$elem  = elem;
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