
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Set supported features", function () {

    var zoomer   = new Closeup(wrapperClass, baseImgClass);
    var supports = zoomer.vars.supports;
    ok(typeof supports["opacity"]           !== "undefined");
    ok(typeof supports["transforms"]        !== "undefined");
    ok(typeof supports["webkitTransforms"]  !== "undefined");

});

test("Set Initial Vars", function () {
    var zoomer = new Closeup(wrapperClass, baseImgClass);
    var vars   = zoomer.vars;
    ok(vars["zoomVisible"] === false);
});