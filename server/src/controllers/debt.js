const Utils = require("../utils/utils");
const Debt = require("../models/debt");
const Msgs = require("../utils/messages");
const getClients = require("../utils/json-placeholder");
const OB = "Debt";
const OBJ = "dívida";

module.exports = {
  async addDebt(req, res) {
    try {
      //Validação da entrada
      let newDebt = await Utils.validateInput(req, OB, false);
      if (newDebt.validationMessage) {
        return Utils.retErr(res, newDebt.validationMessage);
      }

      //Grava Dívida
      Debt.create(newDebt, function (err, debt) {
        if (err) {
          return Utils.retErr(res, Msgs.msg(2, "adicionar", OBJ, err.message));
        }
        return Utils.retOk(req, res, {
          message: `A ${OBJ} foi cadastrada com sucesso!`,
        });
      });
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "addDebt", err.message));
    }
  },

  async updateDebt(req, res) {
    try {
      //Validação da entrada
      let updtDebt = await Utils.validateInput(req, OB, true);
      if (updtDebt.validationMessage) {
        return Utils.retErr(res, updtDebt.validationMessage);
      }

      let debt = await Debt.findOne({ idDebt: updtDebt.idDebt });

      if (!debt) {
        return Utils.retErr(res, Msgs.msg(5, OBJ, updtDebt.idDebt));
      }

      //Atualizar Dívida
      Debt.updateOne(
        { idDebt: updtDebt.idDebt },
        updtDebt,
        { upsert: false },
        function (err, doc) {
          if (err) {
            return Utils.retErr(
              res,
              Msgs.msg(2, "atualizar", OBJ, err.message)
            );
          } else if (doc.nModified === 0 && doc.n === 0) {
            return Utils.retErr(res, Msgs.msg(5, OBJ, updtDebt.idDebt));
          } else {
            return Utils.retOk(req, res, updtDebt);
          }
        }
      );
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "updateDebt", err.message));
    }
  },

  async deleteDebt(req, res) {
    try {
      const debtId = req.params.id;
      if (!debtId) {
        return Utils.retErr(res, Msgs.msg(4, OBJ));
      }

      //Consulta id do Debt
      let debt = await Debt.findOne({ idDebt: debtId });
      if (!debt) {
        return Utils.retErr(res, Msgs.msg(5, OBJ, debtId));
      }

      Debt.deleteOne({ idDebt: debtId }, function (err) {
        if (err) {
          return Utils.retErr(res, Msgs.msg(2, "remover", OBJ, err.message));
        }
        return Utils.retOk(req, res, { message: `A ${OBJ} foi removida!` });
      });
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "deleteDebt", err.message));
    }
  },

  async getDebtById(req, res) {
    try {
      const debtId = req.params.id;
      if (!debtId) {
        return Utils.retErr(res, 400, Msgs.msg(3, OBJ));
      }

      let debt = await Debt.findOne({ idDebt: debtId });

      if (!debt) {
        return Utils.retErr(res, Msgs.msg(5, OBJ, debtId));
      }

      return Utils.retOk(req, res, Utils.returnDebt(debt));
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "getDebtById", err.message));
    }
  },

  async getDebtsByClientId(req, res) {
    try {
      const clientId = req.params.id;
      if (!clientId) {
        return Utils.retErr(res, 400, Msgs.msg(3, OBJ));
      }

      let debts = await Debt.find({
        clientId: clientId,
      });

      return Utils.retOk(req, res, Utils.returnDebts(debts));
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "getDebtsByClientId", err.message));
    }
  },

  async getAllDebtors(req, res) {
    try {
      let debtors = await Debt.aggregate([
        {
          $group: {
            _id: "$clientId",
            sumOfDebts: {
              $sum: "$value",
            },
          },
        },
      ]);

      const clients = await getClients();

      debtors = debtors.map((d) => {
        return {
          sumOfDebts: d.sumOfDebts,
          debtor: clients.find((c) => c.id === d._id),
        };
      });

      return Utils.retOk(req, res, debtors);
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "getAllDebtors", err.message));
    }
  },
};
