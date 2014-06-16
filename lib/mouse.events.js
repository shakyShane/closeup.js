/**
 * Mouse Events
 * @param elem
 * @param context
 */
module.exports = function (elem, context) {

    var that    = context;
    var entered = false;
    var exited  = false;

    /**
     * Click event on element if enabled in options
     */
    if (that.vars.toggleOnClick) {
        document.body.addEventListener("click", clickEvent, false);
    }

    /**
     * Move event on body
     */
    document.body.addEventListener("mousemove", mouseMove);

    /**
     * Mouse move event
     * @param evt
     */
    function mouseMove (evt) {

        var coords = inHitArea(evt.clientX, evt.clientY);

        if (coords && (hitElement(evt) || that.vars.ignoreOverlays)) {
            mouseEnter(evt);
            that._updateZoomPosition(coords.x, coords.y);
            that._cb("mouse move", coords);
        } else {
            mouseLeave(evt);
        }
    }

    /**
     * Click Event
     * @param evt
     */
    function clickEvent (evt) {

        evt.preventDefault();

        if (inHitArea(evt.clientX, evt.clientY)) {

            if (hitElement(evt) || that.vars.ignoreOverlays) {

                if (!that.vars.zoomVisible) {
                    that._setZoom("show", evt.clientX, evt.clientY);
                    that.vars.canMove = true;
                } else {
                    that._setZoom("hide");
                    that.vars.canMove = false;
                }
            }
        }
    }

    /**
     * Mouse enter
     * @param evt
     */
    function mouseEnter(evt) {

        if (!entered) {

            if (that.vars.imageLoading) {
                return;
            }

            that._cb("mouse enter", evt);

            if (that.vars.showOnEnter) {
                that.showZoomed();
                that.vars.canMove = true;
            } else {
                if (!that.vars.toggleOnClick) {
                    that.vars.canMove = false;
                }
            }

            entered = true;
        }
    }

    /**
     * Mouse Leave
     * @param evt
     */
    function mouseLeave(evt) {

        // Can't leave if never entered
        if (!entered) {
            return;
        } else {
            exited = true;
        }

        that._cb("mouse leave", evt);

        entered = false;

        if (that.vars.zoomVisible) {
            if (that.vars.hideOnExit) {
                that.hideZoomed();
                that.vars.canMove = false;
            }
        }
    }

    /**
     * Helper for body event
     * @param clientX
     * @param clientY
     * @returns {*}
     */
    function inHitArea(clientX, clientY) {

        var inX = false;
        var inY = false;

        var x = that.baseImg.x - clientX;
        var y = that.baseImg.y - clientY;

        if (x < 0 && x > -that.$baseImage.width) {
            x = Math.abs(x);
            inX = true;
        }
        if (y < 0 && y > -that.$baseImage.height) {
            y = Math.abs(y);
            inY = true;
        }

        if (inX && inY) {
            return {
                x: x,
                y: y
            };
        }

        return false;
    }

    function isMatch(target, evt) {
        return target.tagName === "IMG" && (evt.target.className.match(new RegExp(that.vars.zoomClass)));
    }

    /**
     * @param evt
     * @returns {boolean|*}
     */
    function hitElement(evt) {

        var target = evt.target || evt.srcElement;
        return isMatch(target, evt);
    }

};