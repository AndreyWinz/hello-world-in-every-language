sap.ui.define([
    "sap/m/Text",
    "sap/ui/core/mvc/XMLView"
], function (Text, XMLView) {
    "use strict";

    // Create a simple Text control and place it in the body
    new Text({
        text: "Hello World"
    }).placeAt("content");
});
