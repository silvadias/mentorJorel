//src/api/home/routes.js
const {Router} = require('express')
const homeController = require('./controller')
const router = Router()

router.get('/', homeController.getResponse)

module.exports = router;


