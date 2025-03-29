const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new Dotenv({
          path: './.env.local',
          safe: true,
          systemvars: true,
          silent: true,
          defaults: false
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
          'process.env.REACT_APP_BUILD_TIME': JSON.stringify(new Date().toISOString())
        })
      ]
    },
    configure: (webpackConfig) => {
      // 最適化設定
      if (process.env.NODE_ENV === 'production') {
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            minSize: 20000,
            maxSize: 244000,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            automaticNameDelimiter: '~',
            cacheGroups: {
              defaultVendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true,
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
          runtimeChunk: 'single',
        };
      }
      
      return webpackConfig;
    }
  }
};
