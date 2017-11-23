'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
// 合并webpack配置中的数组和对象
const merge = require('webpack-merge')
// 根据配置生成index.html文件
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 用于更友好地输出webpack的警告、错误等信息
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// 用于查找端口
// const portfinder = require('portfinder')

// 给每个入口加上dev-client文件，用于跟dev-server通信，实现热重载
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

// const devWebpackConfig = merge(baseWebpackConfig, {
module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool, //devtool调试的source map模式
  
  // these devServer options should be customized in /config/index.js
  // webpack-dev-server相关配置 
  // devServer: {
  //   clientLogLevel: 'warning',
  //   historyApiFallback: true,
  //   hot: true,
  //   host: process.env.HOST || config.dev.host,
  //   port: process.env.PORT || config.dev.port,
  //   open: config.dev.autoOpenBrowser,
  //   overlay: config.dev.errorOverlay ? {
  //     warnings: false,
  //     errors: true,
  //   } : false,
  //   publicPath: config.dev.assetsPublicPath,
  //   proxy: config.dev.proxyTable,
  //   quiet: true, // necessary for FriendlyErrorsPlugin
  //   watchOptions: {
  //     poll: config.dev.poll,
  //   }
  // },
  plugins: [
    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }), 
    // 开启webpack热重载功能
    new webpack.HotModuleReplacementPlugin(),
    // new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    // webpack编译过程中出错的时候跳过，不会阻塞编译，在编译结束后报错
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // index.html模板注入
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // 开启错误信息提示插件
    new FriendlyErrorsPlugin()
  ]
})

// module.exports = new Promise((resolve, reject) => {
//   portfinder.basePort = process.env.PORT || config.dev.port
//   portfinder.getPort((err, port) => {
//     if (err) {
//       reject(err)
//     } else {
//       // publish the new Port, necessary for e2e tests
//       process.env.PORT = port
//       // add port to devServer config
//       devWebpackConfig.devServer.port = port

//       // Add FriendlyErrorsPlugin
//       devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
//         compilationSuccessInfo: {
//           messages: [`Your application is running here: http://${config.dev.host}:${port}`],
//         },
//         onErrors: config.dev.notifyOnErrors
//         ? utils.createNotifierCallback()
//         : undefined
//       }))

//       resolve(devWebpackConfig)
//     }
//   })
// })
