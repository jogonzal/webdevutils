const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./common");

const paths = {
  DIST: path.join(__dirname, "..", "..", "dist"),
  SRC: path.join(__dirname, "..", "..", "src"),
};

module.exports = merge(common(), {
  mode: "development",
  output: {
    filename: "[name].js",
    path: paths.DIST,
    crossOriginLoading: "anonymous",
    publicPath: "http://localhost:8080/",
  },
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
        ],
      },
    ],
  },
});
