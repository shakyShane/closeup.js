/**
 * Mouse Events
 * @param elem
 * @param context
 */
module.exports = function (elem, context) {

    var that = context;

    var entered = false;
    var exited  = false;

    /**
     * Click event on element if enabled in options
     */
    if (that.vars.toggleOnClick) {

        elem.addEventListener("click", function (evt) {
            evt.preventDefault();

            if (!that.vars.zoomVisible) {
                that._setZoom("show", evt.clientX, evt.clientY);
                that.vars.canMove = true;
            } else {
                that._setZoom("hide");
                that.vars.canMove = false;
            }

        }, false);
    }

    /**
     * Move event on body
     */
    document.body.addEventListener("mousemove", function (evt) {

        var inX = false;
        var inY = false;

        var x = that.baseImg.x - evt.clientX;
        var y = that.baseImg.y - evt.clientY;

        if (x < 0 && x > -that.$baseImage.width) {
            x = Math.abs(x);
            inX = true;
        }
        if (y < 0 && y > -that.$baseImage.height) {
            y = Math.abs(y);
            inY = true;
        }

        if (inX && inY) {
            mouseEnter(evt);
            that._updateZoomPosition(x, y);
            that._cb("mouse move", [x, y]);
        } else {
            mouseLeave(evt);
        }

    });

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

};