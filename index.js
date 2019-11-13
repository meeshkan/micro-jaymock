const jaymock = require('@unmock/jaymock')
const { json } = require('micro')

const jm = jaymock()
jm.extend('chance', new require('chance')()) // Add custom functions using `jaymock.extend()`

module.exports = async (req, res) => jm.populate(await json(req))