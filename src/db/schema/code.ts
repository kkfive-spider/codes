import connect from '../index'

const mongoose = await connect()
const codeSchema = new mongoose.Schema({
  title: String,
  href: String,
  url: String,
  urlId: String,
  magnet: String,
  createTime: {
    type: Date,
    default: Date.now,
  },
  updateTime: {
    type: Date,
    default: Date.now,
  },
})

const Code = mongoose.model('code', codeSchema)

export default Code
