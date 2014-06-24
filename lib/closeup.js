var Norman = require("../bower_components/norman.js/lib/norman.js");
var Subject = require("./subject");
var utils = require("./utils");

var STYLES = {
    wrapper: ["position: relative", "overflow: hidden"],
    baseImg: ["display: block", "z-index: 1"],
    zoomImg: ["position: absolute", "z-index: 2", "opacity: 0", "top: 0", "left: 0", "max-width: none!important"]
};

var ERRORS = {
    "no elements": "ERROR: The elements were not found"
};

var DEFAULTS = {
    hover: true,
    mouseEvents: true,
    showOnEnter: true,
    touchEvents: true,
    hideOnExit: true,
    zoomVisible: false,
    hasZoomImage: false,
    imageLoading: false,
    baseImageLoading: false,
    baseImageDelay: 0,
    zoomImageDelay: 0,
    canMove: true,
    zoomClass: "zoom-image",
    boundary: 50,
    ignoreOverlays: false,
    loader: false,
    loaderElem: function () {
        var elem = document.createElement("DIV");
        elem.className = "image-loader";
        elem.innerHTML = "loading...";
        elem.style.position = "absolute";
        elem.style.top = "0";
        elem.style.left = "0";
        return elem;
    },
    loaderActiveClass: "active",
    startPos: function (maxX, maxY) {
        return {
            x: maxX/2,
            y: maxY/2
        };
    },
    showZoomed: function ($img) {
        if (this.vars.supports.opacity) {
            $img.style.opacity = "1";
        } else {
            $img.style.display = "block";
        }
    },
    hideZoomed: function ($img) {
        if (this.vars.supports.opacity) {
            $img.style.opacity = "0";
        } else {
            $img.style.display = "none";
        }
    },
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

    this.constants = {
        STYLES: STYLES,
        ERRORS: ERRORS,
        DEFAULTS: DEFAULTS
    };

    return this._addCallbacks(opts)
        ._handleArguments(arguments)
        ._setVars()
        ._initElements(wrapper, baseImg)
        ._setSupports(this.vars, this.$wrapper)
        ._setMouseEvents(this.$wrapper)
        ._setMapping(this.$baseImage);
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
 *
 * Update the mapping so that the viewbox has the dimensions
 * from the base image
 *
 * @param {HTMLImageElement} $elem
 * @param {HTMLImageElement} $zoomImg
 */
Closeup.prototype._updateMapping = function ($elem, $zoomImg) {

    if ($elem && $zoomImg) {

        this.baseImg = new Subject($elem);
        this.zoomImg = new Subject($zoomImg);

        this.mapper.viewBox.width = this.baseImg.width;
        this.mapper.viewBox.height = this.baseImg.height;

        this._cb("update mapping", this.mapper);
    }

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

    this._cb("set vars", this.vars);

    return this;
};


/**
 *
 * @param elem
 */
Closeup.prototype._setMouseEvents = function (elem) {

    if (!this.vars.mouseEvents) {
        this._cb("not set mouse events");
        return this;
    }
    /** stripifnot:mouse **/
    require("./mouse.events")(elem, this);
    this._cb("set mouse events", this);
    /** stripifnot:mouse:end **/
    return this;
};

/**
 * Interpolate mouse position to obtain new position of subject
 * @param {number} x
 * @param {number} y
 */
Closeup.prototype._updateZoomPosition = function (x, y) {

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

    var supports = this.vars.supports;

    return function () {

        if (!supports.opacity) {
            this.$zoomImage.style.display = "none";
        }

        this._imageLoaded();

        window.setTimeout(function () {

            this.vars.imageLoading = false;

            this._cb("zoom image loaded", this.$zoomImage);

            if (typeof userCallback === "function") {
                userCallback.call(this, this.$zoomImage);
            }

        }.bind(this), this.opts.loadDelay || 0);

    }.bind(this);
};

/**
 * Set the zoom state
 * @param type
 * @returns {Closeup}
 */
Closeup.prototype._setZoom = function (type, x, y) {

    var $img = this.$zoomImage;

    if (x && y) {

        var hitX = Math.abs(this.baseImg.x - x);
        var hitY = Math.abs(this.baseImg.y  - y);

        this._updateZoomPosition(hitX, hitY);
    }

    if ($img) {

        this.vars[type + "Zoomed"].call(this, $img);

        this.vars.zoomVisible = type === "show";

        this._cb(type + " zoom", $img);
    }

    return this;
};

/**
 *
 */
Closeup.prototype._imageLoaded = function () {

    var $zoomImg = this.$zoomImage;
    var img      = this.zoomImg = new Subject($zoomImg);
    var baseImg  = this.baseImg;

    img.maxX = -($zoomImg.width - baseImg.width);
    img.maxY = -($zoomImg.height - baseImg.height);

    var startPos = this.vars.startPos(img.maxX, img.maxY);

    this._updateElem(startPos.x, startPos.y);

    /**stripifnot:touch**/
    if (!this.$zoomImage.hasTouchEvents && this.vars.touchEvents) {

        require("./touch.events")($zoomImg, this);

        this.$zoomImage.hasTouchEvents = true;
    }
    /**stripifnot:touch:end**/

    this.mapper.mapTo({
        height: $zoomImg.height,
        width: $zoomImg.width
    });
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

    switch (args.length) {
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

    var internalListeners = require("./internals")(this);

    if (typeof this.callbacks[name] === "function") {
        this.callbacks[name].call(this, data);
    }
    if (typeof internalListeners[name] === "function") {
        internalListeners[name].call(this, data);
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

    if (this.vars.loader) {
        this.$loader = this.vars.loaderElem();
        this.$wrapper.appendChild(this.$loader);
    }

    this.$wrapper.style.cssText   = STYLES.wrapper.join(";");
    this.$baseImage.style.cssText = STYLES.baseImg.join(";");
    this.baseImg = new Subject(this.$baseImage);

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

    if (this.zoomImg) {
        this.zoomImg.x = x;
        this.zoomImg.y = y;
    }

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
            this.$zoomImage.style.top = y + "px";
        }
    }
};

/**
 * String helper for Translate text
 * @param x
 * @param y
 * @returns {string}
 */
Closeup.prototype._translateText = function (x, y) {
    var tmp = "translate3d(%xpx, %ypx, 0)";
    return tmp
        .replace("%x", x)
        .replace("%y", y);
};


/** --------- Add public methods ---------- **/

require("./public")(Closeup);

module.exports = Closeup;
