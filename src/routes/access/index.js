'use strict';

const express = require('express');
const accessController = require('../../controllers/access.controller');
const router = express.Router();

// check api

router.post('/user/signup', accessController.signup);

module.exports = router;
