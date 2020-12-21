const mongoose = require('../database')

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

citySchema.pre('save', next => {
  // implement verify if has exists city with stateId in collection
  return next()
})

const City = mongoose.model('City', citySchema)

module.exports = City
