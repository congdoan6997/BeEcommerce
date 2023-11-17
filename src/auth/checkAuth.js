'use strict';
const ApiKeyService = require('../services/apiKey.service');

const HEADER = {
  API_KEY: 'x-api-key',
  AUTHORIZATION: 'authorization',
};
const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(401).json({
        code: '100001',
        message: 'Unauthorized',
      });
    }

    // check objKey
    const objKey = await ApiKeyService.findApiKey({ key });
    if (!objKey) {
      return res.status(401).json({
        code: '100001',
        message: 'Unauthorized',
      });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {}
};

const permissionKey = (permission) => {
  return (req, res, next) => {
    const objKey = req.objKey;
    if (!objKey.permissions) {
      return res.status(401).json({
        code: '100001',
        message: 'Unauthorized',
      });
    }
    if (!objKey.permissions.includes(permission)) {
      return res.status(401).json({
        code: '100001',
        message: 'Unauthorized',
      });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permissionKey,
};
