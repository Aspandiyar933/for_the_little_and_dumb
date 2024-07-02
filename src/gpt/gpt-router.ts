import { Router } from 'express';
import GptService from './gpt-service.js';
import GptController from './gpt-controller.js';

//in order to provide our frontend with the user data, we need to specify user routes

const gptRouter = Router();

const gptService = new GptService();
const gptController = new GptController(gptService);

gptRouter.post('/codes/', gptController.getCode);

export default gptRouter;