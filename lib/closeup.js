(function (window, undefined) {

    "use strict";

    var STYLES = {
        wrapper: ["position: relative", "overflow: hidden", "display: inline-block"],
        baseImg: ["display: block", "z-index: 1"],
        zoomImg: ["position: absolute", "z-index: 2", "opacity: 0", "top: 0", "left: 0", "max-width: none!important"]
    };

    var ERRORS = {
        "no elements": "ERROR: The elements were not found"
    };

    /**
     * @constructor
     */
    var Closeup = function (wrapper, baseImg, opts, cb) {

        return this.addCallbacks(opts)
                .handleArguments(arguments)
                .initElements(wrapper, baseImg)
                .setMapping(this.$baseImage);
    };


    /**
     * @param $elem
     */
    Closeup.prototype.updateMapping = function ($elem) {
        this.mapper.viewBox.width  = $elem.width;
        this.mapper.viewBox.height = $elem.height;
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

        return this;
    };

    /**
     * Setup instance Vars
     */
    Closeup.prototype.setVars = function () {

        this.vars = {
            zoomVisible: false,
            hasZoomImage: false,
            imageLoading: false,
            supports: {}
        };

        this.baseImg = new Subject(this.$baseImage);

        this.setSupports(this.vars, this.$wrapper);

        this.cb("set vars", this.vars);
    };


    /**
     * @param elem
     */
    Closeup.prototype.setEvents = function (elem) {

        var that  = this;

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

            that.updateMousePosition(mouseX, mouseY);
            that.cb("mouse move", [mouseX, mouseY]);
        });

        elem.addEventListener("mouseenter", function (evt) {

            evt.preventDefault();

            if (that.vars.imageLoading) {
                return;
            }

            that.cb("mouse enter", evt);
            that.showZoomed();

        }, false);

        elem.addEventListener("mouseleave", function (evt) {
            evt.preventDefault();

            if (that.vars.imageLoading) {
                return;
            }

            that.cb("mouse leave", evt);
            that.hideZoomed();

        }, false);

        this.cb("set events", this);
    };

    /**
     * @param x
     * @param y
     */
    Closeup.prototype.updateMousePosition = function (x, y) {

        var newValues = this.mapper.map(x, y);

        if (newValues.inHitArea) {

            this.updateElem(newValues.x, newValues.y);
        }
    };

    /**
     *
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

            this.cb("hide zoom", $img);
        }
    };


    /**
     *
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

            this.cb("show zoom", $img);
        }
    };

    /**
     * @param {string} src
     * @param {function} [userCallback]
     */
    Closeup.prototype.setZoomImage = function (src, userCallback) {

        this.vars.imageLoading = true;

        this.cb("zoom image loading", src);

        var cb = this.onLoadCallback(userCallback);

        if (!this.$zoomImage) {

            this.$zoomImage = document.createElement("IMG");
            this.$zoomImage.className = "zoom-image";
            this.$zoomImage.src = src;
            this.$zoomImage.style.cssText = STYLES.zoomImg.join(";");
            this.$wrapper.appendChild(this.$zoomImage);

        } else {

            // Fire callbacks if same src
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
     * @param {string} src
     * @param {function} [userCallback]
     */
    Closeup.prototype.setBaseImage = function (src, userCallback) {

        this.vars.imageLoading = true;
        this.cb("base image loading", src);

        var that = this;

        var cb = function () {

            that.vars.imageLoading = false;
            that.baseImg = new Subject(that.$baseImage);
            that.updateMapping(that.$baseImage);

            that.cb("base image loaded", that.$baseImage);

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
     *
     */
    Closeup.prototype.onLoadCallback = function (userCallback) {

        var that     = this;
        var supports = this.vars.supports;

        return function () {

            if (!supports.opacity) {
                that.$zoomImage.style.display = "none";
            }

            that.imageLoaded();

            window.setTimeout(function () {

                that.vars.imageLoading = false;

                that.cb("zoom image loaded", that.$zoomImage);

                if (typeof userCallback === "function") {
                    userCallback(that.$zoomImage);
                }

            }, that.opts.loadDelay || 0);
        };
    };


    /**
     *
     */
    Closeup.prototype.imageLoaded = function () {

        var $zoomImg = this.$zoomImage;
        var img      = this.zoomImg = new Subject($zoomImg);
        var baseImg  = this.baseImg;

        img.maxX     = -($zoomImg.width  - baseImg.width);
        img.maxY     = -($zoomImg.height - baseImg.height);

        this.updateElem(img.maxX/2, img.maxY/2);

        if (!this.$zoomImage.hasTouchEvents) {

            $zoomImg.addEventListener("touchstart", this.onTouchStart(this), false);
            $zoomImg.addEventListener("touchmove",  this.onTouchMove(this),  false);

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
    Closeup.prototype.onTouchStart = function (instance) {

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
    Closeup.prototype.onTouchMove = function (instance) {

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

            that.updateElem(newX, newY);
        };
    };

    /**
     * @param {Closeup.vars} vars
     * @param {HTMLElement} elem
     */
    Closeup.prototype.setSupports = function (vars, elem) {

        vars.supports["opacity"]         = typeof elem.style.opacity         !== "undefined";
        vars.supports["transform"]       = typeof elem.style.transform       !== "undefined";
        vars.supports["webkitTransform"] = typeof elem.style.webkitTransform !== "undefined";
    };

    /**
     * @param opts
     */
    Closeup.prototype.addCallbacks = function (opts) {

        this.callbacks = (opts && opts.callbacks) ? opts.callbacks : {};

        return this;
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

        return this;
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

        this.$wrapper = typeof wrapper === "string"
            ? document.querySelector(wrapper)
            : wrapper;

        if (this.$wrapper) {
            this.$baseImage = typeof baseImg === "string"
                ? this.$wrapper.querySelector(baseImg)
                : baseImg;
        }

        if (!this.$wrapper || !this.$baseImage) {
            return this.cb("init", ERRORS["no elements"]);
        }

        this.$wrapper.style.cssText = STYLES.wrapper.join(";");
        this.$baseImage.style.cssText = STYLES.baseImg.join(";");

        this.cb("init", this);

        this.setVars();
        this.setEvents(this.$wrapper);

        return this;
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

            this.cb("update zoom position", [x, y]);

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