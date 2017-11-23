'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    // 默认使用vue.common.js，若使用独立构建，需用'vue$': 'vue/dist/vue.esm.js',修改使用的vue文件
    alias: {
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      // 对src和test下的.vue、.js文件使用eslint-loader进行代码规范检查
      ...(config.dev.useEslint? [{
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        // To be safe, you can use enforce: "pre" section to check source files, not modified by other loaders (like babel-loader)
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter'),
          emitWarning: !config.dev.showEslintErrorsInOverlay //使emitter强制变成warning类型警告，不中止webpack编译
        }
      }] : []),
      // 对所有.vue文件使用vue-loader进行编译，把vue组件转化成js模块，允许vue组件的组成部分使用其他loader
      // vue-loader会解析这个文件中的每个语言块，然后传输到其它的loaders，最终输出到module.exports是vue组件的配置对象的CommonJS模块
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      // 对src和test下的.js文件使用babel-loader转换成es5
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      // 对图片等资源文件使用url-loader
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          // 小于10k的图片转化成base64编码的dataURL字符串写到代码中
          limit: 10000,
          // 其他的图片重命名转移到dist/static/img/下
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
