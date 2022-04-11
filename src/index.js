const core = require('@serverless-devs/core');
const path = require('path');
const { lodash, fse, rimraf, Logger } = core;
const logger = new Logger('layer-fc');
const Client = require('./lib/client');
const Layer = require('./lib/layer');
/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数
 * @return inputs
 */

module.exports = async function index(inputs, args) {
  const { props = {}, credentials = {}, project = { access: '' } } = inputs;
  // 生成client
  await Client.setFcClient(props.region, credentials, project.access);
  const layer = new Layer();
  // 显示layerlist
  layer.list({}, true);
  return lodash.merge(inputs, {
    props: {
      function: {
        runtime: 'custom',
      },
    },
  });
};
