//backend functions using netlify functions to execute aka server side script
exports.handler = async (event) => {
  try {
    const result = await fetch("https://stg-id.singpass.gov.sg/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(event.queryStringParameters),
    });
    const data = await result.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ data: data }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.log(error);
  }
};
