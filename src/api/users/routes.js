//src/api/users/routes.js
const { Router } = require('express');
const UsersController = require('./controller');

const router = Router();

router.get('/', UsersController.getAllUsers);
router.post('/', UsersController.createUser);

module.exports = router;
