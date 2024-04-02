exports.handler = async (event) => {
  try {
    console.log(123);
    // const {
    //   client_id,
    //   redirect_uri,
    //   grant_type,
    //   code,
    //   client_assertion_type,
    //   client_assertion,
    // } = event.queryStringParameters;
    await fetch("https://stg-id.singpass.gov.sg/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(event.queryStringParameters),
    }).then((result) => console.log(result.data));
    return {
      statusCode: 200,
      body: JSON.stringify({ data: result.data }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.log(error);
  }
};
