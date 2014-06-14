/**
 * Mouse Events
 * @param elem
 * @param context
 */
module.exports = function (elem, context) {

    var that = context;

    elem.addEventListener("mousemove", function (evt) {

        if (!that.vars.canMove || that.vars.imageLoading || !that.$zoomImage) {
            return;
        } else {
            if (that.vars.zoomVisible === false && that.vars.showOnEnter) {
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

        if (that.vars.showOnEnter) {
            that.showZoomed();
            that.vars.canMove = true;
        }

    }, false);

    elem.addEventListener("mouseleave", function (evt) {
        evt.preventDefault();

        if (that.vars.imageLoading) {
            return;
        }

        that._cb("mouse leave", evt);

        if (that.vars.hideOnExit) {
            that.hideZoomed();
            that.vars.canMove = false;
        }

    }, false);
};