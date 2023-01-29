<template>
  <div class="container p-4" style="overflow-y: hidden">
    <div class="jumbotron bg-dark p-4 mb-4 shadow rounded">
      <h1 class="display-2 text-primary font-weight-bold">Create a new Chore</h1>
      <p class="lead">
        Build your chore and use it in your homes to boost the productivity of you and your housemates!
      </p>
    </div>

    <form @submit.prevent="createChore">
      <div class="row">
        <div class="col-6">
          <div class="form-group col">
            <label for="" class="h5 text-primary">The name of your chore:</label>
            <input type="text" class="form-control mb-2" placeholder="your chore" v-model="choreName" />
          </div>

          <div class="row form-group">
            <div class="col-5">
              <label for="" class="h5 text-primary">How long does it take:</label>

              <div class="d-flex gap-2 mt-1">
                <input
                  type="number"
                  style="width: 50px; -webkit-appearance: none"
                  class="form-control text-end"
                  v-model="time" />
                <h6 class="mb-1 align-self-end">minutes</h6>
              </div>
            </div>

            <div class="col-7">
              <label for="" class="h5 text-primary">How difficult is it:</label>

              <div class="d-flex align-items-center gap-2">
                <p
                  @click="difficulty = i"
                  class="rounded p-1 mb-0 text-center"
                  :class="difficulty === i && 'bg-dark'"
                  style="font-size: 1.5rem; line-height: 110%"
                  role="button"
                  v-for="(diff, i) in ['⬜', '🟩', '🟦', '🟪', '🟨']"
                  :key="diff">
                  {{ diff }}
                  <br />
                  {{ i + 1 }}
                </p>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="" class="h5 text-primary">Which room is it in:</label>

            <div class="row">
              <div class="col-4">
                <label for="" class="h6">Name:</label>
                <input type="text" class="form-control" placeholder="Give your room a name" v-model="roomName" />
              </div>

              <div class="col-3">
                <label for="" class="h6">Colour:</label><br />
                <div class="d-flex">
                  <div class="bg-dark px-2 py-1 rounded">
                    <color-picker format="hex" v-model:pureColor="roomColour" />
                    <strong class="text-white">{{ roomColour }}</strong>
                  </div>
                </div>
              </div>

              <div class="col-1">
                <label for="" class="h6">Icon</label>
                <div>
                  <font-awesome-icon style="font-size: 1.2rem" class="bg-dark p-2 rounded" icon="fa-solid fa-house" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-6" style="border-left: solid 1px gray">
          <label for="" class="h5 text-primary">Choose some homes to add it to:</label>

          <div
            class="d-flex bg-dark gap-2 align-items-center p-2 my-2 rounded shadow"
            v-if="user.user && home.userHomes"
            v-for="h in home.userHomes.filter((h) => h.creator === user.user.username)">
            <input
              @click="() => toggleHouseSelected(h.id)"
              style="width: 2rem; height: 2rem"
              type="checkbox"
              name=""
              id=""
              class="form-check-input bg-secondary" />
            <h6 class="mb-0 text-white" style="font-size: 1.4rem">{{ h.name }}</h6>

            <div class="text-primary ms-auto d-flex gap-2 align-items-center" style="font-size: 1.35rem">
              <font-awesome-icon icon="fa-solid fa-user" />
              <p class="mb-0">{{ h.residents.length }}</p>
            </div>
          </div>

          <div v-else class="d-flex bg-dark gap-2 align-items-center p-2 m-2 rounded shadow">Loading homes...</div>
        </div>
      </div>

      <button :disabled="loading" type="submit" class="btn btn-success btn-lg mt-2" style="width: fit-content">
        Create
      </button>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useChoreStore } from "../../stores/chores";
import { useHomeStore } from "../../stores/home";
import { useUserStore } from "../../stores/user";

const home = useHomeStore();
const user = useUserStore();
const chores = useChoreStore();

onMounted(async () => {
  user.getUserData();
  home.userHomes = await home.getHomes();
});

function toggleHouseSelected(id) {
  if (selectedHomes.value.includes(id)) {
    selectedHomes.value = selectedHomes.value.filter((h) => h === id);
  } else {
    selectedHomes.value.push(id);
  }
}

const choreName = ref("");
const difficulty = ref(0);
const time = ref(15);

const selectedHomes = ref([]);

const roomName = ref("");
const roomColour = ref("#ff00f0");
const roomIcon = ref("fa-solid fa-house");

const loading = ref(false);

async function createChore() {
  loading.value = true;
  const res = await chores.createChore(
    choreName.value,
    time.value,
    difficulty.value,
    "",
    roomName.value,
    roomColour.value,
    roomIcon.value
  );

  if (res) {
    selectedHomes.value.forEach(async (h) => {
      const selectedHome = home.userHomes.filter((h2) => h === h2.id)[0];

      await chores.addChoresToHome(selectedHome.creator, selectedHome.name, [res.id]);
    });
  }

  loading.value = false;
  user.info = "Chore created";
}
</script>

<style scoped>
input[type="text"] {
  max-width: 600px;
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
