module.exports = {

    toggleClass: function ($elem, className) {

        var string = $elem.className;

        var regex = new RegExp(" ?%s ?".replace("%s", className));

        if (string.match(regex)) {
            return string.replace(regex, "");
        }

        return [string, className].join(" ");
    }
};