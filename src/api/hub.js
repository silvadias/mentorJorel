//src/api/hub.js
const { Router } = require('express');
const router = Router();

const home = require('./home/routes')
const users = require('./users/routes');

router.use('/',                     home);
router.use('/users',                users);

module.exports = router;
