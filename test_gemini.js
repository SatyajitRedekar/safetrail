const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyDZaUn3Uriw7MpyJVNiqM7H7lNqBZKS-Cs');
async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello!");
    console.log(result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}
run();
