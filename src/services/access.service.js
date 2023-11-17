'use strict';
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');

const RoleUsers = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      // step 1: check exist email
      const holderUser = await userModel.findOne({ email }).lean();
      if (holderUser) {
        return {
          code: 'xxxx',
          message: 'User already registered!',
        };
      }
      // create pass hash by bcrypt
      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleUsers.SHOP],
      });

      if (newUser) {
        // create privateKey and publicKey
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
          privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
          },
        });

        console.log({ publicKey, privateKey });

        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newUser._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: 'xxxxx',
            message: 'Failed to create public key string',
          };
        }
        console.log('PublicKeyString::', publicKeyString);
        const publicKeyObject = crypto.createPublicKey(publicKeyString);

        console.log('PublicKeyObject::', publicKeyObject);

        const tokens = createTokenPair(
          {
            userId: newUser._id,
            email,
          },
          publicKeyObject,
          privateKey
        );

        if (tokens) {
          console.log('Created tokens ::', tokens);
        }

        return {
          code: 201,
          metadata: {
            user: getInfoData({ fields: ['_id', 'name', 'email'], object: newUser }),
            tokens,
          },
        };
      }

      return {
        code: 400,
        metadata: null,
      };
    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      };
    }
  };
}

module.exports = AccessService;
