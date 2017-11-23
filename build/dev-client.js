/* eslint-disable */
'use strict'
// 支持w3c规范, 一个浏览器w3c eventsource的ployfill, 在不支持事件源的浏览器里添加填充策略支持
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')

// 客户端收到更新动作，刷新页面
hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
