var Subject = require("./subject");

/**
 * Add public methods to the prototype
 * @param Closeup
 */
module.exports = function (Closeup) {

    /**
     * @param x
     * @param y
     * @returns {Closeup}
     */
    Closeup.prototype.showZoomed = function (x, y) {

        return this._setZoom("show", x, y);
    };

    /**
     * Hide the Zoomed image
     */
    Closeup.prototype.hideZoomed = function () {

        return this._setZoom("hide");
    };

    /**
     * @param {string} src
     * @param {function} [userCallback]
     */
    Closeup.prototype.setBaseImage = function (src, userCallback) {

        this.vars.baseImageLoading = true;

        this._cb("base image loading", src);

        var cb = function () {

            this.vars.baseImageLoading = false;
            this.baseImg = new Subject(this.$baseImage);
            this._updateMapping(this.$baseImage);

            this._cb("base image loaded", this.$baseImage);

            if (typeof userCallback === "function") {
                userCallback(this.$baseImage);
            }

        }.bind(this);

        window.setTimeout(function () {

            // Fire callbacks if same src
            if (this.$baseImage.src.indexOf(src) > -1) {
                cb();
            } else {
                this.$baseImage.src = src;
            }

        }.bind(this), this.vars.baseImageDelay);

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
        var setSrc = false;
        var that = this;

        this._cb("zoom image loading", src);

        var cb = this._onLoadCallback(userCallback);

        if (!this.$zoomImage) {

            // Fire callbacks if same src
            this.$zoomImage = document.createElement("IMG");
            this.$zoomImage.className = this.vars.zoomClass;

            setSrc = true;

            this.$zoomImage.style.cssText = this.constants.STYLES.zoomImg.join(";");

            this.$wrapper.appendChild(this.$zoomImage);

        } else {

            if (this.$zoomImage.src.indexOf(src) > 0) {

                window.setTimeout(function () {
                    cb();
                }, this.vars.zoomImageDelay);

            } else {
                setSrc = true;
            }
        }


        if (setSrc) {
            window.setTimeout(function () {
                that.$zoomImage.src = src;
            }, this.vars.zoomImageDelay);
        }


        this.$zoomImage.onload = cb;

        return this;
    };


    /**
     * Helper for re-mapping values after a base image change/resize
     */
    Closeup.prototype.refresh = function () {

        this._updateMapping(this.$baseImage, this.$zoomImage);

        return this;
    };

    /**
     * @param {number} x
     * @param {number} y
     */
    Closeup.prototype.setZoomPosition = function (x, y) {

        this._updateZoomPosition(x, y);

        return this;
    };

};