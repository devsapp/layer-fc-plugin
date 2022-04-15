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

  const { codeUri, name, runtime, description, ossBucket, ossKey } = args;
  /**
   * handleInputs
   * props
   *  代码包上传
   *    layerName: 必填
   *    code: 必填
   *    compatibleRuntime: 选填
   *    description: 选填
   *  oss上传
   *    layerName
   *    ossBucket 必填
   *    ossKey 必填
   * customRuntime
   *   共享应用环境
   *   layerName ${name}_fc_auto_created
   * **/
  process.argv = process.argv.concat('--debug');
  let _inputs = lodash.merge(inputs, {
    props: {
      layerName: name,
      code: codeUri,
      compatibleRuntime: runtime,
      description,
      ossBucket,
      // ossKey,
    },
  });
  // handlelayer devsapp/fc-layer@dev  devsapp/fc-layer
  const layer = await loadComponent('devsapp/fc-layer@dev');
  const publishRes = await layer.publish(_inputs);
  process.exit();

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
  if (!lodash.includes(inputNodePath, layerNodePath)) {
    environmentVariables.NODE_PATH = inputNodePath
      ? `${layerNodePath}:${inputNodePath}`
      : layerNodePath;
  }
  const layers = lodash.get(inputs, 'props.function.layers', []);
  publishRes && layers.unshift(publishRes);

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
