"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var to_string_asset_1 = require("../to-string-asset");
var get_renderer_1 = require("./get-renderer");
var insert_into_html_1 = require("./insert-into-html");
var get_chunks_source_1 = require("./get-chunks-source");
exports.render = function (compilation, pages, html) {
    var chunkSources = get_chunks_source_1.getChunksSource(compilation);
    // obtain a renderer function from the chunks
    var renderer = get_renderer_1.getRenderer(chunkSources);
    // use the function to pre-render the html for the directory tree
    var rendered = renderer(pages);
    for (var key in rendered) {
        // add html assets for each pre-rendered page
        compilation.assets[key.slice(1) + '.html'] = to_string_asset_1.toStringAsset(insert_into_html_1.insertIntoHtml(html, rendered[key]));
    }
};
//# sourceMappingURL=index.js.map