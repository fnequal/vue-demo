'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// 用于将static中静态文件复制到dist的插件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 根据配置生成index.html文件
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 抽离css，将样式文件单独打包
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// 对css文件压缩、去重
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const env = require('../config/prod.env')

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    // 样式文件rules
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  // 输出的路径和命名规范
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    // chunkFilename在require.ensure加载模块的时候出现
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // UglifyJs do not support ES6+, you can also use babel-minify for better treeshaking: https://github.com/babel/minify
    new webpack.optimize.UglifyJsPlugin({
      // 压缩，忽略警告
      compress: {
        warnings: false
      },
      sourceMap: config.build.productionSourceMap, //线上生成soucemap文件，便于调试；上线后的devtool配置为source-map
      parallel: true //使用多进程并行运行和文件缓存来提高构建速度
    }),
    // extract css into its own file
    // 将css提取到单独的文件
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // set the following option to `true` if you want to extract CSS from
      // codesplit chunks into this main css file as well.
      // This will result in *all* of your app's CSS being loaded upfront.
      allChunks: false, //提取所有的chunk，默认只提取initial chunk
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // 优化、最小化css，简单使用extract-text-webpack-plugin可能造成css重复
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
      ? { safe: true, map: { inline: false } }
      : { safe: true }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // 将生产的文件注入到index.html
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true, //所有JavaScript资源插入到body元素的底部
      minify: {
        removeComments: true, //删除注释
        collapseWhitespace: true, //删除空格
        removeAttributeQuotes: true //删除html标签属性的双引号
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency' //注入时，根据依赖先后顺序注入，manifest -> vendor -> app 
    }),
    // keep module.id stable when vender modules does not change
    // 对模块路径进行MD5摘要，生成四位字符的module.id，使module.id稳定；打包后的文件更小，也不泄露路径
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    // webpack打包的每个模块都会被包装在一个单独的函数中，导致JS在浏览器中的执行速度变慢
    // ModuleConcatenationPlugin将一些有联系的模块，放到一个函数里面
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    // 将所有从node_modules引入的文件提取到verdor.js，即抽取库文件
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      //  在传入公共chunk(commons chunk)之前所需要包含的最少数量的chunks
      // 这里指定范围是来自node_modules的js文件
      minChunks: function (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // 从vendor中提取manifest，业务代码发生变化时，vendor的hash不变。充分利用浏览器的缓存
    // module管理打码
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    // 创建一个新的异步公共chunk，与app并行加载
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3 //公共模块被使用的最小次数
    }),

    // 将static文件里的静态资源复制到dist/static
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

// 是否开启gzip压缩，需要服务端配合设置
if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]', //目标资源名称
      algorithm: 'gzip', //压缩算法
      test: new RegExp( //匹配资源
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240, //只有大小大于10k的资源会被处理
      minRatio: 0.8 //只有压缩率小于0.8的资源才会被处理
    })
  )
}

// 如果开启report，则通过插件给出webpack构建打包后的产品分析报告
if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
