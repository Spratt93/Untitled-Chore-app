import axios from "axios";
import { defineStore } from "pinia";
import { useUserStore } from "./user";
import { handleResponse } from "./util";

export const useChoreStore = defineStore("chores", () => {
  const user = useUserStore();

  async function getDefaultChores() {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/chores/default`, {
      validateStatus: () => true,
    });
    return handleResponse(res, 200);
  }

  async function getUserChores() {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/me/chores`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      validateStatus: () => true,
      withCredentials: false,
    });

    return handleResponse(res, 200);
  }

  async function createChore(name, expectedTime, difficulty, description, roomName, roomColour, roomIcon) {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE}/chores/`,
      {
        name: name,
        expected_time: expectedTime,
        difficulty: difficulty,
        description: description,
        public: true,
        room: {
          name: roomName,
          colour: roomColour,
          icon: roomIcon,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 201);
  }

  async function addChoresToHome(creator, homeName, chores) {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE}/${creator}/${homeName}/chores`,
      {
        chores: chores,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 200);
  }

  async function removeChoreFromHome(creator, homeName, choresToRemove) {
    const res = await axios.put(
      `${import.meta.env.VITE_API_BASE}/${creator}/${homeName}/chores/remove`,
      {
        chores: choresToRemove,
      },
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
        validateStatus: () => true,
        withCredentials: false,
      }
    );

    return handleResponse(res, 200);
  }

  async function getUsersAssignedChores() {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE}/me/timetable`, {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
      validateStatus: () => true,
      withCredentials: false,
    });

    return handleResponse(res, 200);
  }

  return {
    getDefaultChores,
    getUserChores,
    createChore,
    addChoresToHome,
    removeChoreFromHome,
    getUsersAssignedChores,
  };
});
