
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
//
//asyncTest("Showing the zoom image with callback", function () {
//
//    var imgSrc = "base/fixtures/img/600.jpg";
//
//    expect(2);
//
//    new Closeup(wrapperClass, baseImgClass, {
//        callbacks: {
//            "show zoom": function () {
//                ok(1);
//            }
//        }
//    }).setZoomImage(imgSrc, function () {
//            this.showZoomed();
//    });
//});