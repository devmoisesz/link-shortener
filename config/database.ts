import dns from 'node:dns';
import mongoose from 'mongoose';
import 'dotenv/config';

dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function connectDatabase(): Promise<void> {
    try {
        const mongoUri =
            process.env.NODE_ENV === 'test'
                ? process.env.MONGO_URI_TEST
                : process.env.MONGO_URI_DEV;

        await mongoose.connect(mongoUri!);

        console.log(
            process.env.NODE_ENV === 'test'
                ? 'Conectado ao Banco de Testes'
                : 'Conectado ao Banco de Desenvolvimento'
        );
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error);

        process.exit(1);
    }
}