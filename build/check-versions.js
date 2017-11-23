'use strict'
// 命令行彩色输出插件
const chalk = require('chalk')
// 语义化版本检查插件
const semver = require('semver')
const packageConfig = require('../package.json')
// 执行Unix命令行的插件
const shell = require('shelljs')
// 开辟子进程执行指令cmd,并返回版本号
function exec (cmd) {
  return require('child_process').execSync(cmd).toString().trim()
}

// node和npm的版本要求
const versionRequirements = [
  {
    name: 'node',
    currentVersion: semver.clean(process.version), //把版本信息转化成规定格式，例v6.10.2 -> 6.10.2
    versionRequirement: packageConfig.engines.node //项目node版本要求>= 4.0.0
  }
]

if (shell.which('npm')) {
  versionRequirements.push({
    name: 'npm',
    currentVersion: exec('npm --version'),
    versionRequirement: packageConfig.engines.npm
  })
}

module.exports = function () {
  const warnings = []
  for (let i = 0; i < versionRequirements.length; i++) {
    const mod = versionRequirements[i]
    // 比较当前node、npm的版本是否符合要求，不符合则警告
    if (!semver.satisfies(mod.currentVersion, mod.versionRequirement)) {
      warnings.push(mod.name + ': ' +
        chalk.red(mod.currentVersion) + ' should be ' +
        chalk.green(mod.versionRequirement)
      )
    }
  }

  // 输出警告，提示用户升级，结束进程
  if (warnings.length) {
    console.log('')
    console.log(chalk.yellow('To use this template, you must update following to modules:'))
    console.log()
    for (let i = 0; i < warnings.length; i++) {
      const warning = warnings[i]
      console.log('  ' + warning)
    }
    console.log()
    process.exit(1)
  }
}
