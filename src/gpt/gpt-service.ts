import openai from '../openai.js';
import { ManimCode } from './gpt-types.js';

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

class GptService {
  async getCode(userPrompt: string) {
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
            content: [
              {
                type: 'text',
                text: userPrompt,
              },
            ],
          },
        ],
        response_format: {
          type: 'json_object',
        },
      });

      const resJson: string | null = response.choices[0].message.content;
      if (resJson) {
        const parsedRes = JSON.parse(resJson);
        return parsedRes.manim_code as ManimCode[];
      } else {
        return null;
      }
    } catch (e: any) {
      console.log(e.message);
    }
  }
}

export default GptService;