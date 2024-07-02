import { Router } from 'express';
import GptService from './gpt-service.js';
import GptController from './gpt-controller.js';

const gptRouter = Router();
const gptService = new GptService();
const gptController = new GptController(gptService);

gptRouter.post('/generate-and-run-manim', gptController.getCode);

export default gptRouter;
