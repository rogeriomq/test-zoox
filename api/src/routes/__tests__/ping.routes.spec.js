const request = require('supertest')
const app = require('../../app')

describe(`GET - /states`, () => {
  test('should response json object with ping property', async done => {
    const response = await request(app)
      .get('/ping')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)

    expect(response.body).toHaveProperty('ping')
    done()
  })
})
