# layer-fc Plugin

本插件帮助您通过[Serverless-Devs](https://github.com/Serverless-Devs/Serverless-Devs)工具和[FC组件](https://github.com/devsapp/fc)，方便的使用[层](https://help.aliyun.com/document_detail/193057.html) 管理您的函数

- [背景介绍](#背景介绍)
- [快速开始](#快速开始)
- [最佳实践](#最佳实践)
  - [公共依赖包](#公共依赖包)
  - [自定义customRuntime版本](#自定义customRuntime版本)
- [注意事项](#注意事项)
- [关于我们](#关于我们)

## 背景介绍

在开发项目的时候会遇到以下几个典型的场景

1. 多个项目中的公共依赖库，如何复用？
2. 项目的依赖文件每次部署的时候都上传，部署速度慢，如何加速部署进度？
3. custom runtime的默认版本比较旧，比如默认的nodejs版本是`10.x`版本,如何快速使用新版的nodejs runtime?

函数计算[层](https://help.aliyun.com/document_detail/193057.html)就是为上述场景量身定做

![](https://img.alicdn.com/imgextra/i4/O1CN01pOUOTN1MEcQtVJNJa_!!6000000001403-2-tps-1108-408.png)

## 快速开始

`layer-fc`本质是针对[FC组件](https://serverless-devs.com/fc/readme)进行增强。

还是遵循FC组件的[Yaml规范](https://serverless-devs.com/fc/yaml/readme)，区别在于 在执行部署之前声明对应的插件`layer-fc`

```yaml
actions: # 自定义执行逻辑
  pre-deploy: # 在deploy之前运行
    - plugin: layer-fc
```

### 参数说明

| 参数名称      | 数据类型     | 参数含义                              |
| ------------- | ------------ | ------------------------------------- |
| customRuntime | string       | 自定义环境,只作用于custom runtime     |
| name          | string       | 层的名称(作为唯一标识)                |
| codeUri       | string       | layer本地的路径地址                   |
| ossBucket     | string       | oss Bukect 名                         |
| ossKey        | string       | ossKey(必须压缩包文件，比如layer.zip) |
| runtime       | list[string] | 作用的runtime                         |
| forceUpdate   | Boolean      | 是否强制更新(默认是false)             |




#### customRuntime 枚举值

1. nodejs

- nodejs17
- nodejs16
- nodejs14
- nodejs12
- nodejs10(默认)
- typescript

2. python

- python3.10
- python3.9
- python3.8
- python3.7(默认)
- python3.6

3. java

- java17
- java11
- java8 (默认)

4. php

- php8.1
- php8.0
- php7.4(默认)
- php7.2
- php5.6

## 最佳实践

### 公共依赖包

将项目的依赖包放在Layer中，可以有效减少包体积，提升构建速度

1. 使用serverless-devs工具初始化nodejs14 项目 `s init start-fc-http-nodejs14`,项目结构如下

```
.
├── code
│   └── index.js
└── s.yaml
```

2. 在根目录新建一个目录存放您的依赖文件

```
$ mkdir layer
$ cd layer
$ npm init
```

安装依赖文件:

```
$ npm i lodash --save
$ npm i moment --save
```

3. 声明layer-fc插件

修改`s.yaml`的`actions`配置

```
actions:
  pre-deploy:
    - plugin: layer-fc
      args:
        name: publicLayer
        codeUri: ./layer
        runtime:
          - nodejs10
          - nodejs12
```

修改下入口函数代码为

```
const getRawBody = require('raw-body');
const _ = require('lodash');

exports.handler = (req, resp, context) => {
  getRawBody(req, function(err, body) {
    resp.send(`layer is worked: ${_.isEmpty('hello')}`);
  });
}
```

4. 生产环境ignore掉公共库(可选)
   我们将公共的三方库`lodash`已经放在层中，在部署时候就需要是ignore掉这些依赖库。一方面可以有效提升构建和部署的速度，另一方面有点减少包的体积，减少冷启动

5. 校验结果

- 执行`s deploy`部署
- 执行 `s invoke`调用函数

返回结果来看`lodash`已经生效
![](https://img.alicdn.com/imgextra/i4/O1CN01mv5iYu21ObJLrAEaR_!!6000000006975-2-tps-2014-752.png)

### 自定义customRuntime版本

custom runtime中的镜像版本是固定的，默认的nodejs版本是`10.x`，项目中需要的最小的 nodejs版本为`14.x`。使用本插件可以轻松解决这个问题

1. 项目准备

- 使用serverless-devs工具初始化nodejs14 项目 `s init start-express`
  项目结构如下：

```
├── code
│   ├── bootstrap
│   ├── index.js
│   └── package.json
└── s.yaml
```

- 入口函数代码修改为：

```
var express = require('express');

var app = express();

app.get('*', (req, res) => {
  res.header('Content-Type', 'text/html;charset=utf-8')
  console.log('test');

  res.send(`node Version: ${process.version}`)
})

app.listen(9000, () => {
  console.log('start success.');
}).on('error', (e) => {
  console.error(e.code, e.message)
})
```

- 执行部署 & 调用函数

```
$ s deploy
$ s invoke
```

查看Node版本
![](https://img.alicdn.com/imgextra/i2/O1CN01pbbMx81QUQZKzxJMB_!!6000000001979-2-tps-1296-742.png)

2. 通过插件修改Nodejs版本

- 添加插件
  指定Nodejs16版本

```
actions:
  pre-deploy:
    - plugin: layer-fc
      args:
        customRuntime: nodejs16
```

- 执行部署 & 调用函数

```
$ s deploy
$ s invoke
```

查看Node版本，已经变成`16.x`版本了
![](https://img.alicdn.com/imgextra/i1/O1CN01bG6apx28otMHfPf00_!!6000000007980-2-tps-1500-758.png)



## 注意事项

### 如何更新layer层中的文件

> layer-plugin插件只会在初始化的时候将层中代码上传到云端，以后每次执行`s deploy` 并不会发布层中代码。

推荐有两种方式进行更新层中文件

1. 通过 `s layer publish` 命令式的指令进行更新

   比如执行`s layer publish --layer-name testName --code ./layer` 发布新的版本、

2. 通过更改默认参数`forceUpdate: true` 进行更新

   ```yaml
   actions:
     pre-deploy:
       - plugin: layer-fc
         args:
           name: publicLayer
           codeUri: ./layer
           forceUpdate: true
           runtime:
             - nodejs10
             - nodejs12
   ```

   默认`forceUpdate`值为`false`，防止每次发布都会发布新的层版本。一方面影响我们正常的部署速度，最重要的是版本过多导致平台限制发布版本的数目。

   推荐的方式，打开`forceUpdate: true` 并且发布新版本生效之后。设置`forceUpdate:false`,不影响下次发布。

### 将三方依赖放在层中是否能优化冷启动

答案是不能优化冷启动。

>  层中代码最终还是会放在容器中进行执行，并不能对整体项目的文件大小有帮助。反而需要记住一定要将上传到层的三方模块放在ignore中，否则整体项目的包还会变大，增加冷启动时间。

需要将层中依赖放在`.fcignore` 中，如

```yaml
node_module/lodash
node_module/moment
```



# 关于我们

- Serverless Devs 工具：

  - 仓库：[https://www.github.com/serverless-devs/serverless-devs](https://www.github.com/serverless-devs/serverless-devs)    

    > 欢迎帮我们增加一个 :star2: 

  - 官网：[https://www.serverless-devs.com/](https://www.serverless-devs.com/)

- 阿里云函数计算组件：

  - 仓库：[https://github.com/devsapp/fc](https://github.com/devsapp/fc)
  - 帮助文档：[https://www.serverless-devs.com/fc/readme](https://www.serverless-devs.com/fc/readme)

- 钉钉交流群：33947367    
