var zoomer;
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";


module("updating Elem position with CSS", {
    setup: function () {
        zoomer = new Closeup(wrapperClass, baseImgClass);
        zoomer.$zoomImage = document.createElement("IMG");
    }
});


test("Get the translate CSS", function () {

    var styles = zoomer.translateText(100, 100);

    equal("translate3d(100px, 100px, 0)", styles);

    styles = zoomer.translateText(-122.2, 100);

    equal("translate3d(-122.2px, 100px, 0)", styles);
});

test("SET the translate CSS in Webkit", function () {

    zoomer.vars.supports.webkitTransform = true;
    zoomer.vars.supports.transform       = false;

    zoomer.updateElem(100, 100);

    equal(zoomer.$zoomImage.style.webkitTransform, "translate3d(100px, 100px, 0px)");
});

test("SET the translate CSS (2)", function () {

    zoomer.vars.supports.webkitTransform = false;
    zoomer.vars.supports.transform       = true;

    zoomer.updateElem(-100, -1000);

    equal(zoomer.$zoomImage.style.transform, "translate3d(-100px, -1000px, 0)");
});


test("SET the translate CSS with TOP & LEFT", function () {

    zoomer.vars.supports.webkitTransform = false;
    zoomer.vars.supports.transform       = false;

    zoomer.updateElem(-100, -1000);

    equal(zoomer.$zoomImage.style.top, "-1000px");
    equal(zoomer.$zoomImage.style.left, "-100px");
});