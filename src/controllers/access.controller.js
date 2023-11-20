'use strict';
const AccessService = require('../services/access.service');
const { CreatedSuccessResponse, OkSuccessResponse } = require('../core/success.response');
class AccessController {
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
}

module.exports = new AccessController();
