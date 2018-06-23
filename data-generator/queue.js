const AWS = require('aws-sdk')

// AWS.config.update({ region: process.env.AWS_REGION })
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' })

exports.queueMessage = function(queueUrl, messageBody) {
  const params = {
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(messageBody),
  }

  sqs.sendMessage(params, function(err, data) {
    if (err) {
      console.log('Error', err)
    } else {
      console.log('Success', data.MessageId)
    }
  })
}
