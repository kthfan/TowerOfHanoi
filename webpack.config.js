// webpack.config.prod.js
var path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: ['./src/index'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  // mode: 'development',
  // devtool: false,
  resolve: {
    extensions: [".jsx", ".js", ".tsx", ".ts", ".json"],
    modules:[path.resolve(__dirname, 'node_modules')]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.js/]),
    new HTMLInlineCSSWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env'],
            },
          }
        ],
      },
      {
        test: /.jsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-react', '@babel/preset-env'],
            },
          }
        ],
      },
      {
        test: /.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/typescript', '@babel/preset-env'],
            },
          }
        ],
      },
      {
        test: /.tsx$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ['@babel/typescript', '@babel/preset-react', '@babel/preset-env'],
            },
          }
        ],
      },
      {
        test: /\.css$/i,
        use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
        ],
      },
      {
        test: /\.(mp3|png|jpg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 65536,
            },
          },
        ],
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin(),
    ],
  },
}