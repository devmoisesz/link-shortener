import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './config/database';
import shortUrlRoutes from './src/routes/short-url.routes'
import usersRoutes from './src/routes/users.routes'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // maximo 100 requisições por IP
  message: 'Muitas requisições, tente novamente mais tarde'
});

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(express.json());

app.use('/shortener', limiter, shortUrlRoutes)

app.use('/users', limiter, usersRoutes)

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});