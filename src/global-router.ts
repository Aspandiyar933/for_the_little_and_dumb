import { Router } from 'express';
import gptRouter from './gpt/gpt-router.js';

const globalRouter = Router();

globalRouter.use('/gpt', gptRouter);

export default globalRouter;
