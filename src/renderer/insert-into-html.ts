import { Prerendered } from '../interfaces';

export const insertIntoHtml = (html: string, rendered: Prerendered) =>
  html
    .replace(
      '<div id="app"></div>',
      `
    <div id="app">${rendered.content}</div> 
    <script>window.__PRELOADED_STATE__ = ${rendered.state};</script>
    `
    )
    .replace('<title></title>', `<title>${rendered.title}</title>`)
    .replace(
      '<meta name="description" content="">',
      `<meta name="description" content="${rendered.description || ''}">`
    );
