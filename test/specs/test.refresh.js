
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Refreshing the viewbox size", function () {

    var zoomer = new Closeup(wrapperClass, baseImgClass);

    zoomer.$baseImage.width = 1000;
    zoomer.$baseImage.height = 200;
    zoomer.$zoomImage = document.createElement("IMG");

    zoomer.refresh();

    equal(zoomer.mapper.viewBox.width, 1000);
    equal(zoomer.mapper.viewBox.height, 200);
});


test("Refreshing the viewbox size with method chaining", function () {

    var zoomer = new Closeup(wrapperClass, baseImgClass);

    zoomer.$baseImage.width = 1000;
    zoomer.$baseImage.height = 200;

    var instance = zoomer.refresh().showZoomed();
    zoomer.$zoomImage = document.createElement("IMG");

    ok(instance instanceof Closeup);
});