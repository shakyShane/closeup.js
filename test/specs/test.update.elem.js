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

    var styles = zoomer._translateText(100, 100);

    equal("translate3d(100px, 100px, 0)", styles);

    styles = zoomer._translateText(-122.2, 100);

    equal("translate3d(-122.2px, 100px, 0)", styles);
});

test("SET the translate CSS in Webkit", function () {

    zoomer.vars.supports.webkitTransform = true;
    zoomer.vars.supports.transform       = false;

    zoomer._updateElem(100, 100);

    var regex = new RegExp("translate3d\\(100px, 100px, 0p?x?\\)");
    ok(zoomer.$zoomImage.style.webkitTransform.match(regex));
});

test("SET the translate CSS (2)", function () {

    zoomer.vars.supports.webkitTransform = false;
    zoomer.vars.supports.transform       = true;

    zoomer._updateElem(-100, -1000);

    var regex = new RegExp("translate3d\\(-100px, -1000px, 0p?x?\\)");
    ok(zoomer.$zoomImage.style.transform.match(regex));
});


test("SET the translate CSS with TOP & LEFT", function () {

    zoomer.vars.supports.webkitTransform = false;
    zoomer.vars.supports.transform       = false;

    zoomer._updateElem(-100, -1000);

    equal(zoomer.$zoomImage.style.top, "-1000px");
    equal(zoomer.$zoomImage.style.left, "-100px");
});