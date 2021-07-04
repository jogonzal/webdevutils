const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = env => {
  return {
    entry: {
      webdevutils: './src/index.tsx'
    },
    plugins: [
      // Run eslint and typescript in a separate process
      new ForkTsCheckerWebpackPlugin({
        // async:false = wait on ts/eslint before finishing
        async: false,
        typescript: {
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
            declaration: true,
            global: true,
          },
        },
        // don't eslint test while compiling
        eslint: {
          files: "./src/**/*.{ts,tsx}",
        }
      }),

      // Check for circular dependencies
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /a\.js|node_modules/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd(),
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
          test: /\.(jpe?g|png|gif|svg|ttf|woff|woff2|eot|ico|json|mp3|wav)$/i,
          loader: 'file-loader',
          options:{
            name: 'asset/[name].[ext]?h=[contenthash]'
          }
        }
      ]
    },
    devtool: 'source-map',
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