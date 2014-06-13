/**
 * @type {string}
 */
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Instance creation with options", function () {

    var config = {
        name: "shane",
        hover: false
    };

    var zoomer = new Closeup(wrapperClass, baseImgClass, config);

    deepEqual(zoomer.vars.name, "shane");
    deepEqual(zoomer.vars.hover, false);
});

test("Overriding the boundary", function () {

    var config = {
        boundary: 10
    };

    var zoomer = new Closeup(wrapperClass, baseImgClass, config);

    deepEqual(zoomer.mapper.opts.boundary, 10);
});

test("Setting a callback for initial image position", function () {

    var config = {
        startPos: function (maxX, maxY) {
            return {
                x: maxX/4,
                y: maxY/2
            };
        }
    };

    var zoomer = new Closeup(wrapperClass, baseImgClass, config);

    deepEqual(zoomer.vars.startPos(100, 100).x, 25);
    deepEqual(zoomer.vars.startPos(100, 100).y, 50);
});
