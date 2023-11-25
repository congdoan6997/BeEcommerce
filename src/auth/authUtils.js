'use strict';
const JWT = require('jsonwebtoken');
const { asyncHandler } = require('../helpers/asyncHandler');
const { NotFoundError, UnauthorizedError } = require('../core/error.response');
const { findKeyTokenByUserId } = require('../services/keyToken.service');

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESH_TOKEN: 'x-refresh-token',
};

const createTokenPair = (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, publicKey, {
      // algorithm: 'none',
      expiresIn: '2 days',
    });

    // refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      // algorithm: 'none',
      expiresIn: '7 days',
    });

    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log('Error verify::', error);
      } else {
        console.log('Decode verify::', decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    return {
      code: 'Token pair',
      message: error.message,
    };
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /* 
  1. check userId missing
  2. get access token
  3. verify access token
  4. check user in db
  5. check keyStore with this userId
  6. ok all return next()
  */
  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new UnauthorizedError('Invalid request');
  // console.log('userId::', userId);
  // 2
  const keyStore = await findKeyTokenByUserId({ user: userId });
  if (!keyStore) throw new NotFoundError('Not found');
  // console.log('keyStore::', keyStore);

  // 3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new UnauthorizedError('Invalid request 111');
  // console.log('accessToken::', accessToken);
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    // console.log('decodeUser::', decodeUser);

    if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid request');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  /* 
  1. check userId missing
  2. get access token
  3. verify access token
  4. check user in db
  5. check keyStore with this userId
  6. ok all return next()
  */
  // 1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new UnauthorizedError('Invalid request 1');
  // console.log('userId::', userId);
  // 2
  const keyStore = await findKeyTokenByUserId({ user: userId });
  if (!keyStore) throw new UnauthorizedError('Invalid request 2');
  // console.log('keyStore::', keyStore);
  // 3
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if (refreshToken) {
    try {
      const decodeUser = verifyJWT(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid request 3');
      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      req.user = decodeUser;
      // console.log('decodeUser::', decodeUser);
      return next();
      // console.log('decodeUser::', decodeUser);
    } catch (error) {
      throw error;
    }
  }

  // 4
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new UnauthorizedError('Invalid request 4');
  // console.log('accessToken::', accessToken);
  try {
    const decodeUser = verifyJWT(accessToken, keyStore.publicKey);
    // console.log('decodeUser::', decodeUser);

    if (userId !== decodeUser.userId) throw new UnauthorizedError('Invalid request 5');
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = (refreshToken, privateKey) => {
  try {
    const decodeUser = JWT.verify(refreshToken, privateKey);
    return decodeUser;
  } catch (error) {
    throw error;
  }
};

module.exports = { createTokenPair, authentication, verifyJWT, authenticationV2 };
