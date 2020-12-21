const router = require('express').Router()

const CityController = require('../controllers/CityController')

const validationDataCreateCity = require('../middlewares/validationDataCreateCity')

router.get('/cities', CityController.index)

router.get('/cities/:abbreviationState', CityController.getByAbbreviationState)

router.post('/city', validationDataCreateCity, CityController.create)

router.put('/city', CityController.update)

router.delete('/city/:id', CityController.delete)

module.exports = router
