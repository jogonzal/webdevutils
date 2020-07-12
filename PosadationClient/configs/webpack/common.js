const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = env => {
  return {
    entry: {
      posadation: './src/index.tsx'
    },
    plugins: [
      new ForkTsCheckerWebpackPlugin({
        measureCompilationTime: true,
        tsconfig: './tsconfig.json',
        reportFiles: [
          "src/**/*",
        ],
        // Async false will make webpack compilation wait on this typechecker to finish before
        // reporting the compilation result. If typechecking fails, then webpack compilation fails too.
        async: false,
      }),

      // HTML entries
      new HtmlWebpackPlugin({
        template: './src/index.html'
      }),

      // Get full error detail for errors caught by windows.onerror (https://blog.sentry.io/2016/05/17/what-is-script-error.html)
      // More info: https://webpack.github.io/docs/configuration.html#output-crossoriginloading
      // https://reactjs.org/docs/cross-origin-errors.html
      new ScriptExtHtmlWebpackPlugin({
        custom: [
          {
            test: /\.js$/,
            attribute: 'crossorigin',
            value: 'anonymous'
          }
        ]
      }),

      // Run the bundle analyzer on every build
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        // generateStatsFile: true, // Build hangs when generating stats file, why?
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          enforce: 'pre',
          loader: 'eslint-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
                reportFiles: [
                  // Filters out any error happening inside of the imported node_modules code.
                  "src/**/*",
                ]
              }
            }
          ]
        },
        {
          test: /\.(jpe?g|png|gif|svg|ttf|woff|woff2|eot|ico|json)$/i,
          loader: 'file-loader',
          options:{
            name: 'asset/[name].[ext]?h=[contenthash]'
          }
        }
      ]
    },
    devServer: {
      // These are to allow for local development without CORS issues
      historyApiFallback: true,
      allowedHosts: [
        '*'
      ],
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Expose-Headers': '*',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    }
  }
};