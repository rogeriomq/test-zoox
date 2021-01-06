const CityModel = require('../../model/City')
const StateModel = require('../../model/State')
const CityService = require('../CityService')
const mongoose = require('../../database')
describe('CityService.create', () => {
  let state
  beforeAll(async () => {
    await CityModel.remove({})
    await StateModel.remove({})
    state = await StateModel.create({
      name: 'Tocantins',
      abbreviation: 'TO',
    })
  })

  afterAll(async () => {
    await CityModel.remove({})
    await StateModel.remove({})
    await mongoose.disconnect()
  })

  test('should return city created when call create method', async () => {
    const newCity = {
      name: 'Gurupi',
    }
    newCity.stateId = state._id

    const createdCity = await CityService.create(newCity)
    const properties = ['_id', 'name', 'stateId', 'createdAt', 'updatedAt']
    properties.map(property => {
      expect(createdCity).toHaveProperty(property)
    })
  })
})
