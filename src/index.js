const core = require("@serverless-devs/core");
const path = require("path");
const { lodash, fse, rimraf, Logger } = core;
const logger = new Logger("layer-fc");

/**
 * Plugin 插件入口
 * @param inputs 组件的入口参数
 * @param args 插件的自定义参数
 * @return inputs
 */

module.exports = async function index(inputs, args) {
  logger.debug(`inputs params: ${JSON.stringify(inputs)}`);
  logger.debug(`args params: ${JSON.stringify(args)}`);
  return lodash.merge(inputs, {
    props: {
      function: {
        runtime: "custom",
      },
    },
  });
};
