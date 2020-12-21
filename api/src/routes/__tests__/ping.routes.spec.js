const request = require('supertest')
const app = require('../../app')

describe(`GET - /states`, () => {
  test('should response json object with ping property', async done => {
    const response = await request(app)
      .get('/ping')
      .set('X-Api-Key', process.env.API_KEY)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(response.body).toHaveProperty('ping')
    done()
  })

  test('should error when you do not have x-api-key supplied correctly ', async done => {
    const response = await request(app)
      .get('/ping')
      .set('X-Api-Key', 'xxxx')
      .expect(401)
    expect(response.error).toBeTruthy()
    expect(response.error.text).toEqual('Unauthorize request')
    done()
  })
})
