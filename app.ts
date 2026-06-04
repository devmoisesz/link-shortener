import 'dotenv/config';
import express from 'express';
import { connectDatabase } from './config/database';
import shortUrlRoutes from './src/routes/short-url.routes'

const app = express();

app.use(express.json());

app.use('/shortener', shortUrlRoutes)

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});