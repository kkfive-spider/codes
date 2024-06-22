/* eslint-disable node/prefer-global/process */
import axios from 'axios'
import { load } from 'cheerio'
import Code from './db/schema/code'
import ENV from './config'

const { T6_BASE_URL } = ENV

interface HtmlListItem {
  id: string
  title: string
  href: string
}

interface Detail {
  magnet: string
}

async function getHtmlList(pageNum: number): Promise<HtmlListItem[]> {
  try {
    const result = await axios.get(`${T6_BASE_URL}/thread0806.php?fid=2&search=&page=${pageNum}`)
    const $ = load(result.data)
    return $('#tbody tr').map((_, el) => {
      const element = $(el)
      return {
        id: element.find('h3 a').attr('id') || '',
        title: element.find('h3 a').text() || '',
        href: element.find('h3 a').attr('href') || '',
      }
    }).get()
  }
  catch (error) {
    console.error('Error fetching HTML list:', error)
    return []
  }
}

async function getDetail(url: string): Promise<Detail> {
  try {
    const result = await axios.get(`${T6_BASE_URL}/${url}`)
    const $ = load(result.data)
    const magnetUrl = $('a[href*=\'rmdown.com\']').attr('href') || ''
    const magnet = magnetUrl
      .replace('http://rmdown.com/link.php?hash=', '')
      .replace('http://www.rmdown.com/link.php?hash=', '')
      || ''
    return { magnet }
  }
  catch (error) {
    console.error('Error fetching detail:', error)
    return { magnet: '' }
  }
}

async function processData(list: HtmlListItem[]) {
  let existCount = 0
  for (let index = 0; index < list.length; index++) {
    const { title, id, href } = list[index]
    const code = await Code.findOne({ urlId: id })

    if (code) {
      console.log('Exist:', id)
      existCount++
    }
    else {
      const { magnet } = await getDetail(href)
      console.log('New:', id)
      const url = `${T6_BASE_URL}/${href}`
      const urlId = id
      await new Code({ title, magnet, url, urlId }).save()
    }
  }
  return existCount === list.length
}

async function main() {
  let isEnd = false
  let pageNum = 1
  let prevPageExist = false

  while (!isEnd) {
    console.log('Page:', pageNum)
    const list = await getHtmlList(pageNum)
    const currentExits = await processData(list)

    // If all items are exist, then we can stop
    if (currentExits && prevPageExist) {
      console.log('Done')
      isEnd = true
      process.exit(0)
    }
    else {
      prevPageExist = currentExits
      pageNum++
    }
  }
}

main().catch(console.error)
