var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

asyncTest("Setting the Position", function () {

    var imgSrc = "base/fixtures/img/600.jpg";

    expect(1);

    var zoomer = new Closeup(wrapperClass, baseImgClass, {
        callbacks: {
            "update zoom position": function (data) {
                equal(data.length, 2);
                start();
            }
        }
    }).setZoomImage(imgSrc);
});