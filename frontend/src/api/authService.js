import api from "./axiosConfig";

export default {
  login: async (email, password) => {
    // Enviar como form-data para OAuth2PasswordRequestForm
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);

    const res = await api.post("/auth/token", formData);
    return res.data;
  },

  getMe: async () => {
    const res = await api.get("/auth");
    return res.data.User;
  },
};
