const API_ENDPOINT = "https://cat-fact.herokuapp.com/facts";

export default async (request, context) => {
  try {
    console.log(123, JSON.stringify(request));
    console.log(234, JSON.stringify(context));
  } catch (error) {
    console.log(error);
  }
};
