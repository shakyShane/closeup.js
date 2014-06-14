var Subject = require("./subject");

/**
 * Add public methods to the prototype
 * @param Closeup
 */
module.exports = function (Closeup) {

    /**
     * Show the Zoomed image
     */
    Closeup.prototype.showZoomed = function () {

        return this._setZoom("show");
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
            this.$zoomImage.style.cssText = this.const.STYLES.zoomImg.join(";");

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
     * @param {number} x
     * @param {number} y
     */
    Closeup.prototype.setZoomPosition = function (x, y) {

        this._updateMousePosition(x, y);

        return this;
    };

};