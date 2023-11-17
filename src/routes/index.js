'use strict';

const express = require('express');
const router = express.Router();
const { apiKey, permissionKey } = require('../auth/checkAuth');

// add middleware
router.use(apiKey);

// check permission
router.use(permissionKey('0000'));

router.use('/v1/api', require('./access'));
// router.get('/', (req, res, next) => {
//     res.status(200).json({
//         message: 'Hello World',
//     })
// })

module.exports = router;
