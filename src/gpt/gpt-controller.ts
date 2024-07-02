import { Request, Response } from 'express';
import GptService from './gpt-service.js';

class GptController {
  private gptService: GptService;

  constructor(gptService: GptService) {
    this.gptService = gptService;
  }

  getCode = async (req: Request, res: Response) => {
    const { userPrompt } = req.body;
    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      const generatedCode = await this.gptService.generateManimCode(userPrompt);
      await this.gptService.saveManimCodeToDB(generatedCode);
      const output = await this.gptService.runManimScript(generatedCode);

      res.status(201).json({ message: 'Manim script executed successfully', output });
    } catch (error: any) {
      console.error(error.message);
      res.status(500).json({ error: 'Failed to process request' });
    }
  };
}

export default GptController;
