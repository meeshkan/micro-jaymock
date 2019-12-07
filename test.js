import test from 'ava'
import { freddo, expr, exists } from 'freddo'
import got from 'got'
import micro from 'micro'
import testListen from 'test-listen'
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

let url

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
		.body((ipAddresses) => ipAddresses.length === 3, expr('.ipAddresses'))
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

const isHTML = body => body.startsWith('<!DOCTYPE html>')
test('valid GET request', async t => {
	await freddo(url)
		.status(200)
		.body(isHTML)
		.ensure()
	
	t.pass()
})