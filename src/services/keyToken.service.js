'use strict';
const { update } = require('lodash');
const { BadRequestError } = require('../core/error.response');
const keyTokenModel = require('../models/keyToken.model');
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
      // level 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   //level xxx
      //   // publicKey: publicKeyString,
      //   publicKey,
      //   // level 1
      //   privateKey,
      // });
      // // level xxx
      // // return tokens ? tokens.publicKey : null;
      // //level 1
      // return tokens;

      // level max
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      // level xxx
      // const publicKeyString = publicKey.toString();

      throw new BadRequestError(`Create key token:: ${error.message}`);
    }
  };
}

module.exports = KeyTokenService;
