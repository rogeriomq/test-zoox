const router = require('express').Router()

const StateController = require('../controllers/StateController')

const validationDataCreateState = require('../middlewares/validationDataCreateState')

router.get('/states', StateController.index)

router.post('/state', validationDataCreateState, StateController.create)

router.put('/state', StateController.update)

router.delete('/state/:id', StateController.delete)

module.exports = router
