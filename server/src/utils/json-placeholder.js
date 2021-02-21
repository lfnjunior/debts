const axios = require("axios");

module.exports = async (id) => {
  const clientHttp = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com",
  });

  try {
    if (id) {
      let client = null;
      client = await clientHttp.get(`/users/${id}`);
      return {
        id: client.data.id,
        name: client.data.name,
      };
    } else {
      let clients = null;
      clients = await clientHttp.get("/users");
      clients = clients.data.map((c) => {
        return {
          id: c.id,
          name: c.name,
        };
      });
      return clients;
    }
  } catch (error) {
    return [];
  }
};
