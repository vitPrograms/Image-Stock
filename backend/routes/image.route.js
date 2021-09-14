const Router = require('express')
const imageController = require('../controllers/image.controller')
const router = new Router()

router.post('/add', imageController.addImages)
router.get('/images', imageController.getImages)
router.get('/images/:id', imageController.getOneImage)

module.exports = router