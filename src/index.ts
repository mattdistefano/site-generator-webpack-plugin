import { Plugin, Compiler } from 'webpack';
import * as path from 'path';
import { generate } from '@mattdistefano/site-generator';

export * from './interfaces';

import { toStringAsset } from './to-string-asset';
import { render } from './renderer';

export interface SiteGeneratorWebpackPluginOptions {
  dataPath: string;
  prerender: boolean;
}

export class SiteGeneratorWebpackPlugin implements Plugin {
  private startTime = Date.now();
  private prevTimestamps: { [path: string]: number } = {};
  private absDataPath: string;
  private cachedHtml: string;

  constructor(private options: SiteGeneratorWebpackPluginOptions) {}

  hasChanges(compilation: any) {
    const keys = Object.keys(compilation.fileTimestamps);

    if (keys.length === 0) {
      // assume first run
      return true;
    }

    const changedFiles = keys.filter(
      watchfile =>
        watchfile.startsWith(this.absDataPath) &&
        watchfile.endsWith('.md') &&
        (this.prevTimestamps[watchfile] || this.startTime) <
          (compilation.fileTimestamps[watchfile] || Infinity)
    );

    this.prevTimestamps = compilation.fileTimestamps;

    return changedFiles.length > 0;
  }

  apply(compiler: Compiler) {
    this.absDataPath = path.isAbsolute(this.options.dataPath)
      ? this.options.dataPath
      : path.resolve(compiler.options.context, this.options.dataPath);

    compiler.plugin('this-compilation', compilation => {
      compilation.plugin(
        'html-webpack-plugin-after-emit',
        (htmlPluginData: any, callback: Function) => {
          this.cachedHtml = htmlPluginData.html.source();
          callback(null, htmlPluginData);
        }
      );
    });

    compiler.plugin('emit', async (compilation, done) => {
      if (!this.hasChanges(compilation)) {
        // only run if we have changes in the files we care about
        return done();
      }

      const pages = await generate(this.absDataPath);

      for (let page of pages) {
        // add json assets for each page
        compilation.assets[page.path.slice(1) + '.json'] = toStringAsset(
          JSON.stringify(page)
        );
      }

      if (!this.options.prerender) {
        return done();
      }

      render(compilation, pages, this.cachedHtml);

      done();
    });

    compiler.plugin('after-emit', (compilation, done) => {
      if (
        !compilation.contextDependencies.find(
          (d: string) => d === this.absDataPath
        )
      ) {
        compilation.contextDependencies.push(this.absDataPath);
      }

      done();
    });
  }
}
