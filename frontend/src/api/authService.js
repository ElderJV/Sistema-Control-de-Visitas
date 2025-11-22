import api from "./axiosConfig";

export default {
  login: async (email, password) => {
    // Cambiar la estructura de envio del post de login
    const res = await api.post("/auth/token", {
      username: email,
      password,
    });
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/auth");
    return res.data.User;
  },
};
