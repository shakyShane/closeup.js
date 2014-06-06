(function (window, Norman, undefined) {

    var elem         = document.querySelector(".image");
    var baseImg      = document.querySelector(".base-image");
    var controls     = document.getElementById("controls");
    var zoomTrigger  = document.createElement("BUTTON");
    var hideZoom     = document.createElement("BUTTON");
    var loader       = document.createElement("DIV");

    loader.className = "loader";
    loader.innerText = "Loading...";

    elem.appendChild(loader);
    var zoomElemExists = false;

//    var switchers   = document.querySelector(".switcher");

//    switchers.addEventListener("click", function (evt) {
//        showLoader();
//        evt.preventDefault();
//
//        if (evt.target.href !== baseImg.src) {
//            baseImg.src = evt.target.href;
//            baseImg.onload = function () {
//                loadSubject(evt.target.dataset.large);
//            };
//        } else {
//            loadSubject(evt.target.dataset.large);
//        }
//    });

    zoomTrigger.innerText = "Zoom In";
    hideZoom.innerText    = "Zoom Out";

    // DONE
    var zoomVisible         = false;
    var hasOpacity          = typeof elem.style.opacity         !== "undefined";
    var hasTransforms       = typeof elem.style.transform       !== "undefined";
    var hasWebkitTransforms = typeof elem.style.webkitTransform !== "undefined";

    var offsetX;
    var offsetY;

    var MAX_X = 0;
    var MAX_Y = 0;

    var subjectImg;

//    if (!hasOpacity) {
//        zoomedImg.style.display = "none";
//    }

    // DONE
    var elemX = elem.getBoundingClientRect().left;
    var elemY = elem.getBoundingClientRect().top;

    if ("ontouchstart" in window) {
//        controls.appendChild(zoomTrigger);
//        controls.appendChild(hideZoom);
//        zoomTrigger.addEventListener("touchstart", showZoomed, false);
//        hideZoom.addEventListener("touchstart", hideZoomed, false);
    } else {
        var touch = document.createElement("DIV");
        touch.className = "touch";
        elem.appendChild(touch);
    }

    // SKIP
    var debugElem = document.querySelector("#debug");

    // DONE
    var mapper = new Norman({
        viewBox: {
            height: baseImg.clientHeight,
            width: baseImg.clientWidth
        },
        boundary: 50
    });

    // Link to subject
    loadSubject("img/zoomed.jpg");

    // Add Mouse Events
    elem.addEventListener("mousemove", function (evt) {
        updateMousePosition(Math.abs(elemX - evt.clientX), Math.abs(elemY - evt.clientY));
    });

    elem.addEventListener("mouseenter", showZoomed);
    elem.addEventListener("mouseleave", hideZoomed);

    /**
     *
     */
    function loadSubject(src) {

        var newImg;

        if (!subjectImg) {

            newImg = document.createElement("IMG");
            newImg.className = "zoom-image";
            newImg.src = src;

            elem.appendChild(newImg);

            subjectImg = newImg;

        } else {

            subjectImg.src = src;
        }

        subjectImg.onload = function () {

            mapper.mapTo({
                height: subjectImg.height,
                width: subjectImg.width
            });

            MAX_X = -(subjectImg.width - baseImg.width);
            MAX_Y = -(subjectImg.height - baseImg.height);

            updateElem(MAX_X / 2, MAX_Y / 2);

            subjectImg.addEventListener("touchstart", onTouchStart, false);
            subjectImg.addEventListener("touchmove", onTouchMove, false);

            setTimeout(function () {
                hideLoader();
            }, 2000);
        };
    }

    /**
     * @param evt
     */
    function onTouchStart(evt) {

        evt.preventDefault();

        if (!zoomVisible) {
            return;
        }

        offsetX = evt.touches[0].pageX - subjectImg.getBoundingClientRect().left + elem.offsetLeft;
        offsetY = evt.touches[0].pageY - subjectImg.getBoundingClientRect().top + elem.offsetTop;
    }

    /**
     * @param evt
     */
    function onTouchMove(evt) {

        evt.preventDefault();

        var newY = 0;
        var newX = 0;

        var tempX = evt.touches[0].pageX - offsetX;
        var tempY = evt.touches[0].pageY - offsetY;

        if (tempY < 0) {

            if (tempY < MAX_Y) {
                newY = MAX_Y;
            } else {
                newY = evt.touches[0].pageY - offsetY;
            }
        }

        if (tempX < 0) {
            if (tempX < MAX_X) {
                newX = MAX_X;
            } else {
                newX = evt.touches[0].pageX - offsetX;
            }
        }

        updateElem(newX, newY);
    }

    /**
     * Show the Zoomed Image
     * @param evt
     */
    function showZoomed(evt) {
        evt.preventDefault();
        zoomVisible = true;

        if (hasOpacity) {
            subjectImg.style.opacity = "1";
        } else {
            subjectImg.style.display = "block";
        }
    }

    /**
     * Hide the zoomed image
     * @param evt
     */
    function hideZoomed(evt) {
        evt.preventDefault();
        zoomVisible = false;
        if (hasOpacity) {
            subjectImg.style.opacity = "0";
        } else {
            subjectImg.style.display = "none";
        }
    }

    /**
     * Use Norman to translate mouse coords
     * @param x
     * @param y
     */
    function updateMousePosition(x, y) {

        var newValues = mapper.map(x, y);

        if (newValues.inHitArea) {
            updateElem(newValues.x, newValues.y);
        }
    }

    /**
     * Alter the Dom
     * @param x
     * @param y
     * @returns {*}
     */
    function updateElem(x, y) {

        if (hasWebkitTransforms) {
            // Webkit + Blink
            return subjectImg.style.webkitTransform = translateText(Math.ceil(x), Math.ceil(y));
        }

        if (hasTransforms) {
            // IE 10 +
            return subjectImg.style.transform = translateText(Math.ceil(x), Math.ceil(y));
        } else {
            // IE 9
            subjectImg.style.top = Math.ceil(y) + "px";
            subjectImg.style.left = Math.ceil(x) + "px";
        }
    }

    /**
     * String helper for Translate text
     * @param x
     * @param y
     * @returns {string}
     */
    function translateText(x, y) {
        var tmp = "translate3d(%xpx, %ypx, 0)";
        return tmp
            .replace("%x", x)
            .replace("%y", y);
    }

    function showLoader() {
        loader.style.display = "block";
    }
    function hideLoader() {
        loader.style.display = "none";
    }

    /**
     * Debug
     * @param msg
     */
    function debug(msg) {
        debugElem.innerHTML = msg;
    }

})(window, Norman);