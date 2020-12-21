const { StatusCodes } = require('http-status-codes')
const { pick } = require('lodash')

module.exports = async (req, res, next) => {
  const state = pick(req.body, ['name', 'abbreviation'])

  // validation required fields
  if (!state.name || !state.abbreviation) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errorCode: 'ERR_STATE_VALIDATION_FIELD',
      message: 'Missing required fields.',
    })
  }

  res.locals.state = state
  next()
}
