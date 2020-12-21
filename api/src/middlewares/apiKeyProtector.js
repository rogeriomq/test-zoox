const { StatusCodes } = require('http-status-codes')

module.exports = async (request, response, next) => {
  const apiKey = request.headers['x-api-key']
  if (request.method === 'OPTIONS') return next()

  if (apiKey === process.env.API_KEY) return next()

  response.status(StatusCodes.UNAUTHORIZED).send('Unauthorize request')
}
