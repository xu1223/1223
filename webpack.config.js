const path = require('path')
const webpack = require('webpack');
const readConf = require('./_script/readConfig')
const getProxyByConfig = require('./_script/util')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack4-plugin');
const WebpackBar = require('webpackbar');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');

const env = readConf(`../.env${process.env.NODE_ENV == 'dev' ? '' : '.' + process.env.NODE_ENV}`)
const destProxy = getProxyByConfig(env)

function resolve(dir) {
    return path.join(__dirname, dir)
}


console.log(env, destProxy)
module.exports = {
    devtool: 'cheap-eval-source-map',
    entry: resolve('app/index.jsx'),
    output: {
        path: resolve('/build'),
        filename: "bundle.js",
        chunkFilename: '[name]_[chunkhash:8]_chunk.js'
    },
    mode: "development", // 开发模式
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
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader?modules'
        },
        {
            test: /\.html$/,
            use: [
                  {
                    loader: require.resolve('html-loader')
                  }
                 ]
         },
        {
            test: /\.less$/,
            use: [{
                loader: 'style-loader',
            }, {
                loader: 'css-loader', // translates CSS into CommonJS
                options: {
                    importLoaders: 1,
                    // modules: true,
                    // localIndexName:"[name]__[local]___[hash:base64:5]"
                },
            }, {
                loader: 'less-loader', // compiles Less to CSS
                options: {
                    modifyVars: {
                        'hack': `true; @import "${__dirname}/app/core/style/index.less";`, // Override with less file
                    },
                    javascriptEnabled: true,
                },
            }],
        }, {
            test: /\.(png|gif|jpg|jpeg|bmp)$/i,
            loader: 'url-loader?limit=8192&name=./[name].[ext]?[hash]'
        }, // 限制大小5kb
        {
            test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
            loader: 'url-loader?limit=5000'
        }, // 限制大小小于5k
        // 限制大小5kb
        {
            test: /\.(xlsx|xls|csv|docx)($|\?)/i,
            loader: 'file-loader?limit=8192&name=./[name].[ext]'
        }
        ]
    },
    /* eslint: {
         configFile: '.eslintrc' // Rules for eslint
     },*/
    devServer: {
        publicPath: '/',
        proxy: destProxy,
        contentBase: './public',
        historyApiFallback: true, //不跳转
        host: '0.0.0.0',
        disableHostCheck: true,
        port: env.PORT,
        inline: true, //实时刷新
        hot: true // 使用热加载插件 HotModuleReplacementPlugin
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
            title: env.TITLE
        }),
        // 热加载插件
        new webpack.HotModuleReplacementPlugin(),
        // 打开浏览器
        new OpenBrowserPlugin({
            url: `http://localhost:${env.PORT}`
        }),
        // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
        new webpack.DefinePlugin({
            __DEV__: false,
            'process.env': env
        })
    ]
    
}
