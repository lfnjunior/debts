var assert = require("assert");
const Utils = require("../src/utils/utils");

let req = {
  body: {
    clientId: 1,
    reason: "por que sim",
    date: "2021-01-01T01:01:01.000Z",
    value: 15.1,
  },
};
let objectName = "Debt";
let idIsRequired = false;
let res = null;

describe("Validar Dívida \n", async () => {
  it("Objeto válido - deve inserir", async () => {
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(res.validationMessage, undefined);
  });
  it("Id do cliente não informado / inválido - não deve inserir", async () => {
    req.body.clientId = "";
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      "clientId =  não é um número válido."
    );
    req.body.clientId = undefined;
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      "Parâmetro clientId é obrigatório."
    );
  });
  it("Motivo não informado / inválido - não deve inserir", async () => {
    req.body.clientId = 2;
    req.body.reason = "";
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      'O conteúdo do atributo reason está vazio ("").'
    );
    req.body.reason = undefined;
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      "Parâmetro reason é obrigatório."
    );
  });
  it("Data não informado / inválido - não deve inserir", async () => {
    req.body.reason = "motivo";
    req.body.date = "2021-01-01";
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      "date = 2021-01-01 não está no formato YYYY-MM-DDTHH:mm:ss.sssZ."
    );
    req.body.date = undefined;
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(res.validationMessage, "Parâmetro date é obrigatório.");
  });
  it("Valor não informado / inválido - não deve inserir", async () => {
    req.body.date = "2021-01-01T01:01:01.000Z";
    req.body.value = "1256a";
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      "value = 1256a não é um número válido."
    );
    req.body.value = 0;
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      "value = 0 não é um número válido."
    );
    req.body.value = null;
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      "value = null não é um número válido."
    );
    req.body.value = undefined;
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(res.validationMessage, "Parâmetro value é obrigatório.");
  });
  it("Objeto vazio - não deve inserir", async () => {
    req.body = {};
    res = await Utils.validateInput(req, objectName, idIsRequired);
    assert.strictEqual(
      res.validationMessage,
      "Parâmetro clientId é obrigatório."
    );
  });
});
