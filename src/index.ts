import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import globalRouter from './global-router.js';
import { logger } from './logger.js';
import { connectToDatabase } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
connectToDatabase();

// Middleware
app.use(logger);
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/v1/', globalRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
