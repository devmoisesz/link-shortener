import app from "./app";
import { connectDatabase } from "./config/database";
import { config } from "./config";

connectDatabase();

app.listen(config.server.port, () => {
  console.log(`Servidor rodando na porta ${config.server.port}`);
});