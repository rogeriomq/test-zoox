const { StatusCodes } = require('http-status-codes')
const StateService = require('../services/StateService')
const { pick } = require('lodash')

module.exports.index = async (request, response) => {
  const options = pick(request.query, ['filter', 'name', 'abbreviation'])
  try {
    const result = await StateService.getAll(options)
    return response.json(result || [])
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_GET_STATES',
      message: error.message,
    })
  }
}

module.exports.create = async (_, response) => {
  const dataState = { ...response.locals.state }
  try {
    const result = await StateService.create(dataState)
    return response.status(StatusCodes.CREATED).json(result)
  } catch (error) {
    return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_CREATE_STATE',
      message: error.message,
    })
  }
}

module.exports.update = async (request, response) => {
  const dataState = pick(request.body, ['id', 'name', 'abbreviation'])
  try {
    if (!dataState.id) {
      throw new Error('Missing id field.')
    }
    const result = await StateService.update(dataState)
    response.json(result)
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_UPDATE_STATE',
      message: error.message,
    })
  }
}

module.exports.delete = async (request, response) => {
  const { id } = request.params
  try {
    if (!id) {
      return response.status(StatusCodes.BAD_REQUEST).json({
        errorCode: 'ERROR_DELETE_STATE',
        message: 'Parameter stateID not informed.',
      })
    }
    const result = await StateService.delete(id)
    if (!result) {
      return response.status(StatusCodes.NOT_FOUND).json({
        errorCode: 'ERROR_DELETE_STATE',
        message: 'State not found.',
      })
    }
    response.json(result)
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errorCode: 'ERROR_DELETE_STATE',
      message: error.message,
    })
  }
}
