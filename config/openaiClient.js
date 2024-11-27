// dotenv 불러오기
require('dotenv').config();

const { OpenAI } = require('openai'); // OpenAI 클라이언트 불러오기

// OpenAI 설정
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // .env에서 API 키 가져오기
    engine: 'gpt-4', // OpenAI 4.0 모델 사용
});

module.exports = openai;