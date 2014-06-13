(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
    "use strict";

    /**
     * @constructor
     */
    var Norman = function(config) {

        this.opts = {
            boundary: config.boundary || 0,
            safeZone: config.safeZone || 0
        };

        this.viewBox = new Subject(config.viewBox);

        return this;
    };


    /**
     * Link two subjects
     * @param dimensions
     * @returns {Norman}
     */
    Norman.prototype.mapTo = function (dimensions) {

        this.subject = new Subject(dimensions);

        return this;
    };

    /**
     * @returns {{x: boolean, y: boolean, inHitArea: boolean, inBoundary: boolean}}
     */
    Norman.prototype.map = function (x, y) {

        var newX = 0, newY = 0;
        var viewBox = this.viewBox;
        var subject = this.subject;

        var returnObj = {
            x: false,
            y: false,
            inHitArea: false,
            inBoundary: false
        };

        if (this.checkPosition(x, y)) {

            var offX = this.getRelativeOffset("x");
            var diffX = (subject.width - viewBox.width) / 2;

            var offY  = this.getRelativeOffset("y");
            var diffY = (subject.height - viewBox.height) / 2;

            if (this.canLerp("x", x)) {
                newX = lerp(offX + diffX, offX - diffX, this.getNormValue("x", x));
            } else {
                newX = this.getBoundary("x", x);
                returnObj.inBoundary = true;
            }

            if (this.canLerp("y", y)) {
                newY = lerp(offY + diffY, offY - diffY, this.getNormValue("y", y));
            } else {
                newY = this.getBoundary("y", y);
                returnObj.inBoundary = true;
            }

            returnObj.x = newX;
            returnObj.y = newY;
            returnObj.inHitArea  = true;

        }

        return returnObj;
    };

    /**
     * @param x
     * @param y
     * @returns {boolean}
     */
    Norman.prototype.checkPosition = function (x, y) {

        var safeZone = this.opts.safeZone;
        var viewBox  = this.viewBox;

        var safeX = x >= (viewBox.x - safeZone) && x <= (viewBox.x + viewBox.width  + safeZone);
        var safeY = y >= (viewBox.y - safeZone) && y <= (viewBox.y + viewBox.height + safeZone);

        return safeX && safeY;
    };

    /**
     * @param {string} axis
     * @param {number} value
     * @returns {number|boolean}
     */
    Norman.prototype.getBoundary = function (axis, value) {

        var attr      = "width";
        var viewBox   = this.viewBox;
        var subject   = this.subject;
        var hitGutter = this.opts.boundary;

        if (axis === "y") {
            attr = "height";
        }

        if (value <= viewBox[axis] + hitGutter) {
            return viewBox[axis];
        } else {
            if (value >= (viewBox[axis] + viewBox[attr]) - hitGutter) {
                return (viewBox[axis] + viewBox[attr]) - subject[attr];
            }
        }

        return false;
    };

    /**
     * @param {string} axis
     */
    Norman.prototype.getRelativeOffset = function (axis) {

        var attr    = "width";
        var viewBox = this.viewBox;
        var subject = this.subject;

        if (axis === "y") {
            attr = "height";
        }

        return viewBox[axis] - (subject[attr] - viewBox[attr]) / 2;
    };

    /**
     * Is the current value within boundaries?
     * @param {string} axis
     * @param {number} value
     */
    Norman.prototype.canLerp = function (axis, value) {

        var attr      = "width";
        var viewBox   = this.viewBox;
        var hitGutter = this.opts.boundary;

        if (axis === "y") {
            attr = "height";
        }

        var start = viewBox[axis] + hitGutter;
        var end   = viewBox[axis] + viewBox[attr] - hitGutter;

        return value > start && value < end;
    };

    /**
     * Get a normalised value on the hit area minus boundaries
     * @param axis
     * @param value
     */
    Norman.prototype.getNormValue = function (axis, value) {

        var attr      = "width";
        var viewBox   = this.viewBox;
        var hitGutter = this.opts.boundary;

        if (axis === "y") {
            attr = "height";
        }

        var start = viewBox[axis] + hitGutter;
        var end   = viewBox[axis] + viewBox[attr] - hitGutter;

        return norm(start, end, value);
    };

    function lerp (min, max, norm) {
        return (max - min) * norm + min;
    }

    function norm(min, max, value) {
        return (value - min) / (max - min);
    }

    /**
     * @param config
     * @returns {Subject}
     * @constructor
     */
    function Subject (config) {

        this.x      = config.x      || 0;
        this.y      = config.y      || 0;
        this.width  = config.width  || 0;
        this.height = config.height || 0;

        return this;
    }

    module.exports = Norman;
},{}],2:[function(require,module,exports){
var Norman = require("../bower_components/norman.js/lib/norman.js");

    var STYLES = {
        wrapper: ["position: relative", "overflow: hidden", "display: inline-block"],
        baseImg: ["display: block", "z-index: 1"],
        zoomImg: ["position: absolute", "z-index: 2", "opacity: 0", "top: 0", "left: 0", "max-width: none!important"]
    };

    var ERRORS = {
        "no elements": "ERROR: The elements were not found"
    };

    var DEFAULTS = {
        hover: true,
        showOnEnter: true,
        hideOnExit: true,
        zoomVisible: false,
        hasZoomImage: false,
        imageLoading: false,
        baseImageLoading: false,
        boundary: 50,
        supports: {}
    };

    /**
     *
     * Create and return an instance of Closeup.js
     *
     * @constructor
     * @return Closeup
     */
    var Closeup = function (wrapper, baseImg, opts, cb) {

        return this._addCallbacks(opts)
                   ._handleArguments(arguments)
                   ._initElements(wrapper, baseImg)
                   ._setVars()
                   ._setSupports(this.vars, this.$wrapper)
                   ._setMouseEvents(this.$wrapper)
                   ._setMapping(this.$baseImage);
    };


    /**
     *
     * Update the mapping so that the viewbox has the dimensions
     * from the base image
     *
     * @param {HTMLImageElement} $elem
     */
    Closeup.prototype._updateMapping = function ($elem) {

        this.mapper.viewBox.width  = $elem.width;
        this.mapper.viewBox.height = $elem.height;

        this._cb("update mapping", this.mapper);

        return this;
    };

    /**
     * Create an instance of Norman to interpolate
     * values between the viewbox & the subject
     *
     * @param {HTMLImageElement} $elem
     */
    Closeup.prototype._setMapping = function ($elem) {

        this.mapper = new Norman({
            viewBox: {
                height: $elem.clientHeight,
                width: $elem.clientWidth
            },
            boundary: this.vars.boundary
        });

        this._cb("set mapping", this.mapper);

        return this;
    };

    /**
     * Setup instance config using defaults merged with user config
     */
    Closeup.prototype._setVars = function () {

        this.vars = {};

        for (var key in DEFAULTS) {
            this.vars[key] = DEFAULTS[key];
        }

        for (var optKey in this.opts) {
            this.vars[optKey] = this.opts[optKey];
        }


        this.baseImg = new Subject(this.$baseImage);

        this._cb("set vars", this.vars);

        return this;
    };


    /**
     *
     * @param elem
     */
    Closeup.prototype._setMouseEvents = function (elem) {

        var that  = this;

        if (!this.vars.hover) {
            this._cb("not set mouse events");
            return this;
        }

        elem.addEventListener("mousemove", function (evt) {

            if (that.vars.imageLoading || !that.$zoomImage) {
                return;
            } else {
                if (that.vars.zoomVisible === false) {
                    that.showZoomed();
                }
            }

            var mouseX = Math.abs(that.$baseImage.getBoundingClientRect().left - evt.clientX);
            var mouseY = Math.abs(that.$baseImage.getBoundingClientRect().top  - evt.clientY);

            that._updateMousePosition(mouseX, mouseY);
            that._cb("mouse move", [mouseX, mouseY]);
        });

        elem.addEventListener("mouseenter", function (evt) {

            evt.preventDefault();

            if (that.vars.imageLoading) {
                return;
            }

            that._cb("mouse enter", evt);

            if (that.showOnEnter) {
                that.showZoomed();
            }

        }, false);

        elem.addEventListener("mouseleave", function (evt) {
            evt.preventDefault();

            if (that.vars.imageLoading) {
                return;
            }

            that._cb("mouse leave", evt);

            if (that.hideOnExit) {
                that.hideZoomed();
            }

        }, false);

        this._cb("set mouse events", this);

        return this;
    };

    /**
     * Interpolate mouse position to obtain new position of subject
     * @param {number} x
     * @param {number} y
     */
    Closeup.prototype._updateMousePosition = function (x, y) {

        var newValues = this.mapper.map(x, y);

        if (newValues.inHitArea) {

            this._updateElem(newValues.x, newValues.y);
        }
    };

    /**
     * Handle image loaded event
     * @param {function} userCallback
     */
    Closeup.prototype._onLoadCallback = function (userCallback) {

        var that     = this;
        var supports = this.vars.supports;

        return function () {

            if (!supports.opacity) {
                that.$zoomImage.style.display = "none";
            }

            that._imageLoaded();

            window.setTimeout(function () {

                that.vars.imageLoading = false;

                that._cb("zoom image loaded", that.$zoomImage);

                if (typeof userCallback === "function") {
                    userCallback.call(that, that.$zoomImage);
                }

            }, that.opts.loadDelay || 0);
        };
    };


    /**
     *
     */
    Closeup.prototype._imageLoaded = function () {

        var $zoomImg = this.$zoomImage;
        var img      = this.zoomImg = new Subject($zoomImg);
        var baseImg  = this.baseImg;

        img.maxX     = -($zoomImg.width  - baseImg.width);
        img.maxY     = -($zoomImg.height - baseImg.height);

        this._updateElem(img.maxX/2, img.maxY/2);

        if (!this.$zoomImage.hasTouchEvents) {

            $zoomImg.addEventListener("touchstart", this._onTouchStart(this), false);
            $zoomImg.addEventListener("touchmove",  this._onTouchMove(this),  false);

            this.$zoomImage.hasTouchEvents = true;
        }

        this.mapper.mapTo({
            height: $zoomImg.height,
            width: $zoomImg.width
        });
    };

    /**
     * @param {Closeup} instance
     * @returns {Function}
     */
    Closeup.prototype._onTouchStart = function (instance) {

        var that = instance;

        return function (evt) {

            if (!that.vars.zoomVisible) {
                return;
            } else {
                evt.preventDefault();
            }

            that.touchOffsetX =
                evt.touches[0].pageX
                    - that.$zoomImage.getBoundingClientRect().left
                    + that.$baseImage.getBoundingClientRect().left;

            that.touchOffsetY =
                evt.touches[0].pageY
                    - that.$zoomImage.getBoundingClientRect().top
                    + that.$baseImage.getBoundingClientRect().top;
        };
    };

    /**
     * @param {Closeup} instance
     * @returns {Function}
     */
    Closeup.prototype._onTouchMove = function (instance) {

        var that = instance;

        return function (evt) {

            if (!that.vars.zoomVisible) {
                return;
            } else {
                evt.preventDefault();
            }

            var newY = 0;
            var newX = 0;

            var tempX = evt.touches[0].pageX - that.touchOffsetX;
            var tempY = evt.touches[0].pageY - that.touchOffsetY;

            var maxX  = that.zoomImg.maxX;
            var maxY  = that.zoomImg.maxY;


            if (tempY < 0) {

                if (tempY < maxY) {
                    newY = maxY;
                } else {
                    newY = evt.touches[0].pageY - that.touchOffsetY;
                }
            }

            if (tempX < 0) {
                if (tempX < maxX) {
                    newX = maxX;
                } else {
                    newX = evt.touches[0].pageX - that.touchOffsetX;
                }
            }

            that._updateElem(newX, newY);
        };
    };

    /**
     * @param {Closeup.vars} vars
     * @param {HTMLElement} elem
     */
    Closeup.prototype._setSupports = function (vars, elem) {

        vars.supports["opacity"]         = typeof elem.style.opacity         !== "undefined";
        vars.supports["transform"]       = typeof elem.style.transform       !== "undefined";
        vars.supports["webkitTransform"] = typeof elem.style.webkitTransform !== "undefined";

        return this;
    };

    /**
     * @param opts
     */
    Closeup.prototype._addCallbacks = function (opts) {

        this.callbacks = (opts && opts.callbacks) ? opts.callbacks : {};

        return this;
    };

    /**
     * @param args
     */
    Closeup.prototype._handleArguments = function (args) {

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

        return this;
    };

    /**
     * @param {string} name
     * @param {*} data
     */
    Closeup.prototype._cb = function (name, data) {

        if (typeof this.callbacks[name] === "function") {
            this.callbacks[name].call(this, data);
        }
    };

    /**
     * @param {string} wrapper
     * @param {string} baseImg
     */
    Closeup.prototype._initElements = function (wrapper, baseImg) {

        this.$wrapper = typeof wrapper === "string"
            ? document.querySelector(wrapper)
            : wrapper;

        if (this.$wrapper) {
            this.$baseImage = typeof baseImg === "string"
                ? this.$wrapper.querySelector(baseImg)
                : baseImg;
        }

        if (!this.$wrapper || !this.$baseImage) {
            return this._cb("init", ERRORS["no elements"]);
        }

        this.$wrapper.style.cssText = STYLES.wrapper.join(";");
        this.$baseImage.style.cssText = STYLES.baseImg.join(";");

        this._cb("init", this);

        return this;
    };

    /**
     * @param {number} x
     * @param {number} y
     */
    Closeup.prototype._updateElem = function (x, y) {

        x = Math.ceil(x);
        y = Math.ceil(y);

        var supports      = this.vars.supports;
        var translateText = this._translateText(x, y);

        if (this.$zoomImage) {

            this._cb("update zoom position", [x, y]);

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
    Closeup.prototype._translateText = function(x, y) {
        var tmp = "translate3d(%xpx, %ypx, 0)";
        return tmp
            .replace("%x", x)
            .replace("%y", y);
    };


    /** --------- Start public methods ---------- **/


    /**
     * Show the Zoomed image
     */
    Closeup.prototype.showZoomed = function () {

        var supports = this.vars.supports;
        var $img     = this.$zoomImage;

        if ($img) {

            if (supports.opacity) {
                $img.style.opacity = "1";
            } else {
                $img.style.display = "block";
            }

            this.vars.zoomVisible = true;

            this._cb("show zoom", $img);
        }

        return this;
    };

    /**
     * Hide the Zoomed image
     */
    Closeup.prototype.hideZoomed = function () {

        var supports = this.vars.supports;
        var $img     = this.$zoomImage;

        if ($img) {

            if (supports.opacity) {
                $img.style.opacity = "0";
            } else {
                $img.style.display = "none";
            }

            this.vars.zoomVisible = false;

            this._cb("hide zoom", $img);
        }

        return this;
    };


    /**
     * @param {string} src
     * @param {function} [userCallback]
     */
    Closeup.prototype.setBaseImage = function (src, userCallback) {

        this.vars.baseImageLoading = true;
        this._cb("base image loading", src);

        var that = this;

        var cb = function () {

            that.vars.baseImageLoading = false;
            that.baseImg = new Subject(that.$baseImage);
            that._updateMapping(that.$baseImage);

            that._cb("base image loaded", that.$baseImage);

            if (typeof userCallback === "function") {
                userCallback(that.$baseImage);
            }
        };

        // Fire callbacks if same src
        if (this.$baseImage.src.indexOf(src) > -1) {
            cb();
        } else {
            this.$baseImage.src = src;
        }

        this.$baseImage.onload = cb;

        return this;
    };

    /**
     * Set the zoom image - async
     * @param {string} src
     * @param {function} [userCallback]
     */
    Closeup.prototype.setZoomImage = function (src, userCallback) {


        this.vars.imageLoading = true;

        this._cb("zoom image loading", src);

        var cb = this._onLoadCallback(userCallback);

        if (!this.$zoomImage) {

            // Fire callbacks if same src
            this.$zoomImage = document.createElement("IMG");
            this.$zoomImage.className = "zoom-image";
            this.$zoomImage.src = src;
            this.$zoomImage.style.cssText = STYLES.zoomImg.join(";");

            this.$wrapper.appendChild(this.$zoomImage);

        } else {

            if (this.$zoomImage.src.indexOf(src) > 0) {

                cb();

            } else {

                this.$zoomImage.src = src;
            }
        }


        this.$zoomImage.onload = cb;
        return this;
    };


    /**
     * Helper for re-mapping values after a base image change/resize
     */
    Closeup.prototype.refresh = function () {

        this._updateMapping(this.$baseImage);

        return this;
    };

    /**
     * @constructor
     */
    function Subject (elem) {

        this.x       = elem.getBoundingClientRect().left;
        this.y       = elem.getBoundingClientRect().top;
        this.width   = elem.width;
        this.height  = elem.height;
        this.$elem   = elem;
    }

    var debug = function (msg) {
        var debug = document.getElementById("debug");
        debug.innerHTML = msg;
    };

    module.exports = Closeup;

},{"../bower_components/norman.js/lib/norman.js":1}],3:[function(require,module,exports){
var Closeup = require("./closeup");

// AMD export

if(typeof define === "function" && define.amd) {
    define(function() {
        return Closeup;
    });
    // commonjs export
} else {
    window.Closeup = Closeup;
}
},{"./closeup":2}]},{},[3])