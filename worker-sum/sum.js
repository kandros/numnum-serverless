'use strict'

const AWS = require('aws-sdk')

const SQS = new AWS.SQS({ apiVersion: '2012-11-05' })
const QUEUE_URL = process.env.QUEUE_URL

function processMessage(message, callback) {
  const sum = JSON.parse(message.Body).payload.nums.reduce((a, b) => a + b, 0)

  console.log(`the Sum of nums is: ${sum}`)

  const params = {
    QueueUrl: QUEUE_URL,
    ReceiptHandle: message.ReceiptHandle,
  }
  SQS.deleteMessage(params, err => callback(err, message))
}

exports.handler = (event, _context, callback) => {
  try {
    processMessage(event.message, callback)
  } catch (err) {
    callback(err)
  }
}
