"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertIntoHtml = function (html, rendered) {
    return html
        .replace('<div id="app"></div>', "\n    <div id=\"app\">" + rendered.content + "</div> \n    <script>window.__PRELOADED_STATE__ = " + rendered.state + ";</script>\n    ")
        .replace('<title></title>', "<title>" + rendered.title + "</title>")
        .replace('<meta name="description" content="">', "<meta name=\"description\" content=\"" + (rendered.description || '') + "\">");
};
//# sourceMappingURL=insert-into-html.js.map