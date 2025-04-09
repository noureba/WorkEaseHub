/* eslint-disable no-undef */
require("dotenv").config();
const htmlWebpackPlugin = require("html-webpack-plugin");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  mode: process.env.MODE,
  entry: {
    index: "./src/ts/index.ts",
    privacy: "./src/ts/privacy.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          process.env.MODE === "production"
            ? miniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[name].[contenthash][ext]",
        },
      },
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      chunks: ["index"],
    }),
    new htmlWebpackPlugin({
      template: "./src/privacy.html",
      filename: "privacy.html",
      chunks: ["privacy"],
    }),
    new miniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],

  devServer: {
    static: path.resolve(__dirname, "dist"),
    port: 3000,
    hot: false,
    open: true,
  },
};
