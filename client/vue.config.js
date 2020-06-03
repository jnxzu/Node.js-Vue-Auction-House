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
    list: {
      entry: "src/pages/list/main.js",
      template: "public/index.html",
      title: "New Listing",
      chunks: ["chunk-vendors", "chunk-common", "list"],
    },
    listings: {
      entry: "src/pages/listings/main.js",
      template: "public/index.html",
      title: "Listings",
      chunks: ["chunk-vendors", "chunk-common", "listings"],
    },
    history: {
      entry: "src/pages/history/main.js",
      template: "public/index.html",
      title: "History",
      chunks: ["chunk-vendors", "chunk-common", "history"],
    },
    dashboard: {
      entry: "src/pages/dashboard/main.js",
      template: "public/index.html",
      title: "Dashboard",
      chunks: ["chunk-vendors", "chunk-common", "dashboard"],
    },
    chat: {
      entry: "src/pages/chat/main.js",
      template: "public/index.html",
      title: "Chat",
      chunks: ["chunk-vendors", "chunk-common", "chat"],
    },
  },
};
