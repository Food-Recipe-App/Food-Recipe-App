import axios from "axios";

const API_URL = "http://192.168.25.104:5000/api/auth";

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Login failed";
  }
};

export const registerUser = async (username, email, password, phoneNumber) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
      phoneNumber,
      role_type: "User",
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Registration failed";
  }
};
