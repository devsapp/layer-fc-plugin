const core = require('@serverless-devs/core');
const { lodash, Logger } = core;
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
  // createclient
  await Client.setFcClient(props.region, credentials, project.access);
  const layer = new Layer();
  // handlelayer
  const { codeUri, name, update = false, runtime } = args;
  const result = await layer.list({ prefix: name });
  const isExiting = lodash.includes(
    lodash.map(result, (item) => item.layerName),
    name
  );
  if (update || !isExiting) {
    await layer.publish({
      layerName: name,
      code: codeUri,
      compatibleRuntime: runtime,
    });
  }
  return lodash.merge(inputs, {
    props: {
      function: {
        runtime: 'custom',
      },
    },
  });
};
