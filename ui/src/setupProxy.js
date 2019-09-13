const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/graphql",
    proxy({
      target: `${process.env.PROXY}`,
      changeOrigin: true
    })
  );
};
