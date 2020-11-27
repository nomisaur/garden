const webpack = require("webpack");
const path = require("path");

const resolvePath = (filePath) => path.resolve(__dirname, filePath);

module.exports = {
  entry: resolvePath("./src/index.js"),
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx"],
  },
  output: {
    path: resolvePath("./dist"),
    filename: "bundle.js",
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  devServer: {
    contentBase: resolvePath("./dist"),
    hot: true,
  },
};
