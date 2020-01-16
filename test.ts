import test from 'ava'
import {freddo, expr, exists} from '@meeshkanml/freddo'
import got from 'got'
import micro from 'micro'
import testListen from 'test-listen'
import imageType from 'image-type'
import m from '.'

const template = {
	name: 'fake({{name.lastName}}, {{name.firstName}} {{name.suffix}})',
	ssn: 'chance.ssn',
	knownAddresses: {
		street: 'address.streetAddress',
		city: 'address.city',
		zipCode: 'address.zipCode',
		_repeat: 2
	},
	ipAddresses: 'internet.ip|3'
}

const invalidTemplate = {
	name: 'thisFunctionDoesNotExist'
}

let url: string

const isHTML = (str: string): boolean => str.trim().startsWith('<!DOCTYPE html>')
const isImage = (input: Buffer | Uint8Array, type: string): boolean => {
	const image = imageType(input)
	if (!image) {
		return false
	}

	return image.ext === type
}

test.before(async () => {
	url = await testListen(micro(m))
})

test('valid POST request', async t => {
	await freddo(url, {
		method: 'POST',
		body: template,
		json: true,
		responseType: 'json'
	})
		.status(200)
		.header('content-type', 'application/json; charset=utf-8')
		.body(exists, expr('.name'))
		.body(exists, expr('.ssn'))
		.body(exists, expr('.knownAddresses'))
		.body(exists, expr('.knownAddresses[0].street'))
		.body(exists, expr('.knownAddresses[0].city'))
		.body(exists, expr('.knownAddresses[0].zipCode'))
		.body(exists, expr('.knownAddresses[1].street'))
		.body(exists, expr('.knownAddresses[1].city'))
		.body(exists, expr('.knownAddresses[1].zipCode'))
		.body(exists, expr('.ipAddresses'))
		.body((ipAddresses: string[]) => ipAddresses.length === 3, expr('.ipAddresses'))
		.ensure()

	t.pass()
})

test('invalid POST body', async t => {
	await t.throwsAsync(got(url, {
		method: 'POST',
		json: invalidTemplate,
		responseType: 'json'
	}), {
		message: 'Response code 400 (Bad Request)'
	})
})

test('valid GET request', async t => {
	await freddo(url)
		.status(200)
		.body(isHTML)
		.ensure()

	await freddo(`${url}/demo.gif`)
		.status(200)
		.body((body: string) => isImage(Buffer.from(body, 'utf8'), 'gif'))
		.ensure()

	await freddo(`${url}/favicon.png`, {encoding: null})
		.status(200)
		.body((body: string) => isImage(Buffer.from(body), 'png'))
		.ensure()

	await freddo(`${url}/xyz`)
		.status(200)
		.header('content-length', 17)
		.body('Use POST request.')
		.ensure()

	t.pass()
})
