'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();
const { asyncHandler } = require('../../auth/checkAuth');

// check api

router.post('/user/signup', asyncHandler(accessController.signup));

module.exports = router;
