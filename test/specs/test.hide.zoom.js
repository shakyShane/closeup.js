
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Hiding the zoom image", function () {

    var imgSrc = "base/fixtures/img/600.jpg";

    var zoomer = new Closeup(wrapperClass, baseImgClass)
        .setZoomImage(imgSrc);

    var show = zoomer.showZoomed().hideZoomed();

    deepEqual(show.vars.zoomVisible, false);
    deepEqual(show.$zoomImage.style.opacity, "0");
    ok(show instanceof Closeup);
});


test("Hiding the zoom image with no opacity support", function () {

    var imgSrc = "base/fixtures/img/600.jpg";

    var zoomer = new Closeup(wrapperClass, baseImgClass)
        .setZoomImage(imgSrc);

    // Fake no opacity support
    zoomer.vars.supports.opacity = false;

    var show = zoomer.showZoomed().hideZoomed();

    deepEqual(show.vars.zoomVisible, false);
    deepEqual(show.$zoomImage.style.display, "none");
    ok(show instanceof Closeup);

});

asyncTest("Hiding the zoom image with callback", function () {

    var imgSrc = "base/fixtures/img/600.jpg";

    expect(2);

    new Closeup(wrapperClass, baseImgClass, {
        callbacks: {
            "show zoom": function () {
                ok(1);
            },
            "hide zoom": function () {
                ok(1);
                start();
            }
        }
    }).setZoomImage(imgSrc, function () {
            this.showZoomed().hideZoomed();
    });
});