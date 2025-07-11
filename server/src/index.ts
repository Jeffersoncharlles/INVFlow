import { env } from "./config/env.ts";
import { createServer } from "./infra/http/server.ts";

// 1. Cria a instância do servidor com todas as rotas e configurações
const server = createServer();

// 2. Define a função assíncrona para iniciar o servidor
const start = async () => {
  try {
    // 3. Inicia o servidor na porta e host definidos
    await server.listen({ port: env.PORT, host: "0.0.0.0" });

    // Loga uma mensagem de sucesso no console (opcional, mas útil)
    console.log(`Servidor rodando em http://${env.SERVER_IP}:${env.PORT}`);
  } catch (err) {
    // 4. Se houver um erro, loga e encerra a aplicação
    server.log.error(err);
    process.exit(1);
  }
};

// 5. Executa a função de inicialização
start();
