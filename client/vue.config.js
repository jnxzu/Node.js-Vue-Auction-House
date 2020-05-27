module.exports = {
  outputDir: "../server/public",
  pages: {
    index: {
      entry: "src/pages/index/main.js",
      template: "public/index.html",
      title: "Home",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    dashboard: {
      entry: "src/pages/dashboard/main.js",
      template: "public/index.html",
      title: "Dashboard",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    list: {
      entry: "src/pages/list/main.js",
      template: "public/index.html",
      title: "New Listing",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    listings: {
      entry: "src/pages/listings/main.js",
      template: "public/index.html",
      title: "Listings",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    chats: {
      entry: "src/pages/chats/main.js",
      template: "public/index.html",
      title: "Chats",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    login: {
      entry: "src/pages/login/main.js",
      template: "public/index.html",
      title: "Login",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
    signup: {
      entry: "src/pages/signup/main.js",
      template: "public/index.html",
      title: "Signup",
      chunks: ["chunk-vendors", "chunk-common", "index"],
    },
  },
};
