# layer-fc Plugin

层可以为您提供自定义的公共依赖库、运行时环境及函数扩展等发布与部署能力。您可以将函数依赖的公共库提炼到层，以减少部署、更新时的代码包体积，也可以将自定义的运行时，以层部署在多个函数间共享。 

层默认部署在函数执行环境的/opt目录下，作为函数可额外附加的代码目录。当函数配置多个层时，这些层的内容将被合并至/opt目录。点击[这里](https://help.aliyun.com/document_detail/193057.html)查看更多详情。

本插件帮助您通过[Serverless-Devs](https://github.com/Serverless-Devs/Serverless-Devs)工具和[FC组件](https://github.com/devsapp/fc)，快速部署静态网站到阿里云函数计算平台。


- [快速开始](#快速开始)
  - [使用教程](#使用教程)
    - [快速上手](#快速上手)
    - [作用域](#作用域)
  - [操作案例](#操作案例)
- [关于我们](#关于我们)

## 快速开始
### 使用教程
#### 快速上手
`layer-fc`本质是针对[FC组件](https://serverless-devs.com/fc/readme)进行增强。
还是遵循FC组件的[Yaml规范](https://serverless-devs.com/fc/yaml/readme)，区别在于
1. 在执行部署之前声明对应的插件`layer-fc`
```
actions: # 自定义执行逻辑
  pre-deploy: # 在deploy之前运行
    - plugin: layer-fc
```
2. 更改函数的[codeUri](https://serverless-devs.com/fc/yaml/function)为静态资源的本地地址
```
services:
  helloworld:
    component: fc
    actions: # 自定义执行逻辑
      pre-deploy: # 在deploy之前运行
        - plugin: layer-fc
          args:
            codeUri: ./layer
            name: layername # 自定义名称
            runtime:
              - nodejs12
              - nodejs10
    props: #  组件的属性值
      region: ${vars.region}
      service: ${vars.service}
      function:
        name: http-trigger-nodejs14
        description: 'hello world by serverless devs'
        runtime: nodejs14
        codeUri: ./build # 本地静态资源的地址
```


#### 作用域
`layer-fc`只能在`pre-deploy`阶段生效。
```
actions: # 自定义执行逻辑
  pre-deploy: # 在deploy之前运行
    - plugin: layer-fc
```

### 操作案例
- 项目目录结构
```
- layer
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
  helloworld:
    component: fc
    actions: # 自定义执行逻辑
      pre-deploy: # 在deploy之前运行
        - plugin: layer-fc
          args:
              codeUri: ./layer
              name: layername # 自定义名称
              runtime:
                - nodejs12
                - nodejs10
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








# 关于我们
- Serverless Devs 工具：
    - 仓库：[https://www.github.com/serverless-devs/serverless-devs](https://www.github.com/serverless-devs/serverless-devs)    
      > 欢迎帮我们增加一个 :star2: 
    - 官网：[https://www.serverless-devs.com/](https://www.serverless-devs.com/)
- 阿里云函数计算组件：
    - 仓库：[https://github.com/devsapp/fc](https://github.com/devsapp/fc)
    - 帮助文档：[https://www.serverless-devs.com/fc/readme](https://www.serverless-devs.com/fc/readme)
- 钉钉交流群：33947367    
