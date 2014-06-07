
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Set supported features", function () {

    var zoomer   = new Closeup(wrapperClass, baseImgClass);
    var supports = zoomer.vars.supports;
    ok(typeof supports["opacity"]          !== "undefined");
    ok(typeof supports["transform"]        !== "undefined");
    ok(typeof supports["webkitTransform"]  !== "undefined");

});

test("Set Initial Vars", function () {
    var zoomer = new Closeup(wrapperClass, baseImgClass);
    var vars   = zoomer.vars;
    ok(vars["zoomVisible"] === false);
});

test("Set base img x & y", function () {
    var zoomer = new Closeup(wrapperClass, baseImgClass);
    ok(typeof zoomer.baseImg.x === "number");
    ok(typeof zoomer.baseImg.y === "number");
    ok(typeof zoomer.baseImg.$elem === "object");
    ok(typeof zoomer.baseImg.$elem.style !== "undefined");
});