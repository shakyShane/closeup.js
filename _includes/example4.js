var zoomer =
    new Closeup("#example1", "#img1", {loadDelay: 2000});

var button   = document.getElementById("startZoom");

// Add listener to button
button.addEventListener("click", function (evt) {

    evt.preventDefault();

    // Set waiting text on button
    button.innerText = "Loading, Please Wait...";

    // Set the zoom image, and reset the button the text when loaded
    zoomer.setZoomImage("images/image1-large.jpg", function () {
        button.innerText = "Ready :)";
    });

}, false);

