"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var path = require("path");
var site_generator_1 = require("@mattdistefano/site-generator");
var to_string_asset_1 = require("./to-string-asset");
var renderer_1 = require("./renderer");
var SiteGeneratorWebpackPlugin = /** @class */ (function () {
    function SiteGeneratorWebpackPlugin(options) {
        this.options = options;
        this.startTime = Date.now();
        this.prevTimestamps = {};
    }
    SiteGeneratorWebpackPlugin.prototype.hasChanges = function (compilation) {
        var _this = this;
        var keys = Object.keys(compilation.fileTimestamps);
        if (keys.length === 0) {
            // assume first run
            return true;
        }
        var changedFiles = keys.filter(function (watchfile) {
            return watchfile.startsWith(_this.absDataPath) &&
                watchfile.endsWith('.md') &&
                (_this.prevTimestamps[watchfile] || _this.startTime) <
                    (compilation.fileTimestamps[watchfile] || Infinity);
        });
        this.prevTimestamps = compilation.fileTimestamps;
        return changedFiles.length > 0;
    };
    SiteGeneratorWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        this.absDataPath = path.isAbsolute(this.options.dataPath)
            ? this.options.dataPath
            : path.resolve(compiler.options.context, this.options.dataPath);
        compiler.plugin('this-compilation', function (compilation) {
            compilation.plugin('html-webpack-plugin-after-emit', function (htmlPluginData, callback) {
                _this.cachedHtml = htmlPluginData.html.source();
                callback(null, htmlPluginData);
            });
        });
        compiler.plugin('emit', function (compilation, done) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var pages, _i, pages_1, page;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.hasChanges(compilation)) {
                            // only run if we have changes in the files we care about
                            return [2 /*return*/, done()];
                        }
                        return [4 /*yield*/, site_generator_1.generate(this.absDataPath)];
                    case 1:
                        pages = _a.sent();
                        for (_i = 0, pages_1 = pages; _i < pages_1.length; _i++) {
                            page = pages_1[_i];
                            // add json assets for each page
                            compilation.assets[page.path.slice(1) + '.json'] = to_string_asset_1.toStringAsset(JSON.stringify(page));
                        }
                        if (!this.options.prerender) {
                            return [2 /*return*/, done()];
                        }
                        renderer_1.render(compilation, pages, this.cachedHtml);
                        done();
                        return [2 /*return*/];
                }
            });
        }); });
        compiler.plugin('after-emit', function (compilation, done) {
            if (!compilation.contextDependencies.find(function (d) { return d === _this.absDataPath; })) {
                compilation.contextDependencies.push(_this.absDataPath);
            }
            done();
        });
    };
    return SiteGeneratorWebpackPlugin;
}());
exports.SiteGeneratorWebpackPlugin = SiteGeneratorWebpackPlugin;
//# sourceMappingURL=index.js.map