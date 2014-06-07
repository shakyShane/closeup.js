
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";


test("Loading a zoom image", function () {

    var imgSrc = "base/fixtures/img/600.jpg";
    var regex  = new RegExp("base/fixtures/img/600.jpg");
    var zoomer   = new Closeup(wrapperClass, baseImgClass);
    zoomer.setZoomImage(imgSrc);
    ok(zoomer.$zoomImage);
    ok(zoomer.$zoomImage.tagName === "IMG");
    ok(zoomer.$zoomImage.src.match(regex));
});


test("Loading a zoom image with callbacks", function () {

    expect(5);


    var imgSrc = "base/fixtures/img/600.jpg";
    var regex  = new RegExp("base/fixtures/img/600.jpg");

    var config = {

        callbacks: {

            "zoom image loading": function (src) {
                equal(src, imgSrc);
            },
            "zoom image loaded": function (elem) {
                ok(elem.src.match(regex));
            }
        }
    };

    var zoomer   = new Closeup(wrapperClass, baseImgClass, config);

    zoomer.setZoomImage(imgSrc);

    ok(zoomer.$zoomImage);
    ok(zoomer.$zoomImage.tagName === "IMG");
    ok(zoomer.$zoomImage.src.match(regex));

    // Fake the loaded Image
    zoomer.onLoadCallback()();
});