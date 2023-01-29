<template>
  <div class="container">
    <!-- Home choice and home options -->
    <div class="py-4 px-5 d-flex align-items-center">
      <!-- Home selection -->
      <div class="dropdown">
        <button
          class="btn btn-dark dropdown-toggle d-flex align-items-center gap-2"
          style="font-size: 1.5rem"
          type="button"
          id="dropdownMenuButton1"
          data-bs-toggle="dropdown"
          aria-expanded="false">
          <font-awesome-icon icon="fa-solid fa-house" />
          <strong> {{ home.chosenHome ? `${home.chosenHome.creator}/${home.chosenHome.name}` : "loading..." }}</strong>
        </button>
        <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
          <li
            v-if="home.userHomes"
            v-for="h in home.userHomes.filter((h) => h !== home.chosenHome)"
            @click="
              () => {
                home.chosenHome = h;
                router.replace({
                  path: route.path,
                  query: { home: `${h.creator}/${h.name}` },
                });
              }
            ">
            <a class="dropdown-item d-flex align-items-center gap-2" style="font-size: 1rem" href="#">
              <font-awesome-icon icon="fa-solid fa-house" />
              <strong>{{ h.creator }}/{{ h.name }}</strong></a
            >
            <hr />
          </li>
        </ul>
      </div>

      <div style="margin-left: auto" class="d-flex align-items-center gap-3">
        <!-- Refresh data button -->
        <button
          class="bg-transparent mt-1"
          :class="refreshing && 'spinner'"
          style="border: none"
          @click="refresh"
          :disabled="refreshing">
          <font-awesome-icon
            icon="fa-solid fa-refresh"
            style="font-size: 2rem"
            class="hover"
            :class="refreshing ? 'text-success' : 'text-muted'" />
        </button>

        <div class="dropdown">
          <button
            class="bg-transparent text-white d-flex align-items-center gap-2"
            style="border: none; font-size: 1.7rem"
            :style="refreshing && 'opacity: 0.6'"
            type="button"
            id="dropdownMenuButton1"
            :disabled="refreshing"
            data-bs-toggle="dropdown"
            aria-expanded="false">
            <font-awesome-icon icon="fa-solid fa-message" />
          </button>
          <HouseMessages class="dropdown-menu dropdown-menu-dark" />
        </div>

        <!-- Home options -->
        <div class="dropdown">
          <button
            class="bg-transparent text-white d-flex align-items-center gap-2"
            style="border: none; font-size: 2rem"
            type="button"
            id="dropdownMenuButton1"
            data-bs-toggle="dropdown"
            aria-expanded="false">
            <font-awesome-icon icon="fa-solid fa-bars" />
          </button>
          <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
            <button
              class="dropdown-item"
              data-bs-toggle="modal"
              data-bs-target="#invite-link"
              :disabled="!home.chosenHome">
              🫂 Invite others
            </button>
            <button class="dropdown-item" data-bs-toggle="modal" data-bs-target="#join-home">🏡 Join home</button>
            <router-link to="/home/create" class="dropdown-item">🆕 Create home</router-link>

            <div v-if="home.chosenHome">
              <hr />
              <div v-if="home.chosenHome.creator !== user.user.username">
                <button class="dropdown-item" @click="leaveHome" :disabled="refreshing">⚠️ Leave home</button>
              </div>
              <div v-else>
                <button class="dropdown-item" @click="regenerateTimetable" :disabled="refreshing">
                  ♻️ Regenerate timetable
                </button>
                <button class="dropdown-item" @click="deleteHome" :disabled="refreshing">🗑️ Delete home</button>
              </div>
            </div>
          </ul>
        </div>
      </div>
    </div>

    <!-- Page content -->
    <div class="container-fluid px-5 pb-4">
      <div class="row">
        <HouseMembers class="col-4" :residents="home.homeResidents" />

        <HouseChoreList class="col-8" :timetable="home.homeTimetable" :completeChore="complete" />
      </div>
    </div>

    <div
      v-if="home.chosenHome"
      class="modal fade"
      id="invite-link"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" style="width: fit-content; min-width: 60%">
        <HouseInvite :creator="home.chosenHome.creator" :homeName="home.chosenHome.name" />
      </div>
    </div>

    <div class="modal fade" id="join-home" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" style="width: 500px">
        <JoinHouse />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from "vue";
import HouseMembers from "../../components/House/HouseMembers.vue";
import HouseChoreList from "../../components/House/HouseChoreList.vue";
import JoinHouse from "../../components/House/JoinHouse.vue";
import { useHomeStore } from "../../stores/home";
import { useUserStore } from "../../stores/user";
import HouseInvite from "../../components/House/HouseInvite.vue";
import { useRoute, useRouter } from "vue-router";
import HouseMessages from "../../components/House/HouseMessages.vue";

const home = useHomeStore();
const user = useUserStore();

watch(home.userHomes, () => {
  if (userHomes.value === null || userHomes.value.length === 0) return;

  const selected = userHomes.value.filter((h) => `${h.creator}/${h.name}` === route.query.home);
  chosenHome.value = selected.length === 0 ? userHomes.value[0] : selected[0];
});

const loadingRequest = ref(false);
const refreshing = computed(() => home.refreshingHomeData.valueOf() || loadingRequest.value);

const route = useRoute();
const router = useRouter();

async function complete(id) {
  loadingRequest.value = true;
  const res = await home.completeChore(id);
  if (res) {
    home.refresh();
  }
  loadingRequest.value = false;
}

async function leaveHome() {
  loadingRequest.value = true;
  await home.leaveHome();
  await home.refresh();
  loadingRequest.value = false;
}

async function deleteHome() {
  loadingRequest.value = true;
  await home.deleteHome();
  await home.refresh();
  loadingRequest.value = false;
}

async function regenerateTimetable() {
  home.homeResidents = null;
  home.homeTimetable = null;
  home.getHomeResidents().then((data) => (home.homeResidents = data));
  home.getTimetable(true).then((data) => (home.homeTimetable = data));
}

onMounted(() => home.refresh());
</script>
<style scoped>
.spinner {
  animation-name: spin;
  animation-duration: 1500ms;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hover:hover {
  opacity: 0.75;
  transition: 150ms;
}
</style>
