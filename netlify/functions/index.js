const API_ENDPOINT = "https://cat-fact.herokuapp.com/facts";

export default async (request, context) => {
  try {
    return {
      request,
      context,
    };
  } catch (error) {
    console.log(error);
  }
};
