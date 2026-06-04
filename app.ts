import 'dotenv/config';
import express from 'express';
import { connectDatabase } from './config/database';
import shortUrlRoutes from './src/routes/short-url.routes'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // maximo 100 requisições por IP
  message: 'Muitas requisições, tente novamente mais tarde'
});

const app = express();

app.use(express.json());

app.use('/shortener', shortUrlRoutes, limiter)

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});