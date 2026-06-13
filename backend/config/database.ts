import dns from 'node:dns';
import mongoose from 'mongoose';
import 'dotenv/config';
import { config } from './index';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.db.url);

    console.log(
      config.env === "test"
        ? "Conectado ao Banco de Testes"
        : "Conectado ao Banco de Produção"
    );
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error);
    process.exit(1);
  }
}