import mongoose from 'mongoose'
import ENV from '../config'

const { MONGODB_NAME, MONGODB_URI } = ENV
async function main() {
  return await mongoose.connect(MONGODB_URI as string, { dbName: MONGODB_NAME })
}

export default main
