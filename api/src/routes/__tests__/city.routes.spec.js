const request = require('supertest')
const { StatusCodes } = require('http-status-codes')

const mongoose = require('../../database')
const CityModel = require('../../model/City')
const StateModel = require('../../model/State')

const app = require('../../app')

describe('State Routes: ', () => {
  beforeAll(async () => {
    await CityModel.remove({})
    await StateModel.remove({})
  })

  afterAll(async () => {
    await CityModel.remove({})
    await StateModel.remove({})
    await mongoose.disconnect()
  })

  describe(`GET - /cities`, () => {
    beforeAll(async () => {
      const states = await StateModel.insertMany([
        {
          name: 'Tocantins',
          abbreviation: 'TO',
        },
        {
          name: 'Santa Catarina',
          abbreviation: 'SC',
        },
      ])
      const [to, sc] = states
      await CityModel.insertMany([
        {
          name: 'Palmas',
          stateId: to._id,
        },
        {
          name: 'Araguaína',
          stateId: to._id,
        },
        {
          name: 'Porto Nacional',
          stateId: to._id,
        },
        {
          name: 'Gurupi',
          stateId: to._id,
        },
        {
          name: 'Paraíso',
          stateId: to._id,
        },
        {
          name: 'Itajaí',
          stateId: sc._id,
        },
      ])
    })

    afterAll(async () => {
      await CityModel.remove({})
      await StateModel.remove({})
    })

    test('should response with array of cities', async () => {
      const response = await request(app)
        .get('/cities')
        .set('X-Api-Key', process.env.API_KEY)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body).toHaveLength(6)
    })

    test('should response with array of cities based on filter', async () => {
      const response = await request(app)
        .get(`/cities?filter=TO`)
        .set('X-Api-Key', process.env.API_KEY)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body).toHaveLength(1)
    })

    test('should response with array of cities ordered by name ascendent', async () => {
      const response = await request(app)
        .get(`/cities?name=asc`)
        .set('X-Api-Key', process.env.API_KEY)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body).toHaveLength(6)
      expect(response.body[0].name).toEqual('Araguaína')
    })
  })

  describe(`GET - /cities/:abbreviationState`, () => {
    let states = []
    beforeAll(async () => {
      states = await StateModel.insertMany([
        {
          name: 'Tocantins',
          abbreviation: 'TO',
        },
        {
          name: 'Santa Catarina',
          abbreviation: 'SC',
        },
      ])
      const [to, sc] = states
      await CityModel.insertMany([
        {
          name: 'Palmas',
          stateId: to._id,
        },
        {
          name: 'Araguaína',
          stateId: to._id,
        },
        {
          name: 'Porto Nacional',
          stateId: to._id,
        },
        {
          name: 'Gurupi',
          stateId: to._id,
        },
        {
          name: 'Paraíso',
          stateId: to._id,
        },
        {
          name: 'Itajaí',
          stateId: sc._id,
        },
      ])
    })

    afterAll(async () => {
      await CityModel.remove({})
      await StateModel.remove({})
    })

    test('should response with array of cities of state param', async () => {
      const response = await request(app)
        .get(`/cities/${states[0].abbreviation}`)
        .set('X-Api-Key', process.env.API_KEY)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
      expect(Array.isArray(response.body)).toBeTruthy()
      expect(response.body).toHaveLength(5)
    })
  })

  describe(`POST - /city`, () => {
    let states = []
    let newCity = {
      name: 'Gurupi',
    }

    beforeAll(async () => {
      states = await StateModel.insertMany([
        {
          name: 'Tocantins',
          abbreviation: 'TO',
        },
        {
          name: 'Santa Catarina',
          abbreviation: 'SC',
        },
      ])

      newCity.stateId = states[0]._id
    })

    test('should response body with json of city', async () => {
      const response = await request(app)
        .post('/city')
        .set('X-Api-Key', process.env.API_KEY)
        .send(newCity)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.CREATED)

      const properties = ['_id', 'name', 'stateId', 'createdAt', 'updatedAt']
      properties.map(property => {
        expect(response.body).toHaveProperty(property)
      })
      expect(response.body.name).toEqual(newCity.name)
      expect(response.body.stateId).toEqual(String(states[0]._id))
    })

    test('should error when missing required fields', async () => {
      const response = await request(app)
        .post('/city')
        .set('X-Api-Key', process.env.API_KEY)
        .send({ name: 'Gurupi' })
        .expect(StatusCodes.BAD_REQUEST)

      expect(response.error).toBeTruthy()
    })
  })

  describe(`PUT - /city`, () => {
    let city = null
    let otherCityName = ''
    beforeEach(async () => {
      await StateModel.remove({})
      await CityModel.remove({})

      const stateOfTocantins = await StateModel.create({
        name: 'Tocantins',
        abbreviation: 'to',
      })
      city = await CityModel.create({
        name: 'Gurupi',
        stateId: stateOfTocantins._id,
      })

      otherCityName = city.name.split('').reverse().join('')
    })

    test('should response with city name updated (backwards) ', async () => {
      const response = await request(app)
        .put('/city')
        .set('X-Api-Key', process.env.API_KEY)
        .send({
          id: city._id,
          name: otherCityName,
          stateId: city.stateId,
        })
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
      expect(response.body.name).toEqual(otherCityName)
    })

    test('should error when missing required fields. ', async () => {
      const response = await request(app)
        .put('/city')
        .set('X-Api-Key', process.env.API_KEY)
        .send({
          name: city.name,
        })
        .expect(StatusCodes.INTERNAL_SERVER_ERROR)
      expect(response.error).toBeTruthy()
    })
  })

  describe(`DELETE - /city/:id`, () => {
    let city = null
    const invalidId = '123456'
    const objectId = mongoose.Types.ObjectId()

    beforeEach(async () => {
      await StateModel.remove({})
      await CityModel.remove({})

      const state = await StateModel.create({
        name: 'Tocantins',
        abbreviation: 'to',
      })

      city = await CityModel.create({
        name: 'Gurupi',
        stateId: state._id,
      })
    })

    test('should delete city of the store. ', async () => {
      await request(app)
        .delete(`/city/${city._id}`)
        .set('X-Api-Key', process.env.API_KEY)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(StatusCodes.OK)
    })

    test('should error 500 when invalid parameter id', async () => {
      await request(app)
        .delete(`/state/${invalidId}`)
        .set('X-Api-Key', process.env.API_KEY)
        .expect(StatusCodes.INTERNAL_SERVER_ERROR)
    })

    test('should error 404 when state not found to delete', async () => {
      await request(app)
        .delete(`/state/${objectId}`)
        .set('X-Api-Key', process.env.API_KEY)
        .expect(StatusCodes.NOT_FOUND)
    })
  })
})
