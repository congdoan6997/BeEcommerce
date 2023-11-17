'use strict';
const AccessService = require('../services/access.service');
const { CreatedSuccessResponse } = require('../core/success.response');
class AccessController {
  async signup(req, res, next) {
    new CreatedSuccessResponse({
      message: 'Signup successfully',
      metadata: await AccessService.signup(req.body),
    }).send(res);
  }
}

module.exports = new AccessController();
