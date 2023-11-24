'use strict';
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
// const crypto = require('crypto');
const crypto = require('node:crypto');
const KeyTokenService = require('./keyToken.service');
const { createTokenPair, verifyJWTByRefreshToken } = require('../auth/authUtils');
const { getInfoData } = require('../utils/index');
const { BadRequestError, UnauthorizedError } = require('../core/error.response');
const { findUserByMail, findUserById } = require('./user.service');

const RoleUsers = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN',
};

class AccessService {
  static handlerRefreshToken = async ({ refreshToken }) => {
    console.log('refreshToken::', refreshToken);
    // find key token used
    const keyTokenUsed = await KeyTokenService.findKeyTokenByRefreshTokenUsed({
      refreshTokenUsed: refreshToken,
    });
    if (keyTokenUsed) {
      const { userId, email } = verifyJWTByRefreshToken(refreshToken, keyTokenUsed.privateKey);
      KeyTokenService.removeKeyTokenById({ id: keyTokenUsed._id });
      throw new BadRequestError('Refresh token used');
    }
    // find key token
    const keyToken = await KeyTokenService.findKeyTokenByRefreshToken({ refreshToken });
    if (!keyToken) {
      throw new BadRequestError('Refresh token not found');
    }
    // verify jwt token
    const { userId, email } = verifyJWTByRefreshToken(refreshToken, keyToken.privateKey);
    console.log('userId::', userId);
    // find user
    const user = await findUserByMail(email);
    if (!user) {
      throw new BadRequestError('User not found');
    }
    //create new access token
    const tokens = createTokenPair(
      {
        userId: user._id,
        email,
      },
      keyToken.publicKey,
      keyToken.privateKey
    );
    // update token
    // await keyToken.update({
    //   $set: {
    //     refreshToken: tokens.refreshToken,
    //   },
    //   $addToSet: {
    //     refreshTokenUsed: refreshToken,
    //   },
    // });
    await KeyTokenService.updateKeyToken({
      id: user._id,
      refreshToken: tokens.refreshToken,
      refreshTokenUsed: refreshToken,
    });

    return {
      user: {
        userId,
        email,
      },
      tokens,
    };
  };
  static async logout({ keyStore }) {
    // console.log('keyStore::', keyStore);
    const delKey = await KeyTokenService.removeKeyTokenById({ id: keyStore._id });
    return delKey;
  }
  static async login({ email, password }) {
    // 1. Check exist email
    const holderUser = await findUserByMail(email);
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
        user: getInfoData({ fields: ['_id', 'name', 'email'], object: holderUser }),
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
