const { StatusCodes } = require('http-status-codes')
const { pick } = require('lodash')

module.exports = async (req, res, next) => {
  const city = pick(req.body, ['name', 'stateId'])

  // validation required fields
  if (!city.name || !city.stateId) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errorCode: 'ERR_STATE_VALIDATION_FIELD',
      message: 'Missing required fields.',
    })
  }

  res.locals.city = city
  next()
}
