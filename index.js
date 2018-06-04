const puppeteer = require('puppeteer')
const Page = require('puppeteer/lib/Page')
const express = require('express')
const app = express()

let browser = null

const viewport = {
  width: 1228,
  height: 1024
}

const puppeteerArgs = { args: [
    '--no-sandbox',
    '--no-session-id',
    '--incognito'
  ] }

const gotoParam = {
  timeout: 60000,
  waitUntil: 'networkidle0'
}

async function init () {
  browser = await puppeteer.launch(puppeteerArgs)
}


async function fetch (url) {
	let page = null
  try {
    page = await browser.newPage()

    await page.goto(url, gotoParam)
		const html = await page.content()

    // screenshot
    const timestamp = Date.now()
    const fileName = url.replace('https://', '').replace(/[\.\/\?]/g, '-')
    await page.screenshot({path: 'screenshot/' + fileName + '-' + timestamp +'.png'})

		return html
  } finally {
    page && page.close()
	}
}

app.get('/fetch', (req, res) => {
	fetch(req.query.url).then((html) => res.send(html))
})

init()

app.listen(3000, () => console.log('Example app listening on port 3000!'))
