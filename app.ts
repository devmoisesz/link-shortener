import 'dotenv/config';
import express from 'express';
import { connectDatabase } from './config/database.ts';
import shortUrlRoutes from './src/routes/short-url.routes.ts'

const app = express();

app.use(express.json());

app.use('/shortener', shortUrlRoutes)

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});