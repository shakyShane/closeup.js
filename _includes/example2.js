var wrapper = document.querySelector("#example1");
var elem    = document.querySelector("#img1");

elem.onload = function () {
    var zoomer =
        new Closeup(wrapper, elem)
            .setZoomImage("/images/600.jpg");
};


