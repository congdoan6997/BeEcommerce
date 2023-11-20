'use strict';
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
// const crypto = require('crypto');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');
const { BadRequestError, UnauthorizedError } = require('../core/error.response');
const { findByMail } = require('./user.service');

const RoleUsers = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static async login({ email, password }) {
    // 1. Check exist email
    const holderUser = await findByMail(email);
    if (!holderUser) {
      throw new BadRequestError('User not registered');
    }
    // 2. Check password
    const passwordHash = holderUser.password;
    const isValidPassword = await bcrypt.compare(password, passwordHash);
    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid password');
    }

    // 3. Create public and private key
    const publicKey = crypto.randomBytes(64).toString('hex');
    const privateKey = crypto.randomBytes(64).toString('hex');

    // 4. Create access token and refresh token
    const tokens = createTokenPair(
      {
        userId: holderUser._id,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: holderUser._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      code: 201,
      metadata: {
        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: holderUser }),
        tokens,
      },
    };
  }
  static signup = async ({ name, email, password }) => {
    // step 1: check exist email
    const holderUser = await userModel.findOne({ email }).lean();
    if (holderUser) {
      throw new BadRequestError('Email already exists');
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
      // level xxx
      // const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      //   privateKeyEncoding: {
      //     type: 'pkcs1',
      //     format: 'pem',
      //   },
      // });
      // console.log('newUser::', newUser);
      // level 1
      const privateKey = crypto.randomBytes(64).toString('hex');
      const publicKey = crypto.randomBytes(64).toString('hex');
      console.log('privateKey::', privateKey);
      console.log('publicKey::', publicKey);

      const keyStore = await KeyTokenService.createKeyToken({
        userId: newUser._id,
        publicKey,
        // level    1
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError('Can not create public key');
      }
      // level xxx
      // console.log('PublicKeyString::', publicKeyString);
      // const publicKeyObject = crypto.createPublicKey(publicKeyString);

      // console.log('PublicKeyObject::', publicKeyObject);

      const tokens = createTokenPair(
        {
          userId: newUser._id,
          email,
        },
        publicKey,
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

    throw new BadRequestError('Something wrong');
  };
}

module.exports = AccessService;
