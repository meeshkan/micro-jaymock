import {IncomingMessage, ServerResponse} from 'http'
import {json, send} from 'micro'
const {join} = require('path')
const {readFileSync} = require('fs')
const jaymock = require('@unmock/jaymock')
const chance = require('chance')
const serveMarked = require('serve-marked')

const jm = jaymock()
jm.extend('chance', new chance())

const serveReadme = serveMarked(readFileSync(join(__dirname, 'readme.md')).toString('utf8'), {
	title: 'jaymock',
	inlineCSS: `
		.markdown-body h1 + p {
			text-align: center;
			margin: -40px 0 4rem 0;
			line-height: 20px;
			height: 20px;
		}
	`
})

export default async (req: IncomingMessage, res: ServerResponse) => {
	if (req.method === 'GET') {
		switch (req.url) {
			case '/':
				return serveReadme(req, res)
			case '/demo.gif':
				return readFileSync(join(__dirname, 'demo.gif'))
			case '/favicon.ico':
				return ''
			default:
				return 'Use POST request.'
		}
    }

	try {
		send(res, 200, jm.populate(await json(req)))
	} catch (error) {
		console.error(error.message)
		return send(res, 400, {error: error.message})
	}
}
