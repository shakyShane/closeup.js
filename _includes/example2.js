var wrapper = document.querySelector(".image-wrapper");
var elem    = document.querySelector(".base-img");

elem.onload = function () {
    var zoomer =
        new Closeup(wrapper, elem)
            .setZoomImage("http://placekitten.com/600/600");
};


