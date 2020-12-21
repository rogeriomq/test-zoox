const { Router } = require('express')
const stateRoutes = require('./state.routes')
const cityRoutes = require('./city.routes')

const router = Router()

router.use(stateRoutes)
router.use(cityRoutes)

module.exports = router
