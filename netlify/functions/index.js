const API_ENDPOINT = "https://cat-fact.herokuapp.com/facts";

exports.handler = async (request) => {
  try {
    console.log(123);
    let data = await fetch("https://pokeapi.co/api/v2/pokemon/ditto").then(
      (result) => result.json()
    );
    console.log(234, data);
    return Response.json({
      request,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};
