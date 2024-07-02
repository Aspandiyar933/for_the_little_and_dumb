import { openai } from '../openai.js';
import path from 'path';
import fs from 'fs';
import { PythonShell } from 'python-shell';
import { connectToDatabase, closeDatabaseConnection } from '../db.js';

export default class GptService {
  private systemPrompt: string;

  constructor() {
    this.systemPrompt = `
    You are a professional teacher who explains math through visualization using Manim. 
    You should create Manim code from the user prompt.
    Please, return your response in the following JSON array format: 
    {
      "manim_code": [
        {
          "code": "manim code"
        }
      ]
    }
    If the user prompt is irrelevant, return an empty array of code.
    `;
  }

  async generateManimCode(userPrompt: string) {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: this.systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const resJson: string | null = response.choices[0].message.content;
    if (resJson) {
      const parsedRes = JSON.parse(resJson);
      return parsedRes.manim_code;
    } else {
      throw new Error('Failed to generate Manim code');
    }
  }

  async saveManimCodeToDB(codeList: { code: string }[]): Promise<void> {
    const db = await connectToDatabase();
    const collection = db.collection('manim_code');

    await collection.insertMany(codeList);
    console.log('Manim code saved to MongoDB');

    await closeDatabaseConnection();
  }

  async runManimScript(codeList: { code: string }[]): Promise<string> {
    const scriptPath = path.join(__dirname, 'scripts', 'user_script.py');
    const outputPath = path.join(__dirname, 'scripts', 'output.mp4');

    fs.writeFileSync(scriptPath, codeList[0].code);

    const options = {
      args: [outputPath],
    };

    return this.executePythonScript(scriptPath, options);
  }

  private executePythonScript(scriptPath: string, options: object): Promise<string> {
    return PythonShell.run(scriptPath, options)
      .then((messages) => {
        console.log('Manim script executed successfully');
        return path.join(__dirname, 'scripts', 'output.mp4'); // Output path must be returned
      })
      .catch((err) => {
        console.error('Failed to execute Manim script:', err);
        throw err;
      });
  }
}
