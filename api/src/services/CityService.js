const { pick } = require('lodash')
const CityModel = require('../model/City')

const makeSortOption = options => {
  const sortOptions = pick(options, ['name', 'createdAt', 'updatedAt'])
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
      name: { $regex: options.filter, $options: 'i' },
    }
  }

  const sort = makeSortOption(options)

  return await CityModel.find({ ...filter })
    .populate({ path: 'stateId', select: 'abbreviation' })
    .sort({ ...sort })
}

module.exports.getByAbbreviationState = async abbreviationState => {
  return await CityModel.aggregate([
    {
      $lookup: {
        from: 'states',
        localField: 'stateId',
        foreignField: '_id',
        as: 'statePopulate',
      },
    },
    {
      $unwind: {
        path: '$statePopulate',
      },
    },
    {
      $match: {
        'statePopulate.abbreviation': {
          $regex: abbreviationState,
          $options: 'i',
        },
      },
    },
    {
      $project: {
        _id: true,
        name: true,
        stateId: true,
        createdAt: true,
        updatedAt: true,
        state: '$statePopulate',
      },
    },
  ])
}

module.exports.create = async city => {
  const result = await CityModel.create(city)
  return result
}

module.exports.update = async cityData => {
  const data = pick(cityData, ['id', 'name', 'stateId'])
  const city = await CityModel.findById(data.id).exec()

  if (city) {
    Object.keys(data).map(key => {
      city[key] = data[key]
    })
    return await city.save()
  }

  throw new Error('City not found')
}

module.exports.delete = async id => await CityModel.findByIdAndDelete(id).exec()
