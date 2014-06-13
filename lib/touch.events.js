/**
 *
 * @param {Closeup} context
 * @returns {Function}
 */
function onTouchStart(context) {

    var that = context;

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
}

/**
 * @param {Closeup} context
 * @returns {Function}
 * @private
 */
function onTouchMove(context) {
    var that = context;

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
}

/**
 * @param $elem
 */
module.exports = function ($elem, context) {

    $elem.addEventListener("touchstart", onTouchStart(context), false);
    $elem.addEventListener("touchmove",  onTouchMove(context),  false);
};