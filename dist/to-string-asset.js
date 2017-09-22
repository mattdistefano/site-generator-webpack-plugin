"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStringAsset = function (contents) {
    var b = new Buffer(contents);
    return {
        source: function () { return b; },
        size: function () { return b.byteLength; }
    };
};
//# sourceMappingURL=to-string-asset.js.map