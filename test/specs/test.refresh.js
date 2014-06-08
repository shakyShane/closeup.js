
var wrapperClass = ".zoomer";
var baseImgClass = ".base-image";

test("Instance creation with minimum 2 args", function () {

    var zoomer = new Closeup(wrapperClass, baseImgClass);

    zoomer.$baseImage.width = 1000;
    zoomer.$baseImage.height = 200;

    zoomer.refresh();

    equal(zoomer.mapper.viewBox.width, 1000);
    equal(zoomer.mapper.viewBox.height, 200);

});
