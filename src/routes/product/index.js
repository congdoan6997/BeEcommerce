'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');

// check authentication
router.use(authenticationV2);
// console.log('Authentication');

// signup
router.post('/create', asyncHandler(productController.createProduct));
// router.post('/user/login', asyncHandler(accessController.login));
//
// router.use(authenticationV2);

// logout
// router.post('/user/logout', asyncHandler(accessController.logout));
// router.post('/user/refreshToken', asyncHandler(accessController.refreshToken));
module.exports = router;
