const API_ENDPOINT = "https://cat-fact.herokuapp.com/facts";

export default async (request, context) => {
  try {
    let data = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    return Response.json({
      request,
      context,
      data,
    });
  } catch (error) {
    console.log(error);
  }
};
