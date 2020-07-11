module.exports = {
  configureWebpack: {
    devtool: 'source-map'
  },
  css: {
    loaderOptions: {
      scss: {
        data: '@import "./src/assets/sass/prepends.scss";'
      }
    }
  },
}
