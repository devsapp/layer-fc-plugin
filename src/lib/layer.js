const core = require('@serverless-devs/core');
const Client = require('./client');
const { tableShow } = require('../common/index');

module.exports = class layer {
  static getFcClient() {
    return Client.fcClient;
  }
  async list({ prefix }, table) {
    const list = await Client.fcClient.get_all_list_data('/layers', 'layers', {
      prefix,
    });

    if (table) {
      tableShow(list);
    } else {
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
  }
};
