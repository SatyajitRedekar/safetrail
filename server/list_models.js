const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI('AIzaSyDZaUn3Uriw7MpyJVNiqM7H7lNqBZKS-Cs');

async function listModels() {
  try {
    const models = [];
    // Wait, the SDK in v0.24.1 might not have listModels exposed nicely. 
    // Wait, we can fetch from the REST API using node-fetch or native fetch.
  } catch (err) {
    console.error(err);
  }
}
async function checkFetch() {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDZaUn3Uriw7MpyJVNiqM7H7lNqBZKS-Cs');
  const data = await response.json();
  console.log(data);
}
checkFetch();
