enyo.kind({
    name: "HelloWorld", // The name of your new kind
    kind: enyo.Control, // It inherits from enyo.Control
    tag: 'p', // It will render as a <p> tag
    content: 'Hello, World!', // The text content
    style: 'color: blue;' // Optional styling
});

// Create an instance of the kind and render it into the document body
var controlInstance = new HelloWorld({});
controlInstance.renderInto(document.body);
