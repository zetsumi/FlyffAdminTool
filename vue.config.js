module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options['transformAssetUrls'] = {
          video: ['src', 'poster'],
          source: 'src',
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src',
        };

        return options;
      });
  },
  configureWebpack: {
    devtool: 'source-map',
  },
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Flyff Admin Tool',
    },
  },
  pluginOptions: {
    i18n: {
      locale: 'fr',
      fallbackLocale: 'fr',
      localeDir: 'locales',
      enableInSFC: false,
    },
    electronBuilder: {
      externals: ['speedtest-net'],
      builderOptions: {
        productName: 'Flyff Admin Tool',
        publish: ['github']
      },
    },
  },
};
