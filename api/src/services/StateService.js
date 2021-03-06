const { pick } = require('lodash')
const State = require('../model/State')

const makeSortOption = options => {
  const sortOptions = pick(options, [
    'name',
    'abbreviation',
    'createdAt',
    'updatedAt',
  ])

  const sort = {}
  Object.keys(sortOptions).map(key => {
    sort[key] = sortOptions[key]
  })
  return sort
}

module.exports.getAll = async options => {
  let filter = {}

  if (options.filter) {
    filter = {
      $or: [
        { name: { $regex: options.filter, $options: 'i' } },
        { abbreviation: { $regex: options.filter } },
      ],
    }
  }

  const sort = makeSortOption(options)

  return await State.find({ ...filter }).sort({ ...sort })
}

module.exports.create = async state => {
  const result = await State.create(state)
  return result
}

module.exports.update = async stateData => {
  const state = await State.findById(stateData.id).exec()

  if (state) {
    Object.keys(stateData).map(key => {
      state[key] = stateData[key]
    })
    return await state.save()
  }

  return {}
}

module.exports.delete = async id => await State.findByIdAndDelete(id).exec()
