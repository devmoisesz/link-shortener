import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv/config';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);

    process.exit(1);
  }
}