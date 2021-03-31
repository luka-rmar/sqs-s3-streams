const AWS = require('aws-sdk');
const { Writable, pipeline } = require('stream')
const csvtojson = require('csvtojson')
const { promisify } = require("util")


class Hanlder {
  constructor({ s3, sqs }){
    this.s3 = s3
    this.sqs = sqs
    this.queueName = process.env.SQS_QUEUE_NAME
    this.pilepineAsync = promisify(pipeline)
  }

  static getSdks() {
    const host = process.env.LOCALSTACK_HOST || "localhost";
    const portServices = process.env.PORT_SERVICE || "4566";
    const isLocal = process.env.IS_LOCAL;

    const s3config = {
      endpoint: `http://${host}:${portServices}`,
      s3ForcePathStyle: true
    }

    const sqsconfig = {
      endpoint: `http://${host}:${portServices}`
    }

    if(!isLocal) {
      delete s3config.endpoint;
      delete sqsconfig.endpoint;
    }

    return {
      s3: new AWS.S3(s3config),
      sqs: new AWS.SQS(sqsconfig)
    }

  }

  async getQueueUrl() {
    const { QueueUrl } = await this.sqs.getQueueUrl({
      QueueName: this.queueName
    }).promise()

    return QueueUrl;
  }

  processDataOnDemand(queueUrl) {
    const writableStream = new Writable({
      write: (chunk, encoding, done) => {
        const item = chunk.toString()

        console.log("test sending...", item)

        this.sqs.sendMessage({
          QueueUrl: queueUrl,
          MessageBody: item
        }, done())
        
      }
    })

    return writableStream;
  }

  async pipefyStreams(...args) {
    return await this.pilepineAsync(
      ...args
    )  
  }


  async main (event) {
    const [
      {
          s3: {
              bucket: {
                  name
              },
              object: {
                  key
              }
          }
      }
  ] = event.Records

    try {
      const queueUrl = await this.getQueueUrl()
      const params = { Bucket: name, Key: key }
      
      await this.pipefyStreams(
        this.s3
        .getObject(params)
        .createReadStream(),
        csvtojson(),
        this.processDataOnDemand(queueUrl)
      )
        
      // this.s3.getObject(params)
      //   .createReadStream()
      //   .pipe(csvtojson())
      //   .pipe(this.processDataOnDemand())

      return{
        statusCode: 200,
        body: "Hello S3"
      }
    } catch (error) {
      console.log("Error *******", error.stack)

      return {
        statusCode: 500,
        body: "internal Error"
      }

    }
  }
}


const { s3, sqs } = Hanlder.getSdks();


const handler = new Hanlder({
  s3,
  sqs
});

module.exports = handler.main.bind(handler);