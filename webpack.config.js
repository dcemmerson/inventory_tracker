require('core-js');
require('regenerator-runtime/runtime');
const webpack = require('webpack')
const dotenv = require('dotenv');

var path = require('path');

module.exports = () => {

  const env = dotenv.config().parsed;

  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    devServer: {
      proxy: {
        "/.netlify/functions": "http://localhost:9000",
    },
    },
    name: 'js',
      //mode: 'production',
      mode: 'development',
        resolve: {
      alias: {
        Img: path.resolve(__dirname, 'src/common/img'),
          JS: path.resolve(__dirname, 'src/common/js'),
    }
    },
    entry: {
      index: ['./src/index.jsx'],

  },
  devtool: 'inline-source-map',
    plugins: [
           new webpack.DefinePlugin(envKeys)
    ],
      output: {
      filename: '[name].min.js',
        chunkFilename: '[name].min.js',
          path: path.resolve(__dirname, 'dist'),
            publicPath: '/',
  },
    target: 'web',
      module: {
      rules: [
        {
          test: /\.(m?js|jsx)$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    browsers: ["chrome 61", "firefox 58", "safari 11"]
                  },
                  useBuiltIns: 'usage',
                  corejs: '3',
                }],
                ['@babel/preset-react'],
              ],
              cacheDirectory: true,

            }
          }
        },
        {
          test: /\.(scss|css)$/,
          //                   exclude: /(node_modules)/,
          use: [
            {
              loader: 'style-loader'
            }, {
              loader: 'css-loader',
            }, {
              loader: 'postcss-loader',
              options: {
                plugins: function () {
                  return [
                    require('autoprefixer')
                  ];
                }
              }
            }, {
              loader: 'sass-loader',
            },
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader',
          ]
        },
      ]
    },

  }
}
