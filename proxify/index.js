const proxify = require("../plugin/proxify");


// Import alias for proxy code
// Allows for `import {proxify}`
proxify.proxify = proxify;
// Allows for strict ES Module support
proxify.default = proxify;
// Sets the default export
module.exports = proxify;
