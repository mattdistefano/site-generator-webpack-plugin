"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sortChunks = require('webpack-sort-chunks').default;
exports.getChunksSource = function (compilation) {
    var stats = compilation.getStats().toJson();
    // get the chunks in order by dependency
    var sortedChunks = sortChunks(stats.chunks);
    // extract the source of each chunk
    // TODO is this the right way to use chunk.files?
    return sortedChunks.map(function (chunk) {
        return compilation.assets[chunk.files[0]].source();
    });
};
//# sourceMappingURL=get-chunks-source.js.map