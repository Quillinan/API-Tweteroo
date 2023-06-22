const express = require("express");
const app = express();

// Rota para servir a página HTML estática
app.use(express.static("public"));

// Iniciar o servidor
app.listen(5000, () => {
  console.log("Servidor rodando");
});
