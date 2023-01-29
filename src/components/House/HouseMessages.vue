<template>
  <div class="scroll shadow" style="max-height: 400px; overflow-y: scroll">
    <form
      class="d-flex p-2"
      @submit.prevent="uploadPost"
      v-if="user.user && home.chosenHome && user.user.username === home.chosenHome.creator">
      <input
        class="form-control bg-dark text-white border-dark"
        style="border-radius: 10px 0 0 10px"
        type="text"
        v-model="newMessage"
        placeholder="Post a message" />
      <button :disabled="submitted" type="submit" class="btn btn-primary" style="border-radius: 0 10px 10px 0">
        <font-awesome-icon icon="fa-solid fa-paper-plane" />
      </button>
    </form>

    <div class="p-2 d-flex flex-column gap-2" style="width: 300px">
      <div v-if="!home.chosenHome || home.chosenHome.posts.length == 0" class="bg-dark p-2 rounded">
        <p class="mb-0">No messages to show</p>
      </div>

      <div v-else v-for="msg in home.chosenHome.posts" class="bg-dark p-2 rounded">
        <div class="d-flex align-items-center justify-content-center">
          <h6 class="mb-0">
            <strong> {{ home.chosenHome.creator }}</strong>
          </h6>
          <p class="ms-auto mb-0 text-muted">{{ new Date(msg.timestamp).toDateString() }}</p>
        </div>

        <p>
          {{ msg.content }}
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useHomeStore } from "../../stores/home";
import { useUserStore } from "../../stores/user";

const user = useUserStore();
const home = useHomeStore();

onMounted(() => user.getUserData());
const submitted = ref(false);
const newMessage = ref("");

async function uploadPost() {
  submitted.value = true;
  const res = await home.postMessage(newMessage.value);
  if (res) {
    home.chosenHome.posts = [res, ...home.chosenHome.posts];
  }
  submitted.value = false;
}
</script>
<style scoped>
.scroll::-webkit-scrollbar {
  width: 8px; /* width of the entire scrollbar */
}

.scroll::-webkit-scrollbar-track {
  background: #26282b; /* color of the tracking area */
}

.scroll::-webkit-scrollbar-thumb {
  background-color: #17191b; /* color of the scroll thumb */
  border-radius: 20px; /* roundness of the scroll thumb */
}
</style>
