'use strict'

const AWS = require('aws-sdk')

const SQS = new AWS.SQS({ apiVersion: '2012-11-05' })
const Lambda = new AWS.Lambda({ apiVersion: '2015-03-31' })

const QUEUE_URL = process.env.QUEUE_URL

function invokePoller(functionName, message) {
  const payload = {
    message,
  }
  const params = {
    FunctionName: functionName,
    InvocationType: 'Event',
    Payload: new Buffer(JSON.stringify(payload)),
  }
  return new Promise((resolve, reject) => {
    Lambda.invoke(params, err => (err ? reject(err) : resolve()))
  })
}

function poll(schedulerFunctionName, workerFunctionName, callback) {
  const maxMessages = 10
  const params = {
    QueueUrl: QUEUE_URL,
    MaxNumberOfMessages: maxMessages,
    VisibilityTimeout: 10,
  }

  SQS.receiveMessage(params, (err, data) => {
    if (err) {
      return callback(err)
    }

    // Lambda.invoke(
    //   {
    //     FunctionName: schedulerFunctionName,
    //     InvocationType: 'Event',
    //     Payload: new Buffer(
    //       JSON.stringify({
    //         message,
    //       }),
    //     ),
    //   },
    //   err => (err ? callback(err) : callback(null)),
    // )

    const promises = data.Messages.map(message =>
      invokePoller(workerFunctionName, message),
    )

    Promise.all(promises).then(() => {
      const result = `Messages received: ${data.Messages.length}`
      console.log(result)
      callback(null, result)
    })
  })
}

exports.handler = (_event, context, callback) => {
  try {
    poll(context.functionName, process.env.WORKER_SUM, callback)
  } catch (err) {
    callback(err)
  }
}
