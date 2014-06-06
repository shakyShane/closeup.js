
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Loading a zoom image", function () {

    var zoomer   = new Closeup(wrapperClass, baseImgClass);
    zoomer.setZoomImage("/42112.jpg");
    ok(zoomer.$zoomImage);
    ok(zoomer.$zoomImage.tagName === "IMG");
    ok(zoomer.$zoomImage.src.match(/42112\.jpg$/));
});


test("Loading a zoom image with callback", function () {

    expect(4);

    var config = {
        callbacks: {
            "zoom image loading": function (src) {
                equal(src, "/42112.jpg");
            }
        }
    };

    var zoomer   = new Closeup(wrapperClass, baseImgClass, config);

    zoomer.setZoomImage("/42112.jpg");

    ok(zoomer.$zoomImage);
    ok(zoomer.$zoomImage.tagName === "IMG");
    ok(zoomer.$zoomImage.src.match(/42112\.jpg$/));
});

test("Callback with successful load", function () {

    expect(1);

    var config = {
        callbacks: {
            "zoom image loaded": function ($zoomedImage) {
                equal($zoomedImage.width, 600);
            }
        }
    };

    var zoomer = new Closeup(wrapperClass, baseImgClass, config);
    var img    = document.createElement("IMG");

    img.width  = 600;
    img.height = 600;

    zoomer.imageLoaded(img, zoomer.mapper)();
});