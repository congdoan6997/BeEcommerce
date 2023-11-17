'use strict';
const AccessService = require('../services/access.service');
class AccessController {
  async signup(req, res, next) {
    try {
      // console.log(`[P]::signUp::`, req.body)
      // return res.status(201).json({
      //     code: '100001',
      //     metadata: {
      //         userId: 123
      //     }
      // })
      return res.status(201).json(await AccessService.signup(req.body));
    } catch (error) {}
  }
}

module.exports = new AccessController();
