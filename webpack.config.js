var webpack = require("webpack"),
    CleanWebpackPlugin = require("clean-webpack-plugin"),
    CopyWebpackPlugin = require("copy-webpack-plugin"),
    FlowWebpackPlugin = require('flow-webpack-plugin'),
    HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin'),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    UglifyJsPlugin = require('uglifyjs-webpack-plugin'),
    WriteFilePlugin = require("write-file-webpack-plugin");
    env = require("./utils/env"),
    fileSystem = require("fs"),
    path = require("path");

var isDev = env.NODE_ENV === "development" || 0;

var options = {
  entry: {
    convert: path.join(__dirname, "demo", "ConvertApp.js"),
    demo: path.join(__dirname, "demo", "index.js"),
    playground: path.join(__dirname, "playground", "playground.js"),
    ui: path.join(__dirname, "demo", "UIExamples.js"),
  },
  output: {
    path: path.join(__dirname, "bin"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env', 'react'],
          plugins: ['transform-class-properties']
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    alias: {}
  },
  plugins: [
    new FlowWebpackPlugin(),
    // clean the web folder
    new CleanWebpackPlugin(["bin"]),
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "demo", "index.html"),
      filename: "index.html",
      chunks: ["demo"],
      inlineSource: isDev ? '$^' : '.(js|css)$'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "demo", "index.html"),
      filename: "playground.html",
      chunks: ["playground"],
      inlineSource: isDev ? '$^' : '.(js|css)$'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "demo", "index.html"),
      filename: "ui.html",
      chunks: ["ui"],
      inlineSource: isDev ? '$^' : '.(js|css)$'
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "demo", "index.html"),
      filename: "convert.html",
      chunks: ["convert"],
      inlineSource: isDev ? '$^' : '.(js|css)$'
    }),
    new HtmlWebpackInlineSourcePlugin(),
    new WriteFilePlugin()
  ]
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
} else {
  options.plugins.push(new UglifyJsPlugin());
}

module.exports = options;
