const User = require("../models/user");
const Utils = require("../utils/utils");
const Msgs = require("../utils/messages");
const OB = "User";
const OBJ = "usuário";

module.exports = {
  async addUser(req, res) {
    try {
      //valida entradas
      let newUser = await Utils.validateInput(req, OB, false);
      if (newUser.validationMessage) {
        return Utils.retErr(res, newUser.validationMessage);
      }

      //verifica se já existe um user com o email
      let userExist = await User.findOne({ email: newUser.email });
      if (userExist) {
        return Utils.retErr(res, Msgs.msg(1, "email", newUser.email, OBJ));
      }

      //cria usuário
      User.create(newUser, function (err, user) {
        if (err) {
          return Utils.retErr(res, Msgs.msg(2, "inserir", OBJ, err.message));
        } else {
          return Utils.retOk(req, res, Utils.returnUser(user, true));
        }
      });
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "addUser", err.message));
    }
  },

  async updateUsuario(req, res) {
    try {
      //valida as entradas
      let updtUser = await Utils.validateInput(req, OB, false);

      updtUser.idUser = req.body.idUser;

      if (updtUser.validationMessage) {
        return Utils.retErr(res, updtUser.validationMessage);
      }

      //atualiza user
      User.updateOne(
        { idUser: updtUser.idUser },
        {
          username: updtUser.username,
          email: updtUser.email,
          password: updtUser.password,
          birthdate: !updtUser.birthdate ? null : updtUser.birthdate,
          sex: !updtUser.sex ? null : updtUser.sex,
        },
        {
          upsert: false,
        },
        function (err, doc) {
          if (err) {
            return Utils.retErr(
              res,
              Msgs.msg(2, "atualizar", OBJ, err.message)
            );
          } else if (doc.nModified === 0 && doc.n === 0) {
            return Utils.retErr(res, Msgs.msg(5, OBJ, updtUser.idUser));
          } else {
            return Utils.retOk(req, res, Utils.returnUser(updtUser, true));
          }
        }
      );
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "updateUsuario", err.message));
    }
  },

  async getUserById(req, res) {
    try {
      //valida a entrada
      const userId = req.params.id;
      if (!userId) {
        return Utils.retErr(res, Msgs.msg(3, OBJ));
      }

      //consulta user
      User.find({ idUser: userId }).exec((err, user) => {
        if (err) {
          return Utils.retErr(res, Msgs.msg(2, "consultar", OBJ, err.message));
        } else if (user.length !== 0) {
          return Utils.retOk(req, res, Utils.returnUser(user[0], false));
        } else {
          return Utils.retErr(res, Msgs.msg(5, OBJ, userId));
        }
      });
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "getUserById", err.message));
    }
  },

  async deleteUser(req, res) {
    try {
      const userId = req.params.id;
      if (!userId) {
        return Utils.retErr(res, Msgs.msg(3, OBJ));
      }

      let idUser = req.body.idUser;

      //userId => é o id do usuário que foi solicitado alterar
      //idUser => é o id do usuário que foi solicitou a alteração
      if (userId != idUser) {
        return Utils.retErr(
          res,
          `Usuário id ${idUser} não está autorizado a deletar o usuário ${userId}`
        );
      }

      //consulta id do User
      let user = await User.findOne({ idUser: userId }, "_id");
      if (!user) {
        return Utils.retErr(res, Msgs.msg(5, OBJ, userId));
      }

      User.deleteOne({ idUser: userId }, function (err, doc) {
        if (err) {
          return Utils.retErr(res, Msgs.msg(2, "remover", OBJ, err.message));
        } else if (doc.deletedCount === 0) {
          return Utils.retErr(res, Msgs.msg(5, OBJ, userId));
        } else {
          return Utils.retOk(req, res, { message: Msgs.msg(6, OBJ, userId) });
        }
      });
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "deleteUser", err.message));
    }
  },

  async getUsers(req, res) {
    try {
      User.find({}, { _id: false }).exec((err, users) => {
        if (err) {
          return Utils.retErr(res, "Users searched failed!");
        }

        if (users.length === 0) {
          return Utils.retErr(res, `Nenhum usuário foi localizado.`);
        }

        users = Utils.replaceStr(
          users,
          ["idUser", "T00:00:00.000Z"],
          ["id", ""]
        );
        return Utils.retOk(req, res, users);
      });
    } catch (err) {
      return Utils.retErr(res, Msgs.msg(3, "getUsers", err.message));
    }
  },
};
