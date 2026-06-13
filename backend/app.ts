import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import shortUrlRoutes from './src/routes/short-url.routes'
import usersRoutes from './src/routes/users.routes'
import rateLimit from 'express-rate-limit'
import { config } from './config';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './src/docs/swagger';


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // maximo 100 requisições por IP
  message: 'Muitas requisições, tente novamente mais tarde'
});

const app = express();

app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

app.use(express.json());

app.use('/shortener', limiter, shortUrlRoutes)

app.use('/users', limiter, usersRoutes)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

export default app