_# vue-demo

> vue-cli项目详解，各文件内都有相关注释

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# test code format
npm run lint

# build for production and view the bundle analyzer report
npm run build --report
```

## Tips

在用vue-cli初始化项目时，会遇到Vue Build选择，第一个是Runtime + Compiler，第二个则是Runtime-only。vue.js 2.0之后，为了支持服务端渲染，编译器不能依赖于DOM，所以必须将编译器和运行时分开，这就形成了独立构建（编译器 + 运行时）和运行时构建（仅运行时）。运行时构建不包含模板编译器，它比独立构建轻大约6kb min+gzip 的大小，因此不支持template选项。在这里我们选择运行时构建即可。
项目初始采用了webpack官方提供的webpack-dev-server插件，它是一个小型的Express服务器，可以为通过webpack打包生成的资源文件提供web服务，webpack.dev.conf.js有相关的配置。在这里，我们还是用dev-server.js搭建本地服务，dev.client.js配置客户端接收推送消息，刷新页面，实现热重载。

## Introduction

```
├── build                           
│   ├── build.js                            生成环境构建代码
│   ├── check-versions.js                   检测node、npm的版本
│   ├── dev-client.js                       热重载相关
│   ├── dev-server.js                       构建本地服务器
│   ├── utils.js                            webpack构建相关工具方法
│   ├── vue-loader.conf.js                  .vue文件所用配置
│   ├── webpack.base.conf.js                webpack基础配置
│   ├── webpack.dev.conf.js                 开发环境webpack配置
│   ├── webpack.test.conf.js                测试环境webpack配置
│   └── webpack.prod.conf.js                生产环境webpack配置
├── config                          
│   ├── dev.env.js                          开发环境变量
│   ├── index.js                            开发、生产环境配置变量
│   ├── test.env.js                         测试环境变量
│   └── prod.env.js                         生产环境变量
├── node_modules                            项目依赖包
├── src 
│   ├── App.vue                             页面入口文件
│   ├── assets                              静态资源，会被webpack构建
│   │   └── logo.png
│   ├── components                          vue公共组件
│   │   └── Hello.vue
│   ├── router                              路由配置
│   │   └── index.js
│   └── main.js                             页面入口文件
├── static                                  静态资源，不会被webpack构建
├── .babelrc                                babel配置文件
├── .editorconfig                           编辑器代码格式
├── .eslintrc                               eslint配置
├── .eslintignore                           eslint检查忽略的文件
├── .gitignore                              git忽略的文件
├── .postcssrc.js                           postcss配置文件
├── index.html                              html模板
├── package.json                            项目基本信息
└── README.md                               阅读说明
```
