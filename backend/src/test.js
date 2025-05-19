require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

console.log('API Key:', process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testAPI() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Merhaba");
    const response = await result.response;
    const text = response.text();
    console.log('Test başarılı! Yanıt:', text);
  } catch (error) {
    console.error('Test başarısız! Hata:', error.message);
  }
}

testAPI(); 