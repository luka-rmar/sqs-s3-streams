class Hanlder {
  async main (event) {
    console.log("Event SQS", 
      JSON.stringify(
        event,
        null,
        2
      )
    )


    try {
      return{
        statusCode: 200,
        body: "Test SQS"
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



const handler = new Hanlder();

module.exports = handler.main.bind(handler);