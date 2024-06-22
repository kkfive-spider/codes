/* eslint-disable node/prefer-global/process */
import * as dotenv from 'dotenv'

const config = {
  MONGODB_URI: process.env.MONGO_DB_URI,
  MONGODB_NAME: process.env.MONGO_DB_NAME,
  T6_BASE_URL: process.env.T6_BASE_URL,

}

if (process.env.CI !== 'true') {
  const r = dotenv.config({ debug: true, path: ['.env.local'] })
  if (r.parsed) {
    config.MONGODB_URI = r.parsed.MONGO_DB_URI
    config.MONGODB_NAME = r.parsed.MONGO_DB_NAME
    config.T6_BASE_URL = r.parsed.T6_BASE_URL
  }
}
const ENV = config
export default ENV
