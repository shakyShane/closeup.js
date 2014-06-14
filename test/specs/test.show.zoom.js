
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Showing the zoom image", function () {

    var imgSrc = "base/fixtures/img/600.jpg";

    var zoomer = new Closeup(wrapperClass, baseImgClass)
        .setZoomImage(imgSrc);

    var show = zoomer.showZoomed();

    deepEqual(show.vars.zoomVisible, true);
    deepEqual(show.$zoomImage.style.opacity, "1");
    ok(show instanceof Closeup);
});


test("Showing the zoom image with no opacity support", function () {

    var imgSrc = "base/fixtures/img/600.jpg";

    var zoomer = new Closeup(wrapperClass, baseImgClass)
        .setZoomImage(imgSrc);

    // Fake no opacity support
    zoomer.vars.supports.opacity = false;

    var show = zoomer.showZoomed();

    deepEqual(show.vars.zoomVisible, true);
    deepEqual(show.$zoomImage.style.display, "block");
    ok(show instanceof Closeup);

});


asyncTest("Showing the zoom image with custom callback", function () {

    expect(1);

    var imgSrc = "base/fixtures/img/600.jpg";

    var zoomer = new Closeup(wrapperClass, baseImgClass, {
        showZoomed: function ($img) {
            ok($img);
            start();
        }
    }).setZoomImage(imgSrc);

    var show = zoomer.showZoomed();

//    deepEqual(show.vars.zoomVisible, true);
//    deepEqual(show.$zoomImage.style.display, "block");
//    ok(show instanceof Closeup);

});