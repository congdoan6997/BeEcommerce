'use strict';
// const { update } = require('lodash');
const { BadRequestError } = require('../core/error.response');
const keyTokenModel = require('../models/keyToken.model');
const { Types } = require('mongoose');
class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
    try {
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
      throw new BadRequestError(`Create key token:: ${error.message}`);
    }
  };
  static removeKeyTokenById = async ({ id }) => {
    return await keyTokenModel.findByIdAndDelete(id).lean();
  };

  static findKeyTokenByUserId = async ({ user }) => {
    const userId = new Types.ObjectId(user);
    // console.lof('userId2::', userId);
    return await keyTokenModel.findOne({ user: userId }).lean();
  };
}

module.exports = KeyTokenService;
