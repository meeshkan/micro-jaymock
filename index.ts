import {IncomingMessage, ServerResponse} from 'http'
import {join} from 'path'
import {readFileSync} from 'fs'
import jaymock from '@unmock/jaymock'
import {json, send} from 'micro'
import chance from 'chance'
import serveMarked from 'serve-marked'

const jm = jaymock()
jm.extend('chance', new chance())

const readFile = (name: string): Buffer => readFileSync(join(__dirname, name))

const serveReadme = serveMarked(readFileSync(join(__dirname, 'readme.md')).toString('utf8'), {
	title: 'jaymock',
	inlineCSS: `
		.markdown-body h1 + p {
			text-align: center;
			margin: -40px 0 4rem 0;
			line-height: 20px;
			height: 20px;
		}
	`,
	beforeHeadEnd:
		'<link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/styles/github-gist.min.css" rel="stylesheet" />' +
		'<link rel="icon" href="/favicon.png" sizes="32x32" />',
	beforeBodyEnd:
		'<script charset="UTF-8" src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.10/highlight.min.js"></script>' +
		'<script>hljs.initHighlightingOnLoad();</script>'
})

export default async (req: IncomingMessage, res: ServerResponse): Promise<any> => {
	if (req.method === 'GET') {
		switch (req.url) {
			case '/':
				return serveReadme(req, res)
			case '/demo.gif':
				return readFile('demo.gif')
			case '/favicon.png':
				return readFile('favicon.png')
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
