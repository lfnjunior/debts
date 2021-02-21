const express = require("express");

const UserController = require("./controllers/user");
const DebtController = require("./controllers/debt");
const AuthController = require("./controllers/auth");
const ClientController = require("./controllers/client");

const routes = express.Router();

const auth = require("./midllewares/auth");

//rotas da API
routes.post("/user", UserController.addUser);
routes.put("/user/:id", auth, UserController.updateUsuario);
routes.get("/user", auth, UserController.getUsers);
routes.get("/user/:id", auth, UserController.getUserById);
routes.delete("/user/:id", auth, UserController.deleteUser);
routes.post("/user/login", AuthController.loginUser);

routes.post("/debt", auth, DebtController.addDebt);
routes.put("/debt/:id", auth, DebtController.updateDebt);
routes.delete("/debt/:id", auth, DebtController.deleteDebt);
routes.get("/debt/:id", auth, DebtController.getDebtById);
routes.get("/debtors", auth, DebtController.getAllDebtors);
routes.get("/debtor/:id", auth, DebtController.getDebtsByClientId);

routes.get("/client/:id", auth, ClientController.getClientById);
routes.get("/clients", auth, ClientController.getAllClients);

module.exports = routes;
