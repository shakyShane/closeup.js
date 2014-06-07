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
            imageLoading: false,
            supports: {}
        };

        this.baseImg = new Subject(this.$baseImg);

        this.setSupports(this.vars, this.$wrapper);

        this.cb("set vars", this.vars);
    };


    /**
     * @param elem
     */
    Closeup.prototype.setEvents = function (elem) {

        var that  = this;
        var baseX = that.baseImg.x;
        var baseY = that.baseImg.y;

        elem.addEventListener("mousemove", function (evt) {
            if (that.vars.imageLoading) {
                return;
            }
            var mouseX = Math.abs(baseX - evt.clientX);
            var mouseY = Math.abs(baseY - evt.clientY);

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
     */
    Closeup.prototype.setZoomImage = function (src) {

        var that = this;

        that.cb("zoom image loading", src);

        var cb = this.onLoadCallback();

        this.vars.imageLoading = true;

        if (!this.$zoomImage) {

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

        this.$zoomImage.onload = cb();
    };

    /**
     *
     */
    Closeup.prototype.onLoadCallback = function () {

        var that = this;

        return function () {
            that.cb("zoom image loaded", that.$zoomImage);
            that.imageLoaded();
            window.setTimeout(function () {
                that.vars.imageLoading = false;
            }, that.opts.loadDelay || 0)
        }
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

        $zoomImg.addEventListener("touchstart", this.onTouchStart(this), false);
        $zoomImg.addEventListener("touchmove",  this.onTouchMove(this),  false);

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

            evt.preventDefault();

            if (!that.vars.zoomVisible) {
                return;
            }

            that.touchOffsetX =
                evt.touches[0].pageX
                    - that.$zoomImage.getBoundingClientRect().left
                    + that.$baseImg.getBoundingClientRect().left;

            that.touchOffsetY =
                evt.touches[0].pageY
                    - that.$zoomImage.getBoundingClientRect().top
                    + that.$baseImg.getBoundingClientRect().top;
        };
    };

    /**
     * @param {Closeup} instance
     * @returns {Function}
     */
    Closeup.prototype.onTouchMove = function (instance) {

        var that = instance;

        return function (evt) {

            evt.preventDefault();

            if (!that.vars.zoomVisible) {
                return;
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

        this.$wrapper = typeof wrapper === "string"
            ? document.querySelector(wrapper)
            : wrapper;

        if (this.$wrapper) {
            this.$baseImg = typeof baseImg === "string"
                ? this.$wrapper.querySelector(baseImg)
                : baseImg;
        }

        if (!this.$wrapper || !this.$baseImg) {
            return this.cb("init", ERRORS["no elements"]);
        }

        this.$wrapper.style.cssText = STYLES.wrapper.join(";");
        this.$baseImg.style.cssText = STYLES.baseImg.join(";");

        this.cb("init", this);

        this.setVars();
        this.setEvents(this.$wrapper);
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