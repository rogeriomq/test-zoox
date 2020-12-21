const mongoose = require('../database')
const timezonePlugin = require('./plugins/timezone')

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    abbreviation: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
)

stateSchema.plugin(timezonePlugin)

const State = mongoose.model('State', stateSchema)

module.exports = State
