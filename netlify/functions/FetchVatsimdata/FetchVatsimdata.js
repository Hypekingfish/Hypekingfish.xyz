export const handler = schedule('* * * * *', async (event) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Function is working" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
});
