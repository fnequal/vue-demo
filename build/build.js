'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

// 终端显示轮转loading
const ora = require('ora')
// 打包前删除旧文件
const rm = require('rimraf')
const path = require('path')
// 命令行彩色输出插件 
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

// 终端显示ora库的轮转效果
const spinner = ora('building for production...')
spinner.start() //开始loading

// 删除dist/static下的文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop() //停止loading
    if (err) throw err
    // 编译完成，终端输出编译的文件
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
