const inputs = require("./validators");
const moment = require("moment");

module.exports = {
  formatDateTime(date) {
    return moment(date).format("YYYY-MM-DDTHH:mm:ss.sssZ");
  },

  replaceStr(json, oldStr, newStr) {
    let str = JSON.stringify(json);
    for (let i = 0; i < oldStr.length; i++) {
      str = str.replace(new RegExp(oldStr[i], "g"), newStr[i]);
    }
    return JSON.parse(str);
  },

  async validateInput(req, objectName, idIsRequired) {
    let attribute = null;
    let isRequired = null;
    let type = null;
    let buildObj = {};
    let dateFormats = [];
    let attributes = inputs.objects[`${objectName}`].bodyAttributes;
    for (let i = 0; i < attributes.length; i++) {
      attribute = attributes[i].name;

      type = attributes[i].type;

      isRequired = attributes[i].required;

      if (attribute === "id" && idIsRequired && req.params.id === undefined) {
        return { validationMessage: `Parâmetro ${attribute} é obrigatório.` };
      } else if (attribute === "id" && idIsRequired) {
        buildObj[attribute + objectName] = req.params.id;
      } else if (isRequired && req.body[attribute] === undefined) {
        return { validationMessage: `Parâmetro ${attribute} é obrigatório.` };
      } else if (!isRequired && req.body[attribute] === undefined) {
        buildObj[attribute] = null;
      } else {
        buildObj[attribute] = req.body[attribute];
      }

      if (isRequired) {
        if (type === "string") {
          if (buildObj[attribute] === "") {
            return {
              validationMessage: `O conteúdo do atributo ${attribute} está vazio ("").`,
            };
          }
        }
        if (type === "int64") {
          if (
            !Number.isInteger(buildObj[attribute]) ||
            buildObj[attribute] <= 0
          ) {
            return {
              validationMessage: `${attribute} = ${buildObj[attribute]} não é um número válido.`,
            };
          }
        }
        if (type === "number") {
          if (isNaN(buildObj[attribute]) || buildObj[attribute] <= 0) {
            return {
              validationMessage: `${attribute} = ${buildObj[attribute]} não é um número válido.`,
            };
          }
        }
      }

      if (buildObj[attribute]) {
        if (type === "date-time") {
          dateFormats = ["YYYY-MM-DDTHH:mm:ss.sssZ"]; /**moment.ISO_8601 */
          if (!moment(buildObj[attribute], dateFormats, true).isValid()) {
            return {
              validationMessage: `${attribute} = ${buildObj[attribute]} não está no formato YYYY-MM-DDTHH:mm:ss.sssZ.`,
            };
          }
        }
        //validação de sex
        if (attribute === "sex") {
          if (!(buildObj[attribute] === "M" || buildObj[attribute] === "F")) {
            return {
              validationMessage: `Sexo = ${buildObj[attribute]} inválido. deve ser M ou F.`,
            };
          }
        }
      }
    }
    return buildObj;
  },

  relationIdMongo(res, objName, err, obj, id) {
    if (err) {
      this.retErr(
        res`Banco de dados nao conseguiu consultar ${objName}: ${err.message}`
      );
    } else if (!obj) {
      this.retErr(
        res,
        `Não foi encontrado nenhum ${objName} com o id = ${id}.`
      );
    } else {
      return obj._id;
    }
  },

  returnDebts(debts) {
    let debtsRet = [];
    if (debts.length > 0) {
      for (let i = 0; i < debts.length; i++) {
        debtsRet[i] = this.returnDebt(debts[i]);
      }
    } else {
      debtsRet = debts;
    }
    return debtsRet;
  },

  returnDebt(debt) {
    let debtRet = {
      id: debt.idDebt,
      clientId: debt.clientId,
      reason: debt.reason,
      date: debt.date,
      value: debt.value,
    };
    return debtRet;
  },

  returnUser(user, showPassword) {
    let userRet = {
      id: user.idUser,
      username: user.username,
      email: user.email,
      birthdate: user.birthdate
        ? this.formatDateTime(user.birthdate)
        : undefined,
      sex: user.sex ? user.sex : undefined,
    };
    return userRet;
  },

  retErr(res, msg) {
    return res.status(400).json({ message: msg });
  },

  retOk(req, res, obj) {
    let path = req.route.path;
    let method = req.method;
    let nomeObj = null;
    let acao = null;
    let final = "o";
    let msg = "";

    switch (path) {
      case "/debt/:debtId":
        nomeObj = "Dívida";
        break;
      case "/debt":
        nomeObj = "Dívida";
        break;
      case "/debt/search":
        nomeObj = "Dívida";
        break;
      case "/user/:userId":
        nomeObj = "Usuário";
        break;
      case "/user/login":
        nomeObj = "Usuário";
        acao = "autenticad";
        break;
      case "/user":
        nomeObj = "Usuário";
        break;
      default:
        break;
    }

    if (!acao) {
      switch (method) {
        case "POST":
          acao = "gravad";
          break;
        case "PUT":
          acao = "atualizad";
          break;
        case "DELETE":
          acao = "deletad";
          break;
        case "GET":
          acao = "consultad";
          break;
        default:
          break;
      }
    }

    if (path === "/me") msg = "Usuário autenticado com sucesso";

    if (nomeObj && acao)
      msg = nomeObj + " foi " + acao + final + " com sucesso!";

    return res.status(200).json(obj);
  },
};
