const mongoose = require('../database')

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    abbreviation: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
)

const State = mongoose.model('State', stateSchema)

module.exports = State
