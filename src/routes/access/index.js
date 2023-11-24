'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authentication } = require('../../auth/authUtils');

// check api
// signup
router.post('/user/signup', asyncHandler(accessController.signup));
router.post('/user/login', asyncHandler(accessController.login));
//
router.use(authentication);

// logout
router.post('/user/logout', asyncHandler(accessController.logout));
module.exports = router;
