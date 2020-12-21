const timezone = require('dayjs/plugin/timezone')
const dayjs = require('dayjs')

dayjs.extend(timezone)

// BSB use UTC-3, same timezone of São Paulo
dayjs.tz.setDefault('America/Sao_Paulo')

module.exports = schema => {
  schema.pre('save', next => {
    const date = dayjs().toDate()
    if (this.isNew) {
      this.createdAt = this.createdAt || date
      this.updatedAt = this.updatedAt || date
      return next()
    }

    this.updatedAt = date
    return next()
  })

  schema.pre('update', next => {
    const date = dayjs().toDate()
    this._update.updatedAt = date
    return next()
  })

  schema.pre('findOneAndUpdate', next => {
    const date = dayjs().toDate()
    this._update.updatedAt = date
    return next()
  })

  schema.pre('updateMany', next => {
    const date = dayjs().toDate()
    this._update.updatedAt = date
    return next()
  })
}
