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