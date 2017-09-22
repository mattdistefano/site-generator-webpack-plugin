import * as vm from 'vm';

interface VmSandbox {
  allExports: { [name: string]: any };
  document: {};
  console: Console;
  window: VmSandbox;
}

const umdUnwrapper = (chunk: string, index: number) => `
const chunk${index}Module = { exports: {} };

(function(module, exports) {
  ${chunk};
})(chunk${index}Module, chunk${index}Module.exports);

Object.assign(allExports, chunk${index}Module.exports);
`;

export const getRenderer = (chunks: string[]) => {
  const sandbox: VmSandbox = {
    allExports: {},
    document: {},
    window: null,
    console
  };

  // add window as an alias of the sandbox itself
  // this is necessary as webpack basically expects window to be the global
  // i.e. webpackJsonp is set on window, but accessed as a global
  sandbox.window = sandbox;

  // generate a script containing the content of all our chunks
  // with each chunk wrapped in an IIFE that provides a separate
  // module and exports object for the UMD wrapper
  // then aggregate the exports
  const code = chunks.map(umdUnwrapper).join('');

  const result = vm.runInNewContext(code, sandbox);

  // finally, look for an exported function named __PRERENDERER
  // the expectation being that one of the chunks will contain it
  if (typeof result.__PRERENDERER !== 'function') {
    throw new Error('No chunk exports a __PRERENDERER function');
  }

  return result.__PRERENDERER;
};
