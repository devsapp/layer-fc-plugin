const core = require('@serverless-devs/core');
const { lodash, loadComponent, Logger } = core;
const logger = new Logger('layer-fc');
/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数
 * @return inputs
 */
module.exports = async function index(inputs, args) {
  logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
  logger.debug(`args params: ${JSON.stringify(args)}`);
  const { codeUri, name, update = false, runtime, description } = args;
  /**
   * handleInputs
   * props
   * layerName: 必填
   * code: 必填
   * compatibleRuntime: 选填
   * description: 选填
   * **/
  let _inputs = lodash.merge(inputs, {
    props: {
      layerName: name,
      code: codeUri,
      compatibleRuntime: runtime,
      description,
    },
  });
  let publishRes = '';
  // handlelayer
  const layer = await loadComponent('devsapp/fc-layer');
  const result = await layer.list(_inputs);
  const isExiting = lodash.includes(
    lodash.map(result, (item) => item.layerName),
    name
  );
  if (update || !isExiting) {
    publishRes = await layer.publish(_inputs);
  }
  /**
   * output inputs
   * environmentVariables  key NODE_PATH
   * layers
   * **/
  const environmentVariables = lodash.get(
    inputs,
    'props.function.environmentVariables',
    {}
  );
  const inputNodePath = environmentVariables.NODE_PATH;
  const layerNodePath = '/opt/node_modules:/opt/nodejs/node_modules';
  environmentVariables.NODE_PATH = inputNodePath
    ? `${inputNodePath}:${layerNodePath}`
    : layerNodePath;
  const layers = lodash.get(inputs, 'props.function.layers', []);

  publishRes && layers.push(publishRes);

  _inputs = lodash.merge(_inputs, {
    props: {
      function: {
        environmentVariables,
        layers,
      },
    },
  });
  return _inputs;
};
