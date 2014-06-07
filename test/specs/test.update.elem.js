
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Get the translate CSS", function () {
    var zoomer   = new Closeup(wrapperClass, baseImgClass);
    var styles = zoomer.translateText(100, 100);
    equal("translate3d(100px, 100px, 0)", styles);

    styles = zoomer.translateText(-122.2, 100);
    equal("translate3d(-122.2px, 100px, 0)", styles);
});

test("SET the translate CSS", function () {
    var zoomer   = new Closeup(wrapperClass, baseImgClass);
    zoomer.$zoomImage = document.createElement("IMG");
    var styles = zoomer.updateElem(100, 100);
    equal(zoomer.$zoomImage.style.webkitTransform, "translate3d(100px, 100px, 0px)");
});
test("SET the translate CSS (1)", function () {
    var zoomer   = new Closeup(wrapperClass, baseImgClass);
    zoomer.$zoomImage = document.createElement("IMG");
    var styles = zoomer.updateElem(-100, -1000);
    equal(zoomer.$zoomImage.style.webkitTransform, "translate3d(-100px, -1000px, 0px)");
});