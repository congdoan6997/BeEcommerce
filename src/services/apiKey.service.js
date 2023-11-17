'use strict';
const crypto = require('crypto');

const apiKeyModel = require('../models/apiKey.model');
class ApiKeyService {
  static createApiKey = async ({ key, permissions }) => {
    const objKey = await apiKeyModel.create({
      key,
      permissions,
    });
    return objKey;
  };

  static findApiKey = async ({ key }) => {
    // const newKey = crypto.randomBytes(64).toString('hex');
    // const newobjKey = await this.createApiKey({ key: newKey, permissions: ['0000'] });
    // console.log(newobjKey.key);

    const objKey = await apiKeyModel.findOne({ key, status: true }).lean();
    return objKey;
  };
}

module.exports = ApiKeyService;
