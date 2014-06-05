
module( "event", {
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

test("Test Instance creation", function () {

    expect(8);

    var zoomer = new Closeup(".zoomer", ".base-image", function () {
        equal(this.$wrapper.tagName, "DIV");
        equal(this.$baseImg.tagName, "IMG");
    });

    var wrapper = zoomer.$wrapper;
    var baseImg = zoomer.$baseImg;

    equal(wrapper.tagName, "DIV");
    equal(wrapper.style.position, "relative");
    equal(wrapper.style.overflow, "hidden");

    equal(baseImg.tagName, "IMG");
    equal(baseImg.style.display, "block");
    equal(baseImg.style.zIndex, 1);
});