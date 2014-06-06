module("event", {
    setup: function() {
        document.body.focus();
        var fixtures = document.createElement("DIV");
        fixtures.id  = "qunit-fixtures";
        fixtures.innerHTML = window.__html__["fixtures/partial.html"];
        document.getElementsByTagName("body")[0].appendChild(fixtures);
    },
    teardown: function () {
        var myNode = document.getElementById("qunit-fixtures");
        while (myNode.firstChild) {
            myNode.removeChild(myNode.firstChild);
        }
        QUnit.reset();
    }
});