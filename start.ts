import app from "./app";
import { connectDatabase } from "./config/database";

connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
});