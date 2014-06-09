var config = {

    loadDelay: 2000, // fake a slow-loading image

    callbacks: {

        "init": function () {

            var loader = document.createElement("DIV");
            loader.className = "zoom-loader";
            loader.innerText = "Loading... please wait";

            this.$loader = loader;
            this.$wrapper.appendChild(this.$loader);
        },
        "zoom image loading": function () {
            this.$loader.style.display = "block";
        },
        "zoom image loaded": function () {
            this.$loader.style.display = "none";
        }
    }
};

var zoomer =
    new Closeup("#example1", "#img1", config)
        .setZoomImage("../images/image1-large.jpg");