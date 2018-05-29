const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const EslintFriendlyFormatter = require('eslint-friendly-formatter');

const resolve = dir => path.join(__dirname, dir);

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: ['react-hot-loader/patch', './src/index.js'],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [resolve('src')],
        options: {
          formatter: EslintFriendlyFormatter,
        },
      },
      {
        test: /\.jsx?$/,
        include: /src/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /(\.css|\.scss)$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [resolve('src'), resolve('node_modules')],
    alias: {
      src: resolve('src'),
    },
  },
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: 'index.html',
    }),
  ],
  devServer: {
    hot: true,
    compress: true,
    contentBase: resolve('dist'),
    open: true,
    inline: true,
    overlay: true,
    stats: 'errors-only',
    port: 8080,
  },
};
