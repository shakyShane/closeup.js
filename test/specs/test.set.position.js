var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

asyncTest("Setting the Position", function () {

    var imgSrc = "base/fixtures/img/600.jpg";

    expect(2);

    var zoomer =
        new Closeup(wrapperClass, baseImgClass)
            .setZoomImage(imgSrc, function () {
                equal(typeof zoomer.zoomImg.x, "number");
                zoomer.setZoomPosition(0, 0);
                equal(zoomer.zoomImg.x, 0);
                start();
            });
});

asyncTest("Setting the Position with chaining", function () {

    var imgSrc = "base/fixtures/img/600.jpg";

    expect(1);

    var zoomer =
        new Closeup(wrapperClass, baseImgClass)
            .setZoomImage(imgSrc, function () {
                var instance = zoomer.setZoomPosition(0, 0).showZoomed();
                ok(instance instanceof Closeup);
                start();
            });
});