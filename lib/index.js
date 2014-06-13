var Closeup = require("./closeup");

// AMD export

if(typeof define === "function" && define.amd) {
    define(function() {
        return Closeup;
    });
    // commonjs export
} else {
    window.Closeup = Closeup;
}