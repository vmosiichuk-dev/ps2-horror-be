import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import { router } from './api/index.ts';
import { CORS_OPTIONS } from './config/cors.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_PATH = path.resolve(__dirname, '..');
const STATIC_PATH = path.join(ROOT_PATH, 'public');

export const app = express();

app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.text());

app.use('/assets', express.static(STATIC_PATH));
app.use('/api', router);
