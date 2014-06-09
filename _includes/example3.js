var zoomer =
    new Closeup("#example1", "#img1")
        .setZoomImage("../images/image1-large.jpg");

var thumbs = document.getElementById("thumbs");
var links  = thumbs.querySelectorAll("a");

// Listen for clicks on the thumb wrapper
thumbs.addEventListener("click", function (evt) {

    evt.preventDefault();

    // Get the small image src & the zoom image src
    var baseImgSrc = evt.target.parentNode.href;
    var zoomImgSrc = evt.target.dataset.zoomImage;

    // Do nothing if the same image is clicked
    if (zoomer.$baseImage.src.match(new RegExp(baseImgSrc))) {
        return;
    }

    // use the API to set the base & zoom image
    zoomer.setBaseImage(baseImgSrc).setZoomImage(zoomImgSrc);


    // Remove the `active` class from the thumbs
    [].forEach.call(links, function (item) {
        item.classList.remove("active");
    });

    // Apply the active class to the clicked thumb.
    evt.target.parentNode.classList.add("active");

}, true);

