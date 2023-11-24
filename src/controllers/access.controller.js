'use strict';
const AccessService = require('../services/access.service');
const { CreatedSuccessResponse, OkSuccessResponse } = require('../core/success.response');
class AccessController {
  async refreshToken(req, res, next) {
    new OkSuccessResponse({
      message: 'Refresh token successfully',
      metadata: await AccessService.handlerRefreshToken(req.body),
    }).send(res);
  }
  async login(req, res, next) {
    new OkSuccessResponse({
      message: 'Login successfully',
      metadata: await AccessService.login(req.body),
    }).send(res);
  }
  async signup(req, res, next) {
    new CreatedSuccessResponse({
      message: 'Signup successfully',
      metadata: await AccessService.signup(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  }
  async logout(req, res, next) {
    new OkSuccessResponse({
      message: 'Logout successfully',
      metadata: await AccessService.logout({ keyStore: req.keyStore }),
    }).send(res);
  }
}

module.exports = new AccessController();
