'use strict';
const JWT = require('jsonwebtoken');

const createTokenPair = (payload, publicKey, privateKey) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '2 days',
    });

    // refresh token
    const refreshToken = JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
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
      code: 'xqweq',
      message: error.message,
    };
  }
};

module.exports = { createTokenPair };
