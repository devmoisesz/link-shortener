import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar ao MongoDB:', error);

    process.exit(1);
  }
}