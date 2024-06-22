/* eslint-disable node/prefer-global/process */
/** 同步已有数据到数据库 */
import fs from 'node:fs'
import Code from './db/schema/code'
import ENV from './config'

const { T6_BASE_URL } = ENV

const data = fs.readFileSync('./result.json', 'utf-8')
const json = JSON.parse(data)

async function sync() {
  for (const item of json) {
    const { title, id, href, magnet } = item
    await new Code({
      title,
      url: `${T6_BASE_URL}/${href}`,
      urlId: id,
      magnet,
    }).save()
  }
}

sync().then(() => {
  console.log('sync done')
  process.exit(0)
})
