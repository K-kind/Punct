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
  pages: {
    index: {
      entry: './src/main.js',
      title: 'Punct',
    }
  }
}
