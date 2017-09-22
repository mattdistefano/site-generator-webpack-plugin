"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vm = require("vm");
var umdUnwrapper = function (chunk, index) { return "\nconst chunk" + index + "Module = { exports: {} };\n\n(function(module, exports) {\n  " + chunk + ";\n})(chunk" + index + "Module, chunk" + index + "Module.exports);\n\nObject.assign(allExports, chunk" + index + "Module.exports);\n"; };
exports.getRenderer = function (chunks) {
    var sandbox = {
        allExports: {},
        document: {},
        window: null,
        console: console
    };
    // add window as an alias of the sandbox itself
    // this is necessary as webpack basically expects window to be the global
    // i.e. webpackJsonp is set on window, but accessed as a global
    sandbox.window = sandbox;
    // generate a script containing the content of all our chunks
    // with each chunk wrapped in an IIFE that provides a separate
    // module and exports object for the UMD wrapper
    // then aggregate the exports
    var code = chunks.map(umdUnwrapper).join('');
    var result = vm.runInNewContext(code, sandbox);
    // finally, look for an exported function named __PRERENDERER
    // the expectation being that one of the chunks will contain it
    if (typeof result.__PRERENDERER !== 'function') {
        throw new Error('No chunk exports a __PRERENDERER function');
    }
    return result.__PRERENDERER;
};
//# sourceMappingURL=get-renderer.js.map