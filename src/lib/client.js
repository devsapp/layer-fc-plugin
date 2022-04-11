const core = require('@serverless-devs/core');

module.exports = class Client {
  static fcClient = null;
  static setFcClient = async function (region, credentials, access) {
    const fcCore = await core.loadComponent('devsapp/fc-core');
    const fcClient = await fcCore.makeFcClient({
      access,
      credentials,
      region,
    });
    this.fcClient = fcClient;
    return fcClient;
  };
};
