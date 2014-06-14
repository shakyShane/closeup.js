
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";


asyncTest("Loading a new base image with immediate callback", function () {

    expect(1);

    var myNode = document.getElementById("qunit-fixtures");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }

    var imgSrc = "base/fixtures/img/02-base.jpg";
    var regex  = new RegExp(imgSrc);
    var zoomer = new Closeup(wrapperClass, baseImgClass);

    zoomer.setBaseImage(imgSrc, function (elem) {
        ok(elem.src.match(regex));
        start();
    });
});


asyncTest("Loading a base image with callbacks", function () {

    expect(4);

    var imgSrc = "base/fixtures/img/600.jpg";
    var regex  = new RegExp("base/fixtures/img/600.jpg");

    var config = {

        callbacks: {
            "base image loading": function (src) {
                deepEqual(true, this.vars.baseImageLoading, "image loading var should be true");
                equal(src, imgSrc);
            },
            "base image loaded": function (elem) {
                deepEqual(false, this.vars.baseImageLoading, "image loading var should now be false");
                ok(elem.src.match(regex));
                start();
            }
        }
    };

    var zoomer = new Closeup(wrapperClass, baseImgClass, config);

    zoomer.setBaseImage(imgSrc);

});

asyncTest("Loading a base image with chaining", function () {

    expect(2);

    var baseSrc = "base/fixtures/img/600.jpg";
    var zoomSrc = "base/fixtures/img/1200.jpg";

    new Closeup(wrapperClass, baseImgClass)
        .setBaseImage(baseSrc, function () {
            ok(1);
        })
        .setZoomImage(zoomSrc, function () {
            ok(1);
            start();
        });
});