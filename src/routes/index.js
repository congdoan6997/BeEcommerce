'use strict';

const express = require('express');
const router = express.Router();
const { apiKey, permissionKey } = require('../auth/checkAuth');

// add middleware
router.use(apiKey);

// check permission
// router.use(permissionKey('0000'));

// routes
router.use('/v1/api', require('./access'));

module.exports = router;
