import { ref, onMounted } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import { handleResponse } from "./util";
import { useCookies } from "vue3-cookies";
import { useRouter } from "vue-router";

const { cookies } = useCookies();

export const useUserStore = defineStore("users", () => {
  const user = ref(null);
  const accessToken = ref(null);

  const error = ref(null);
  const info = ref(null);

  const router = useRouter();

  onMounted(() => {
    const token = cookies.get("access_token");
    if (token === null) return;

    accessToken.value = token;
  });

  async function getUserData() {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/me`, {
      headers: { Authorization: `Bearer ${accessToken.value}` },
      validateStatus: () => true,
    });

    if (!handleResponse(res, 200)) return null;

    user.value = res.data;
    return res.data;
  }

  async function login(username, password) {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE}/login`,
      `username=${username}&password=${password}`,
      { validateStatus: () => true, withCredentials: false }
    );

    if (!handleResponse(res, 201)) return null;

    accessToken.value = res.data.access_token;
    user.value = res.data.user;
    return true;
  }

  function logout() {
    cookies.remove("access_token");
    accessToken.value = null;
    router.push("/");
    info.value = "Successfully logged out!";
  }

  async function register(username, password, firstName, surname, email) {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE}/register`,
      {
        username: username,
        password: password,
        first_name: firstName,
        surname: surname,
        email: email,
      },
      { validateStatus: () => true, withCredentials: false }
    );

    console.log(res);

    if (res.status !== 201) return false;

    accessToken.value = res.data.access_token;
    return true;
  }

  async function update(currentPassword, password, firstName, surname, email) {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE}/me`,
      {
        currentPassword: currentPassword,
        password: password,
        first_name: firstName,
        surname: surname,
        email: email,
      },
      { headers: { Authorization: `Bearer ${accessToken.value}` }, validateStatus: () => true, withCredentials: false }
    );

    return handleResponse(res, 200);
  }

  async function deleteUser() {
    const res = await axios.delete(`${import.meta.env.VITE_API_BASE}/me/delete`, {
      headers: { Authorization: `Bearer ${accessToken.value}` },
      validateStatus: () => true,
      withCredentials: false,
    });

    const accepted = handleResponse(res, 204);
    if (accepted) {
      accessToken.value = null;
      user.value = null;
    }

    return accepted;
  }

  return { user, login, logout, accessToken, register, error, info, getUserData, update, deleteUser };
});
