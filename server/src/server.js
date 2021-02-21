const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes");

const app = express();
//app.use(allowCors)

const server = require("http").Server(app);

mongoose.connect(
  `mongodb+srv://debts:MzzMj3wPfHnQa0c6@cluster0.vuovm.mongodb.net/debts?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
);

//x-powered-by desabilitado, para que do lado cliente
//não seja express medida de segurança
app.disable("x-powered-by");

app.use(cors()); //Configuração para mermissão de origens de requisição
app.use(express.json()); //Definito formato Json para troca de mensagens da API

app.use(routes);

server.listen(3003);
