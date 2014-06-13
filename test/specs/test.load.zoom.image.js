
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";


test("Loading a zoom image", function () {

    var imgSrc = "base/fixtures/img/600.jpg";
    var regex  = new RegExp("base/fixtures/img/600.jpg");
    var zoomer = new Closeup(wrapperClass, baseImgClass);

    zoomer.setZoomImage(imgSrc);

    ok(zoomer.$zoomImage);
    ok(zoomer.$zoomImage.tagName === "IMG");
    ok(zoomer.$zoomImage.src.match(regex));
});


asyncTest("Loading a zoom image with immediate callback", function () {

    var imgSrc = "base/fixtures/img/600.jpg";
    var regex  = new RegExp("base/fixtures/img/600.jpg");
    var zoomer = new Closeup(wrapperClass, baseImgClass);

    zoomer.setZoomImage(imgSrc, function (elem) {
        ok(elem.src.match(regex));
        start();
    });
});


asyncTest("Loading a zoom image with callbacks", function () {

    expect(7);

    var imgSrc = "base/fixtures/img/600.jpg";
    var regex  = new RegExp("base/fixtures/img/600.jpg");

    var config = {

        callbacks: {
            "zoom image loading": function (src) {
                deepEqual(true, this.vars.imageLoading, "image loading var should be true");
                equal(src, imgSrc);
            },
            "update zoom position": function (coords) {
                start();
            },
            "zoom image loaded": function (elem) {
                deepEqual(false, this.vars.imageLoading, "image loading var should now be false");
                ok(elem.src.match(regex));
            }
        }
    };

    var zoomer = new Closeup(wrapperClass, baseImgClass, config);

    zoomer.setZoomImage(imgSrc);

    ok(zoomer.$zoomImage);
    ok(zoomer.$zoomImage.tagName === "IMG");
    ok(zoomer.$zoomImage.src.match(regex));

});