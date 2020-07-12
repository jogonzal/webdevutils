const path = require('path');
const merge = require('webpack-merge')
const common = require('./common.js')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require('terser-webpack-plugin')

const paths = {
  DIST: path.join(__dirname, '..', '..', 'dist'),
  SRC: path.join(__dirname, '..', '..', 'src')
}

module.exports = merge.smartStrategy({
  plugins: 'append'
})(common(), {
  mode: 'production',
  optimization: {
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/,
        sourceMap: true,
        parallel: true,
        cache: true,
        terserOptions: {
          extractComments: true
        }
      })
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      '__IsLocal__': false,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash].css',
      chunkFilename: '[id]_[contenthash].css'
    }),
  ],
  devtool: 'source-map',
  output: {
    filename: '[name]_[contenthash].min.js',
    path: paths.DIST,
    // publicPath: 'https://jorgewebdeploymentakamai.azureedge.net/dincloud/', // Akamai CDN
    publicPath: 'https://jorgewebdeployment.azureedge.net/dincloud/', // Microsoft CDN
  },
  module: {
    rules: [{
      test: /\.s?css$/,
      use: [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'postcss-loader'
      ],
    }]
  }
});