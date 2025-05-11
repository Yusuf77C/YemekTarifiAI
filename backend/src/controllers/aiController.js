const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// API key kontrolü
console.log('API Key:', process.env.GEMINI_API_KEY ? 'Mevcut' : 'Bulunamadı');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chat = async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Gelen mesaj:', message);

    if (!message) {
      throw new Error('Mesaj boş olamaz');
    }

    // Gemini AI modelini başlat
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('AI modeli başlatıldı');

    // Sohbet başlat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: "Sen bir yemek asistanısın. Kullanıcılara yemek tarifleri konusunda yardımcı olacaksın. Türkçe cevap ver. Tarifleri detaylı bir şekilde, malzemeler, hazırlanışı ve pişirme süresi ile birlikte anlat.",
        },
        {
          role: "model",
          parts: "Merhaba! Ben bir yemek asistanıyım. Size yemek tarifleri konusunda yardımcı olmaktan mutluluk duyarım. Ne yapmak istersiniz?",
        },
      ],
    });

    console.log('Chat başlatıldı');

    // Kullanıcı mesajını gönder ve yanıt al
    const result = await chat.sendMessage(message);
    console.log('AI yanıtı alındı');
    
    const response = await result.response;
    const text = response.text();
    console.log('AI yanıtı:', text);

    res.json({ response: text });
  } catch (error) {
    console.error('AI yanıtı alınamadı. Hata detayı:', error);
    console.error('Hata stack:', error.stack);
    res.status(500).json({ 
      error: 'AI yanıtı alınamadı',
      details: error.message,
      stack: error.stack
    });
  }
};

module.exports = {
  chat
}; 