# Website-fc Plugin
![image](https://img.alicdn.com/imgextra/i1/O1CN01X9ucax1hNPxyaFLkb_!!6000000004265-2-tps-1810-686.png)
<p align="center" class="flex justify-center">
  <a href="https://nodejs.org/en/" class="ml-1">
    <img src="https://img.shields.io/badge/node-%3E%3D%2010.8.0-brightgreen" alt="node.js version">
  </a>
  <a href="https://github.com/devsapp/website-fc/blob/master/LICENSE" class="ml-1">
    <img src="https://img.shields.io/badge/License-MIT-green" alt="license">
  </a>
</p>

本插件帮助您通过[Serverless-Devs](https://github.com/Serverless-Devs/Serverless-Devs)工具和[FC组件](https://github.com/devsapp/fc)，快速部署静态网站到阿里云函数计算平台。


- [快速开始](#快速开始)
  - [插件作用](#插件作用)
  - [使用教程](#使用教程)
    - [快速上手](#快速上手)
    - [参数说明](#参数说明)
    - [作用域](#作用域)
  - [操作案例](#操作案例)
  - [最佳实践](#最佳实践)
  - [工作原理](#工作原理)
- [关于我们](#关于我们)

## 快速开始
- [源码](https://github.com/devsapp/start-website/tree/master/vuepress/src)
- 快速体验: `s init website-vuepress`
### 插件作用
#### 通过CDN+OSS部署
通过[OSS组件](https://github.com/devsapp/oss)可以将静态资源快速部署到阿里云对象存储上，同时分发到CDN节点。不同地域的客户都能快速的访问对应的资源。

![Images](https://img.alicdn.com/imgextra/i4/O1CN01yajAOr1qZd4TVVwCk_!!6000000005510-2-tps-928-468.png)


上面的架构是比较推荐的最佳实践，能够保证高可用，和极致弹性，也是一个标准的Serverless架构。同时用户也能快速的访问它就近的资源，提供了最好的用户体验。

#### 通过函数计算FC部署
通过CDN+OSS的方式虽然在性能和弹性都做到了最优，但是有下面几种场景，用户会选择他的应用部署在函数计算上

- 不希望太复杂的架构，前后端都部署在函数计算上
- FullStack的框架，前后端都是一体化，前端部署在OSS有跨域的问题。如果要解决跨域的问题，又需要引入网关等组件，进一步带来了架构的复杂度
- FaaS厂商一般都有免费额度，我的流量不高，部署在Faas足够用了

![picture](https://img.alicdn.com/imgextra/i2/O1CN01mZSY8t1afYL39b670_!!6000000003357-2-tps-838-492.png)

### 使用教程
#### 快速上手
`website-fc`本质是针对[FC组件](https://serverless-devs.com/fc/readme)进行增强。
还是遵循FC组件的[Yaml规范](https://serverless-devs.com/fc/yaml/readme)，区别在于
1. 在执行部署之前声明对应的插件`website-fc`
```
actions: # 自定义执行逻辑
  pre-deploy: # 在deploy之前运行
    - plugin: website-fc
```
2. 更改函数的[codeUri](https://serverless-devs.com/fc/yaml/function)为静态资源的本地地址
```
services:
  website:
    component: fc
    actions: # 自定义执行逻辑
      pre-deploy: # 在deploy之前运行
        - plugin: website-fc
    props: #  组件的属性值
      region: ${vars.region}
      service: ${vars.service}
      function:
        name: http-trigger-nodejs14
        description: 'hello world by serverless devs'
        runtime: nodejs14
        codeUri: ./build # 本地静态资源的地址
```
#### 参数说明

参数详情：

| 参数名称 | 默认值 | 参数含义 | 必填 |
| --- | --- | --- | --- | --- |
| index  | index.html |  自定义默认首页    | false |

我们知道访问静态网站需要一个`html`的页面作为首页，比如您访问`http://www.serverless-devs.com/`首页的时候，其实实际访问的资源是`http://www.serverless-devs.com/index.html`。

`website-fc`插件的默认行为也是会将您的默认首页指向`index.html`。如果您需要自定义您的首页为`demo.html`。只需要做如下声明
```
actions: # 自定义执行逻辑
  pre-deploy: # 在deploy之前运行
    - plugin: website-fc
      args:
        index: demo.html
```

可以参考[案例](https://github.com/devsapp/start-realwrold/tree/master/src)

#### 作用域
`Website-fc`只能在`pre-deploy`阶段生效。
```
actions: # 自定义执行逻辑
  pre-deploy: # 在deploy之前运行
    - plugin: website-fc
```

### 操作案例
- 项目目录结构
```
- dist
  - index.htm
- s.yaml
```
- yaml配置如下
```
edition: 1.0.0        #  命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范
name: component-test   #  项目名称
access: default # 密钥别名

vars: # 全局变量
  region: cn-hangzhou
  service:
    name: hello-world-service
    description: 'hello world by serverless devs'

services:
  website:
    component: fc
    actions: # 自定义执行逻辑
      pre-deploy: # 在deploy之前运行
        - plugin: website-fc
    props: #  组件的属性值
      region: ${vars.region}
      service: ${vars.service}
      function:
        name: http-trigger-nodejs14
        description: 'hello world by serverless devs'
        runtime: nodejs14   # 任何一个 runtime 都可以
        codeUri: ./dist
        memorySize: 128
        timeout: 60
      triggers:
        - name: httpTrigger
          type: http
          config:
            authType: anonymous
            methods:
              - GET
      customDomains:
        - domainName: auto
          protocol: HTTP
          routeConfigs:
            - path: /*
              methods:
                - GET
```

### 最佳实践

以下是来自社区实践后总结出的最佳实践:
+ [如何使用 website-fc 插件部署静态网站到函数计算](https://blog.dengchao.fun/2022/04/02/deploy-static-website-with-website-fc-plugin/) by [DevDengChao](https://github.com/DevDengChao)

欢迎大家通过 PR 投稿更多内容.

### 工作原理
#### 插件运行原理
![image](https://img.alicdn.com/imgextra/i4/O1CN017Zfcf11XmvsJGfMeg_!!6000000002967-2-tps-1462-468.png)
插件本质是上对[组件能力](https://www.serverless-devs.com/fc/readme)的增强，作用在组件的执行前(pre-deploy)以及执行后(post-deploy)。通过修改组件的入参(input)和出参(output)，提供能力。
> 需要注意的是：上一个插件的出参(output)会作为下一个插件或者组件的入参。详情可查看
[插件模型开发指南](https://www.serverless-devs.com/sdm/serverless_package_model/package_model#%E6%8F%92%E4%BB%B6%E6%A8%A1%E5%9E%8B%E8%A7%84%E8%8C%83)


website-fc 插件在把你的代码部署到云端前将 `runtime` 覆盖为了 `custom` 运行时, 将 `caPort` 覆盖为了 `9000`,
以及生成了[一段简单的监听 9000 端口的 Express 代码](https://github.com/devsapp/website-fc/blob/master/src/template.js)到最终的 codeUri 中, [并通过 `node` 启动了 Express HTTP 服务器](https://github.com/devsapp/website-fc/blob/master/src/index.js).

# 关于我们
- Serverless Devs 工具：
    - 仓库：[https://www.github.com/serverless-devs/serverless-devs](https://www.github.com/serverless-devs/serverless-devs)    
      > 欢迎帮我们增加一个 :star2: 
    - 官网：[https://www.serverless-devs.com/](https://www.serverless-devs.com/)
- 阿里云函数计算组件：
    - 仓库：[https://github.com/devsapp/fc](https://github.com/devsapp/fc)
    - 帮助文档：[https://www.serverless-devs.com/fc/readme](https://www.serverless-devs.com/fc/readme)
- 钉钉交流群：33947367    
