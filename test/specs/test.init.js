
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Instance creation with minimum 2 args", function () {

    var zoomer = new Closeup(wrapperClass, baseImgClass);

    var wrapper = zoomer.$wrapper;
    var baseImg = zoomer.$baseImage;

    equal(wrapper.tagName, "DIV");
    equal(wrapper.style.position, "relative");
    equal(wrapper.style.overflow, "hidden");

    equal(baseImg.tagName, "IMG");
    equal(baseImg.style.display, "block");
    equal(baseImg.style.zIndex, 1);
});

test("Instance creation with config arg", function () {
    var zoomer = new Closeup(wrapperClass, baseImgClass, {name: "shane"});
    equal(zoomer.opts.name, "shane");
});

test("Instance creation with callback", function () {
    expect(2);
    new Closeup(wrapperClass, baseImgClass, function () {
        ok(this.$wrapper);
        ok(this.$baseImage);
    });
});

test("Instance creation with config + callback", function () {
    expect(1);
    new Closeup(wrapperClass, baseImgClass, {name: "shane"}, function () {
        equal(this.opts.name, "shane");
    });
});

asyncTest("Instance creation with chaining", function () {
    expect(2);
    new Closeup(wrapperClass, baseImgClass)
        .setZoomImage("base/fixtures/img/600.jpg", function (elem) {
            ok(elem.src.indexOf("600.jpg"));
            equal(elem.style.maxWidth, "none");
            start();
        });
});

//otest("toggle Class", function () {
//
//    function toggle(string, className) {
//        var regex = new RegExp(" ?%s ?".replace("%s", className));
//        if (string.match(regex)) {
//            return string.replace(regex, "");
//        }
//        return [string, className].join(" ");
//    }
//
//    var subject = "image-zoomed";
//    equal(toggle(subject, "active"), "image-zoomed active");
//
//    subject = "image-zoomed active";
//    equal(toggle(subject, "active"), "image-zoomed");
//
//    subject = "active image-zoomed";
//    equal(toggle(subject, "active"), "image-zoomed");
//
//    subject = "active image-active-zoomed";
//    equal(toggle(subject, "active"), "image-active-zoomed");
//
//    subject = "active image-active-zoomed active-m";
//    equal(toggle(subject, "active"), "image-active-zoomed active-m");
//
//});