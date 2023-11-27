'use strict';

const express = require('express');
const productController = require('../../controllers/product.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
//search
router.get('/search/:keySearch', asyncHandler(productController.findProductBySearch));
router.get('', asyncHandler(productController.findAllProducts));
router.get('/:product_id', asyncHandler(productController.findOneProduct));

// check authentication
router.use(authenticationV2);
// console.log('Authentication');

// create
router.post('/create', asyncHandler(productController.createProduct));

router.post('/publish/:id', asyncHandler(productController.publishProductByUser));
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByUser));
// query

router.get('/draft/all', asyncHandler(productController.findAllDraftsProduct));
router.get('/published/all', asyncHandler(productController.findAllPublishProduct));

// router.post('/user/login', asyncHandler(accessController.login));
//
// router.use(authenticationV2);

// logout
// router.post('/user/logout', asyncHandler(accessController.logout));
// router.post('/user/refreshToken', asyncHandler(accessController.refreshToken));
module.exports = router;
