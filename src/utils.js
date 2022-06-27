const core = require('@serverless-devs/core');
const { lodash : _ } = core;

const SYSTERMPATH = {
  PATH: ':/usr/local/bin/apache-maven/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/ruby/bin',
  LAYERS: {
    nodejs17: {
      layer: 'node-v17.8.0-linux-x64',
      path: '/opt/node-v17.8.0-linux-x64/bin',
    },
    nodejs16: {
      layer: 'node-v16.14.2-linux-x64',
      path: '/opt/node-v16.14.2-linux-x64/bin',
    },
    nodejs14: {
      layer: 'node-v14.19.1-linux-x64',
      path: '/opt/node-v14.19.1-linux-x64/bin',
    },
    nodejs12: {
      layer: 'node-v12.22.11-linux-x64',
      path: '/opt/node-v12.22.11-linux-x64/bin',
    },
    'python3.10': {
      layer: 'python-v3.10-linux-x64',
      path: '/opt/python-v3.10-linux-x64/bin',
    },
    'python3.9': {
      layer: 'python-v3.9-linux-x64',
      path: '/opt/python-v3.9-linux-x64/bin',
    },
    'python3.8': {
      layer: 'python-v3.8-linux-x64',
      path: '/opt/python-v3.8-linux-x64/bin',
    },
    'python3.6': {
      layer: 'python-v3.6-linux-x64',
      path: '/opt/python-v3.6-linux-x64/bin',
    },
    'php8.1': {
      layer: 'php-v8.1-linux-x64',
      path: '/opt/php-v8.1-linux-x64/bin',
    },
    'php8.0': {
      layer: 'php-v8.0-linux-x64',
      path: '/opt/php-v8.0-linux-x64/bin',
    },
    'php7.2': {
      layer: 'php-v7.2-linux-x64',
      path: '/opt/php-v7.2-linux-x64/bin',
    },
    'php5.6': {
      layer: 'php-v5.6-linux-x64',
      path: '/opt/php-v5.6-linux-x64/bin',
    },
    java17: {
      layer: 'java-v17.0.2-linux-x64',
      path: '/opt/java-v17.0.2-linux-x64/bin',
    },
    java11: {
      layer: 'java-v11.0.14-linux-x64',
      path: '/opt/java-v11.0.14-linux-x64/bin',
    },
    typescript: {
      layer: 'node-v16.14.2-linux-x64',
      path: '/opt/node-v16.14.2-linux-x64/bin',
    },
    dotnet6: {
      layer: 'dotnet6',
      path: '/opt/dotnet6',
    }
  },
};

const checkArgs = (inputs, args) => {
  if(!args) {
    throw new core.CatchableError("layer-fc args must exist!");
  }

  if(args.name){
    //  缺少参数
    if(!(args.codeUri || args.ossBucket)) {
      throw new core.CatchableError(`Missing args: codeUri or ossBucket`);
    }
    if(!_.isEmpty(args.runtime)) {
      // runtime没有被包含
      if(!_.includes(args.runtime, _.get(inputs, 'props.function.runtime'))) {
        args.runtime = _.concat(args.runtime,  _.get(inputs, 'props.function.runtime'))
      }
    }
  } else if(args.customRuntime) {
    if(_.get(inputs, 'props.function.runtime') !== 'custom') {
      throw new core.CatchableError(`props.function.runtime: "${_.get(inputs, 'props.function.runtime')}" is not correct, Should be "custom"`);
    }
  }
  
}
module.exports = { SYSTERMPATH, checkArgs };
