const { zip, fse, Logger } = require('@serverless-devs/core');
const Client = require('./client');
const path = require('path');
const { COMPATIBLE_RUNTIME } = require('../common/index');
const logger = new Logger('layer-fc');

module.exports = class layer {
  static getFcClient() {
    return Client.fcClient;
  }
  async list({ prefix }, table) {
    const list = await Client.fcClient.get_all_list_data('/layers', 'layers', {
      prefix,
    });

    return list.map(
      ({ layerName, description, version, compatibleRuntime, arn }) => ({
        layerName,
        arn,
        version,
        description,
        compatibleRuntime,
      })
    );
  }

  async publish(props) {
    const {
      layerName,
      code = '.',
      description = '',
      compatibleRuntime = COMPATIBLE_RUNTIME,
    } = props;
    const codeResolvePath = path.resolve(code);

    const zipPath = path.join(process.cwd(), '.s', 'layer');
    const outputFileName = `catch-${new Date().getTime()}.zip`;
    const zipFilePath = path.join(zipPath, outputFileName);

    try {
      fse.emptyDir(zipPath);
    } catch (ex) {
      logger.debug(ex);
    }

    await zip({
      codeUri: codeResolvePath,
      outputFilePath: zipPath,
      outputFileName,
    });
    const zipFile = fse.readFileSync(zipFilePath, 'base64');
    fse.removeSync(zipFilePath);

    const { data = {} } = await Client.fcClient.publishLayerVersion(layerName, {
      code: { zipFile },
      description,
      compatibleRuntime,
    });
    logger.debug(`arn: ${data.arn}`);

    return data.arn;
  }
};
