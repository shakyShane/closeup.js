
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Set Norman Mapping", function () {

    expect(4);

    var callbacks = {
        "set mapping": function (data) {
            ok(1);
        }
    };

    var zoomer   = new Closeup(wrapperClass, baseImgClass, {callbacks: callbacks});

    ok(zoomer.mapper);

    zoomer.setMapping({clientWidth: 100, clientHeight: 100});

    ok(zoomer.mapper.viewBox.width);
});