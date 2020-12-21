const plugin = require('dayjs/plugin/timezone')
const mongoose = require('../database')

const timezonePlugin = require('./plugins/timezone')

const { ObjectId } = mongoose.Schema
const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    stateId: {
      type: ObjectId,
      ref: 'State',
      required: true,
      index: { background: true },
    },
  },
  {
    timestamps: true,
  }
)

citySchema.plugin(timezonePlugin)

const City = mongoose.model('City', citySchema)

module.exports = City
