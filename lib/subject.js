
/**
 * @constructor
 */
module.exports = function (elem) {

    this.x       = elem.getBoundingClientRect().left;
    this.y       = elem.getBoundingClientRect().top;
    this.width   = elem.width;
    this.height  = elem.height;
    this.$elem   = elem;
};