import axios from "axios";
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { handleResponse } from "./util";
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

export const useHomeStore = defineStore("homes", () => {
  const user = useUserStore();
  const route = useRoute();

  //
  const userHomes = ref(null);

  const chosenHome = ref(null);
  const homeResidents = ref(null);
  const homeTimetable = ref(null);

  const refreshingHomeData = computed(() => !(userHomes.value && homeResidents.value && homeTimetable.value));

  //
  watch(chosenHome, async () => {
    homeResidents.value = null;
    homeTimetable.value = null;
    if (chosenHome.value === null) return;

    getHomeResidents().then((data) => (homeResidents.value = data));
    getTimetable().then((data) => (homeTimetable.value = data));
  });

  async function refresh() {
    if (user.accessToken === null) return;
    userHomes.value = [];
    homeResidents.value = null;
    homeTimetable.value = null;
    userHomes.value = await getHomes();

    if (userHomes.value.length === 0) {
      user.info = "It appears you aren't in any homes. Boost your productivity today by creating or joining a house";
      return;
    }

    const selected = userHomes.value.filter((h) => `${h.creator}/${h.name}` === route.query.home);
    chosenHome.value = selected.length === 0 ? userHomes.value[0] : selected[0];
  }

  // api requests

  async function getHome(creator, homeName) {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/${creator}/${homeName}`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
      validateStatus: () => true,
      withCredentials: false,
    });

    return handleResponse(res, 200);
  }

  async function getHomes() {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/homes/`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
      validateStatus: () => true,
      withCredentials: false,
    });

    return handleResponse(res, 200);
  }

  async function createHome(homeName, chores) {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE}/homes`,
      { name: homeName, chores: chores },
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        withCredentials: false,
      }
    );

    return handleResponse(res, 201);
  }

  async function joinHome(creator, homeName, inviteId) {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE}/${creator}/${homeName}/join?invite_id=${inviteId}`,
      null,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 200);
  }

  async function createInviteLink(creator, homeName) {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE}/${creator}/${homeName}/invite`, null, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
      validateStatus: () => true,
      withCredentials: false,
    });

    return handleResponse(res, 201);
  }

  async function getHomesChores() {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE}/${chosenHome.value.creator}/${chosenHome.value.name}/chores`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 200);
  }

  async function getHomeResidents() {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE}/${chosenHome.value.creator}/${chosenHome.value.name}/residents`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 200);
  }

  async function getTimetable(regenerate = false) {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE}/${chosenHome.value.creator}/${
        chosenHome.value.name
      }/timetable?regenerate=${regenerate}`,
      null,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 200);
  }

  async function completeChore(choreId) {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE}/${chosenHome.value.creator}/${
        chosenHome.value.name
      }/complete?chore_id=${choreId}`,
      null,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 200);
  }

  async function leaveHome() {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_BASE}/${chosenHome.value.creator}/${chosenHome.value.name}/leave`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 204);
  }

  async function deleteHome() {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_BASE}/${chosenHome.value.creator}/${chosenHome.value.name}/`,
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 204);
  }

  async function postMessage(message) {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE}/${chosenHome.value.creator}/${chosenHome.value.name}/post`,
      { content: message },
      {
        headers: { Authorization: `Bearer ${user.accessToken}` },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 201);
  }

  return {
    userHomes,
    chosenHome,
    homeResidents,
    homeTimetable,
    refreshingHomeData,
    refresh,
    getHome,
    getHomes,
    getHomesChores,
    getHomeResidents,
    createHome,
    createInviteLink,
    joinHome,
    getTimetable,
    completeChore,
    leaveHome,
    deleteHome,
    postMessage,
  };
});
