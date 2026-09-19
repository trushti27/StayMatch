import api from "./api";

const persist = (responseData) => {
  const token = responseData?.data?.token || responseData?.token;
  const user = responseData?.data?.user || responseData?.user;

  if (token) {
    localStorage.setItem("staymatch_token", token);
  }
  if (user) {
    localStorage.setItem("staymatch_user", JSON.stringify(user));
  }
};

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  persist(response.data);
  return response.data;
};

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  persist(response.data);
  return response.data;
};

const logout = () => {
  localStorage.removeItem("staymatch_token");
  localStorage.removeItem("staymatch_user");
};

const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("staymatch_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getToken = () => localStorage.getItem("staymatch_token");

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getToken,
};

export default authService;
