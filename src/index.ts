import 'dotenv/config';
import express from 'express';
import globalRouter from './global-router.js';
import { logger } from './logger.js';
import OpenAI from 'openai';
import connectDB from './db.js';
import bodyParser from 'body-parser';
import { MongoClient, MongoCompatibilityError } from 'mongodb';

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB connection URI
const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri, )
connectDB();

app.use(logger);
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/v1/', globalRouter);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `
You are professional teacher who explain math from visualization using manim. 
You should create a manim code from user prompt.
Please, return your response in following array JSON format: 
{
  manim_code: [
    {
      "code": "manim code"
    }
  ]
}
If user prompt is irrelevant return empty array of code.
`;
const userPrompt =
  'I am a pupils, who dont understand perimeter concept. Please create manim code!';


const main = async () => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: {
        type: 'json_object',
      },
    });

    const resJson: string | null = response.choices[0].message.content;
    if (resJson) {
      try {
        const parsedRes = JSON.parse(resJson);
        console.log(parsedRes.manim_code);
      } catch (e: any) {
        console.log('JSON parsing failed:', e.message);
      }
    }
  } catch (e: any) {
    console.log(e.message);
  }
};

main();

app.listen(PORT, () => {
  console.log(`Server runs at http://localhost:${PORT}`);
});