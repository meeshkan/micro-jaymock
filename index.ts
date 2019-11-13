import { IncomingMessage, ServerResponse } from 'http'
const { json, send } = require('micro')

const jaymock = require('@unmock/jaymock')
const chance = require('chance')

const jm = jaymock()
jm.extend('chance', new chance())

module.exports = async (req: IncomingMessage, res: ServerResponse) => {
    try {
        send(res, 200, jm.populate(await json(req)))
    } catch (e) {
        console.error(e.message)
        return send(res, 400, e.message)
    }
}