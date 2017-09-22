import { Page, IndexPage } from '@mattdistefano/site-generator';

import { toStringAsset } from '../to-string-asset';
import { getRenderer } from './get-renderer';
import { insertIntoHtml } from './insert-into-html';
import { getChunksSource } from './get-chunks-source';

type TPage = Page | IndexPage;

export const render = (compilation: any, pages: TPage[], html: string) => {
  const chunkSources = getChunksSource(compilation);

  // obtain a renderer function from the chunks
  const renderer = getRenderer(chunkSources);

  // use the function to pre-render the html for the directory tree
  const rendered = renderer(pages);

  for (let key in rendered) {
    // add html assets for each pre-rendered page
    compilation.assets[key.slice(1) + '.html'] = toStringAsset(
      insertIntoHtml(html, rendered[key])
    );
  }
};
