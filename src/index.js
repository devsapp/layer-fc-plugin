const core = require('@serverless-devs/core');
const { lodash, loadComponent, Logger } = core;
const logger = new Logger('layer-fc');
const { SYSTERMPATH } = require('./utils');
const { PATH, LAYERS } = SYSTERMPATH;
/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数
 * @return inputs
 */
module.exports = async function index(inputs, args) {
  logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
  logger.debug(`args params: ${JSON.stringify(args)}`);
  const { codeUri = null, description = null, customRuntime = null } = args;
  let { ossBucket = null, ossKey = null, name = null, runtime } = args;

  /**
   * customeRuntimeProps: { layer, customRuntimeConfig, path }
   * customRuntimeFunctionConfig: { runtime: 'custom',   customRuntimeConfig: extend(customeRuntimeProps.customRuntimeConfig) }
   * **/
  let customeRuntimeProps = {};
  let customRuntimeFunctionConfig = {};
  if (customRuntime && LAYERS[customRuntime]) {
    customeRuntimeProps = LAYERS[customRuntime];
    ossBucket = `fc-layers-${lodash.get(
      inputs,
      'props.region',
      'cn-hangzhou'
    )}`;
    ossKey = `${lodash.get(customeRuntimeProps, 'layer')}.zip`;
    name = `${customRuntime}_fc_auto_created`;
    customRuntimeFunctionConfig = {
      runtime: 'custom',
      customRuntimeConfig: customeRuntimeProps.customRuntimeConfig,
    };
    runtime = ['custom'];
  }
  /**
   * handleInputs
   *  代码包上传
   *  oss上传
   *  customRuntime
   * **/
  let _inputs = lodash.merge(inputs, {
    props: {
      layerName: name,
      code: codeUri,
      compatibleRuntime: runtime,
      description,
      ossBucket,
      ossKey,
      function: customRuntimeFunctionConfig,
    },
  });

  /**
   * output
   * environmentVariables   NODE_PATH PATH
   * layers
   * **/
  const environmentVariables = lodash.get(
    inputs,
    'props.function.environmentVariables',
    {
      NODE_PATH: '',
      PATH: '',
    }
  );

  // 避免重复注册PATH  自定义运行环境
  if (!lodash.isEmpty(customeRuntimeProps)) {
    const envPATH = environmentVariables.PATH || '';
    const envDefaultPATH = `${customeRuntimeProps.path}${PATH}`;
    if (!lodash.includes(envPATH, envDefaultPATH)) {
      environmentVariables.PATH = envPATH
        ? `${envDefaultPATH}:${envPATH}`
        : envDefaultPATH;
    }
  } else {
    // 避免重复注册 NODE_PATH
    const inputNodePath = environmentVariables.NODE_PATH;
    const layerNodePath = '/opt/node_modules:/opt/nodejs/node_modules';
    if (!lodash.includes(inputNodePath, layerNodePath)) {
      environmentVariables.NODE_PATH = inputNodePath
        ? `${layerNodePath}:${inputNodePath}`
        : layerNodePath;
    }
  }
  // handlelayer devsapp/fc-layer@dev  devsapp/fc-layer
  const layer = await loadComponent('devsapp/fc-layer');
  const publishRes = await layer.publish(_inputs);

  // layer注册顺序
  let layersFcInputsUni = lodash.get(_inputs, 'props.layersFcInputsUni');
  let layers = lodash.get(_inputs, 'props.function.layers', []);
  if (lodash.isNil(layersFcInputsUni)) {
    _inputs.props.layersFcInputsUni = layers;
    layersFcInputsUni = layers;
  }
  const layerPlugins = lodash.dropRight(layers, layersFcInputsUni.length);
  publishRes && layerPlugins.push(publishRes);
  layers = lodash.concat(layerPlugins, layersFcInputsUni);

  // merge
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
