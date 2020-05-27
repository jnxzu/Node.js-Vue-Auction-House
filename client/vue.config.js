module.exports = {
  outputDir: "../server/public",
  pages: {
    index: {
      entry: "src/pages/index/main.js",
      template: "public/index.html",
      title: "Home",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    login: {
      entry: "src/pages/login/main.js",
      template: "public/index.html",
      title: "Login",
      chunks: ["chunk-vendors", "chunk-common", "login"],
    },
    signup: {
      entry: "src/pages/signup/main.js",
      template: "public/index.html",
      title: "Signup",
      chunks: ["chunk-vendors", "chunk-common", "signup"],
    },
  },
};
