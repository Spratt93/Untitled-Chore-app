<script setup>
import { ref } from "vue";

const password = ref("");
const props = defineProps({
  deleteAccount: {
    type: Function,
    required: true,
  },
});
</script>

<template>
  <form @submit.prevent="" class="d-flex flex-column align-items-center">
    <h1 class="display-6">Delete Account</h1>

    <div class="form-floating mb-3">
      <input
        v-model="password"
        type="password"
        class="form-control"
        id="currentPassword"
        placeholder="Current Password" />
      <label for="currentPassword">Current Password</label>
    </div>

    <!-- Button trigger modal -->
    <button type="submit" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Delete Account
    </button>
  </form>
  <!-- Modal -->
  <form
    @submit.prevent="() => deleteAccount(password)"
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title" id="exampleModalLabel">Warning!</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">Once you delete your account you can never get it back!</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
          <button type="submit" class="btn btn-danger">Delete</button>
        </div>
      </div>
    </div>
  </form>
</template>

<style scoped>
.display-6 {
  color: white;
  margin-bottom: 40px;
}

div.modal-body {
  color: black;
}

.modal-title {
  color: rgb(0, 0, 0);
  font-size: 32px;
}

.mb-3 {
  color: black;
  width: 250px;
}
</style>
