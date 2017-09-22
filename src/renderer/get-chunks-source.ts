const sortChunks = require('webpack-sort-chunks').default;

export const getChunksSource = (compilation: any) => {
  const stats = compilation.getStats().toJson();

  // get the chunks in order by dependency
  const sortedChunks = sortChunks(stats.chunks);

  // extract the source of each chunk
  // TODO is this the right way to use chunk.files?
  return sortedChunks.map((chunk: any) =>
    compilation.assets[chunk.files[0]].source()
  );
};
