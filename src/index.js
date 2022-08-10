const core = require('@serverless-devs/core');
const { lodash: _, loadComponent, Logger } = core;
const logger = new Logger('layer-fc');
const { SYSTERMPATH, checkArgs } = require('./utils');
const { PATH, LAYERS } = SYSTERMPATH;
/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数
 * @return inputs
 */
module.exports = async function index(inputs, args) {
  checkArgs(inputs, args);

  logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
  logger.debug(`args params: ${JSON.stringify(args)}`);
  const { codeUri = null, description = null, customRuntime = null } = args;
  let { ossBucket = null, ossKey = null, name = null, runtime } = args;
  const region = _.get(
    inputs,
    'props.region',
    'cn-hangzhou'
  );

  /**
   * customRuntimeProps: { layer, customRuntimeConfig, path }
   * customRuntimeFunctionConfig: { runtime: 'custom',   customRuntimeConfig: extend(customRuntimeProps.customRuntimeConfig) }
   * **/
  let customRuntimeProps = {};
  let customRuntimeFunctionConfig = {};
  if (customRuntime) {
    if (LAYERS[customRuntime]) {
      customRuntimeProps = LAYERS[customRuntime];
      ossBucket = `fc-layers-${region}`;
      ossKey = `${_.get(customRuntimeProps, 'layer')}.zip`;
      name = `${customRuntime}_fc_auto_created`;
      customRuntimeFunctionConfig = { runtime: 'custom' };
      runtime = ['custom'];
    } else {
      return inputs;
    }
  }

  /**
   * handleInputs
   *  代码包上传
   *  oss上传
   *  customRuntime
   * **/
  let _inputs = _.merge(inputs, {
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
  const environmentVariables = _.get(
    inputs,
    'props.function.environmentVariables',
    {
      NODE_PATH: undefined,
      PATH: undefined,
    }
  );

  // 避免重复注册PATH  自定义运行环境
  if (!_.isEmpty(customRuntimeProps)) {
    const envPATH = environmentVariables.PATH || '';
    const envDefaultPATH = `${customRuntimeProps.path}${PATH}`;
    if (!_.includes(envPATH, envDefaultPATH)) {
      environmentVariables.PATH = envPATH
        ? `${envDefaultPATH}:${envPATH}`
        : envDefaultPATH;
    }
  } else {
    // 避免重复注册 NODE_PATH
    const inputNodePath = environmentVariables.NODE_PATH;
    const layerNodePath = '/opt/node_modules:/opt/nodejs/node_modules';
    if (!_.includes(inputNodePath, layerNodePath)) {
      environmentVariables.NODE_PATH = inputNodePath
        ? `${layerNodePath}:${inputNodePath}`
        : layerNodePath;
    }
  }
  const layer = await loadComponent('devsapp/fc-layer');
  let publishRes;
  const layerList = await layer.list({
    args: `--region ${inputs.props.region} --prefix ${name}`,
    credentials: inputs.credentials,
    project: inputs.project,
  });
  if (args.forceUpdate || _.isEmpty(layerList)
    || _.size(_.filter(layerList, item => item.layerName === name)) === 0
  ) {
    publishRes = await layer.publish(_inputs);
  } else {
    publishRes = _.get(layerList, '[0].arn')
  }

  // layer注册顺序
  let layersFcInputsUni = _.get(_inputs, 'props.layersFcInputsUni');
  let layers = _.get(_inputs, 'props.function.layers', []);
  if (_.isNil(layersFcInputsUni)) {
    _inputs.props.layersFcInputsUni = layers;
    layersFcInputsUni = layers;
  }
  const layerPlugins = _.dropRight(layers, layersFcInputsUni.length);
  if (publishRes) {
    layerPlugins.push(publishRes);
    layers = _.concat(layerPlugins, layersFcInputsUni);
  }

  // merge
  _inputs = _.merge(_inputs, {
    props: {
      function: {
        environmentVariables,
        layers,
      },
    },
  });

  return _inputs;
};
