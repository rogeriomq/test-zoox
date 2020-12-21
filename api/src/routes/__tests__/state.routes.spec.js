const request = require('supertest')
const { StatusCodes } = require('http-status-codes')

const mongoose = require('../../database')
const CityModel = require('../../model/City')
const StateModel = require('../../model/State')

const app = require('../../app')

const State = require('../../model/State')

describe('State Routes: ', () => {
  beforeAll(async () => {
    await CityModel.remove({})
    await StateModel.remove({})
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe(`GET - /states`, () => {
    beforeAll(async () => {
      await StateModel.insertMany([
        {
          name: 'Amapá',
          abbreviation: 'AP',
        },
        {
          name: 'Amazonas',
          abbreviation: 'AM',
        },
        {
          name: 'Tocantins',
          abbreviation: 'TO',
        },
        {
          name: 'Paraná',
          abbreviation: 'PR',
        },
      ])
    })

    afterAll(async () => {
      await StateModel.remove({})
    })
    test('should response with array of all states', async () => {
      const response = await request(app)
        .get('/states')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body).toHaveLength(4)
    })

    test('should response with array of states based on filter', async () => {
      const response = await request(app)
        .get(`/states?filter=Am`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body).toHaveLength(2)
    })

    test('should response with array of states ordered by abbreviation descendent', async () => {
      const response = await request(app)
        .get(`/states?abbreviation=desc`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body).toHaveLength(4)
      const abbreviations = response.body.map(state => state.abbreviation)
      expect(abbreviations).toEqual(['TO', 'PR', 'AP', 'AM'])
    })
  })

  describe(`POST - /state`, () => {
    const newState = { name: 'Tocantins', abbreviation: 'TO' }

    test('should response body with json of state', async () => {
      const response = await request(app)
        .post('/state')
        .send(newState)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.CREATED)

      const properties = [
        '_id',
        'name',
        'abbreviation',
        'createdAt',
        'updatedAt',
      ]
      properties.map(property => {
        expect(response.body).toHaveProperty(property)
      })
      expect(response.body.name).toEqual(newState.name)
      expect(response.body.abbreviation).toEqual(newState.abbreviation)
    })

    test('should error when missing required fields', async () => {
      const response = await request(app)
        .post('/state')
        .send({ abbreviation: 'SP' })
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.error).toBeTruthy()
    })
  })

  describe(`PUT - /state`, () => {
    let stateOfTocantins = null
    beforeEach(async () => {
      await StateModel.remove({})

      stateOfTocantins = await State.create({
        name: 'Tocantins',
        abbreviation: 'to',
      })
    })

    test('should response object state with name and abbreviation updated(uppercase). ', async () => {
      const response = await request(app)
        .put('/state')
        .send({
          id: stateOfTocantins._id,
          name: stateOfTocantins.name.toUpperCase(),
          abbreviation: stateOfTocantins.abbreviation.toUpperCase(),
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
    })

    test('should error when missing required fields. ', async () => {
      const response = await request(app)
        .put('/state')
        .send({
          id: stateOfTocantins._id,
          name: stateOfTocantins.name.toUpperCase(),
        })
        .expect(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.error).toBeTruthy()
    })
  })

  describe(`DELETE - /state`, () => {
    let stateOfTocantins = null
    const fakeId = '123456'
    const objectId = mongoose.Types.ObjectId()
    beforeEach(async () => {
      await StateModel.remove({})
      stateOfTocantins = await State.create({
        name: 'Tocantins',
        abbreviation: 'to',
      })
    })

    test('should delete state of the store. ', async () => {
      await request(app)
        .delete(`/state/${stateOfTocantins._id}`)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
    })

    test('should error 500 when invalid parameter id', async () => {
      const response = await request(app)
        .delete(`/state/${fakeId}`)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR)
    })

    test('should error 404 when state not found to delete', async () => {
      const response = await request(app)
        .delete(`/state/${objectId}`)
        .expect(StatusCodes.NOT_FOUND)
    })
  })
})
