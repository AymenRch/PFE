import cors from 'cors';
import express from 'express';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "uploads" folder
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//rouets
import UserRoute from './routes/UserRoute.js';
app.use('/auth', UserRoute);

import ProjectRoute from './routes/ProjectRoute.js';
app.use('/proj',ProjectRoute);

import requestRoute from './routes/requestRoute.js';
app.use('/request',requestRoute);

// Ensure the correct port number
app.listen(9000, () => {
  console.log('Server is running on port 9000');
});
