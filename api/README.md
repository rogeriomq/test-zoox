# Install and Run

Project API - Zoox selection process

### Requirements

- NodeJS >= v12
- MongoDB >= 3.4

> In project root folder...

In your preferred terminal:

1. `yarn` or `npm install`
2. `cp env.example .env`
3. Edit your _.env_ if necessary
4. `yarn start` or `npm start`
5. Execute tests, run `yarn test` or `npm run test`
6. **Have a Coffee** ☕️

# API documentation 😬

API Documentation it is in directory DOC, in OpenAPI Format.
I recommend documetation with [SwaggerEditor](https://editor.swagger.io/) or [Insomnia Designer](https://insomnia.rest/products/designer/)

# Database

MongoDB

- \*\*\* Docker(if use):
  `docker run --name mongo-server -d -p 27017:27017 -p 28017:28017 -e MONGO_INITDB_ROOT_USERNAME="admin" -e MONGO_INITDB_ROOT_PASSWORD="admin" -e MONGO_INITDB_DATABASE="zooxdb" mongo`
