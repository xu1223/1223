const path = require('path')
const webpack = require('webpack');
const readConf = require('./_script/readConfig')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const env = readConf(`../.env${process.env.NODE_ENV == 'dev' ? '' : '.' + process.env.NODE_ENV}`)

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  devtool: false,
  entry: {
    app: resolve('app/index.jsx'),
    // 将 第三方依赖 单独打包
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'es6-promise',
      'isomorphic-fetch',
      'immutable'
    ]
  },
  output: {
    path: resolve('/build'),
    filename: "[name].[chunkhash:8].js",
    publicPath: '/',
    chunkFilename: '[name]_[chunkhash:8]_chunk.js'
  },

  resolve: {
    extensions: ['*', '.jsx', '.js'],
    alias: {
      'components': resolve('app/components'),
      'fetch': resolve('app/fetch'),
      'static': resolve('app/static'),
      'config': resolve('app/config'),
      'advanced': resolve('app/advanced'),
      'util': resolve('app/util'),
      'files': resolve('app/static/file'),
      'sagas': resolve('app/sagas/actions'),
      "@": resolve('app')
    }
  },

  module: {
    rules: [{ //加载器
      test: /\.(js|jsx)$/, //匹配
      exclude: /node_modules/, //不包含
      loader: 'babel-loader', //加载器的一个插件
      query: {
        cacheDirectory: true,
        plugins: [
          ["import", {
            libraryName: "antd",
            style: true
          }]
        ]
      }
    },
    {
      test: /\.css$/,
      use: [
        miniCssExtractPlugin.loader,
        {
          loader: 'css-loader!postcss-loader'
        }
      ]
    },
    {
      test: /\.less$/,
      use: [
        miniCssExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1
          }
        }, {
          loader: 'less-loader',
          options: {
            modifyVars: {
              'hack': `true; @import "${__dirname}/app/core/style/index";`, // Override with less file
            },
            javascriptEnabled: true,
          },
        }
      ]
    }, {
      test: /\.(png|gif|jpg|jpeg|bmp)$/i,
      loader: 'url-loader?limit=8192&name=./[name].[ext]?[hash]'
    }, // 限制大小5kb
    {
      test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
      loader: 'url-loader?limit=8192&name=./[name].[ext]?[hash]'
    }, // 限制大小小于5k
    // 限制大小5kb
    {
      test: /\.(xlsx|xls|csv|docx)($|\?)/i,
      loader: 'file-loader?limit=8192&name=./[name].[ext]'
    }]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
        },
      })
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          name: "venders",
          chunks: "all",
          minChunks: 2
        }
      }
    }
  },
  plugins: [
    new ProgressBarPlugin({
      format: '  build [:bar] ' +
        chalk.green.bold(':percent') +
        ' (:elapsed seconds)'
    }),
    // 进度条
    new WebpackBar(),
    new webpack.LoaderOptionsPlugin({
      options: {}
    }),
    // html 模板插件
    new HtmlWebpackPlugin({
      template: resolve('/app/index.tmpl.html'),
      favicon: resolve('/app/favicon.ico'),
      title: "和新信息化系统"
    }),

    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurrenceOrderPlugin(),
    new miniCssExtractPlugin({
      filename: 'index.[contenthash:8].css'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: function () {
          return ['autoprefixer']
        }
      }
    }),
    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env': env
    }),
    new CopyWebpackPlugin([{ from: resolve('/public'), to: resolve('/build/') }])
  ]
}