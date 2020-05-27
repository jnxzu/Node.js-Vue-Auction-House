module.exports = {
  outputDir: "../server/public",
  pages: {
    index: {
      entry: "src/pages/index/main.js",
      template: "public/index.html",
      title: "Home",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
};
