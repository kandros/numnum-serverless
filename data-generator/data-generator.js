'use strict'

const { getRandom } = require('./utils')
const { queueMessage } = require('./queue')

function genOperation() {
  const f = () => getRandom(0, 10)

  return {
    type: 'SUM',
    payload: {
      nums: [f(), f(), f()],
    },
  }
}

exports.handler = (_event, _context, callback) => {
  try {
    for (let i = 0; i < 30; i++) {
      queueMessage(process.env.QUEUE_URL, genOperation())
    }
    callback(null)
  } catch (e) {
    callback(e)
  }
}
