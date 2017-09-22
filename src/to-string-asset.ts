export const toStringAsset = (contents: string) => {
  const b = new Buffer(contents);

  return {
    source: () => b,
    size: () => b.byteLength
  };
};
