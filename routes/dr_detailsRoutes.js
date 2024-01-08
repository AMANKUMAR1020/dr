const express = require('express')
const router = express.Router()
const drControllers = require('../controllers/drControllers')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(drControllers.getAllDrs)
    .put(drControllers.addDrsDetails)
    .delete(drControllers.deleteDrs)

module.exports = router
