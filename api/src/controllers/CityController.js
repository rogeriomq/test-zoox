const { StatusCodes } = require('http-status-codes')
const CityService = require('../services/CityService')
const { pick } = require('lodash')

module.exports.index = async (request, response) => {
  const options = pick(request.query, ['filter', 'name'])
  try {
    const result = await CityService.getAll(options)
    response.json(result || [])
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_GET_CITIES',
      message: error.message,
    })
  }
}

module.exports.getByAbbreviationState = async (request, response) => {
  const { abbreviationState } = request.params
  try {
    const result = await CityService.getByAbbreviationState(abbreviationState)
    response.json(result || [])
  } catch (error) {
    console.log(error)
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_GET_CITIES',
      message: error.message,
    })
  }
}

module.exports.create = async (_, response) => {
  const dataCity = { ...response.locals.city }
  try {
    const result = await CityService.create(dataCity)
    return response.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_CREATE_CITY',
      message: error.message,
    })
  }
}

module.exports.update = async (request, response) => {
  const dataCity = pick(request.body, ['id', 'name', 'stateId'])
  try {
    const result = await CityService.update(dataCity)
    response.json(result)
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_UPDATE_CITY',
      message: error.message,
    })
  }
}

module.exports.delete = async (request, response) => {
  const { id } = request.params
  try {
    if (!id) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        errorCode: 'ERROR_DELETE_CITY',
        message: 'Parameter id not informed.',
      })
    }
    const result = await CityService.delete(id)
    if (!result) {
      return response.status(StatusCodes.NOT_FOUND).json({
        errorCode: 'ERROR_DELETE_CITY',
        message: 'City not found.',
      })
    }
    response.json(result)
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_DELETE_CITY',
      message: error.message,
    })
  }
}
