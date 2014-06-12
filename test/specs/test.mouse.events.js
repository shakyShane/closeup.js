
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

asyncTest("Not setting the mouse events", function () {

    expect(1);

    new Closeup(wrapperClass, baseImgClass, {
        callbacks: {
            "not set mouse events": function () {
                ok(1);
                start();
            }
        },
        hover: false
    });
});


asyncTest("Setting the mouse events", function () {

    expect(1);

    new Closeup(wrapperClass, baseImgClass, {
        callbacks: {
            "set mouse events": function () {
                ok(1);
                start();
            }
        }
    });
});