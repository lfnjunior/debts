const Utils = require("../utils/utils");
const Msgs = require("../utils/messages");
const getClients = require("../utils/json-placeholder");

module.exports = {
  async getClientById(req, res) {
    try {
      const clients = await getClients(req.params.id);

      return Utils.retOk(req, res, clients);
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "getAllClients", err.message));
    }
  },

  async getAllClients(req, res) {
    try {
      const clients = await getClients();

      return Utils.retOk(req, res, clients);
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "getAllClients", err.message));
    }
  },
};
