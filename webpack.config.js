var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
  devtool: debug ? "inline-sourcemap" : null,
  entry: __dirname + "/app/js/src/app.js",
  output: {
    path: __dirname + "/app/js",
    filename: "app.min.js"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ]
};
