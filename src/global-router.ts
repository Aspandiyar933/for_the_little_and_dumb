import { Router } from 'express';
import gptRouter from './gpt/gpt-router.js';
// other routers can be imported here

const globalRouter = Router();

// Use the userRouter for user-related routes
globalRouter.use(gptRouter);

// other routers can be added here

export default globalRouter;