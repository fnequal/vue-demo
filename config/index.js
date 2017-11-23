'use strict'
// Template version: 1.2.3
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    env: require('./dev.env.js'),
    // Paths
    assetsSubDirectory: 'static', //存放打包后文件的输出目录
    assetsPublicPath: '/', //指定资源文件引用的目录
    proxyTable: {}, //代理表
    port: 8080,

    /* webpack-dev-server的相关配置
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.HOST, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true, //编译出错时，在浏览器显示错误
    // notifyOnErrors: true, //配合friendly-errors-webpack-plugin
    // watch轮询时间
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-
    */

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true, //是否使用eslint
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false, //emitter类型

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true, //是否通过给文件名后加哈希查询值来避免生成的source map被缓存

    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false, //是否开启css的source maps
  },
  
  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true, //是否开启css的source maps
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map', //生成一个SourceMap文件
    
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'], // gzip模式下需要压缩的文件扩展名
    
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    // 是否展示webpack构建打包的分析报告
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
