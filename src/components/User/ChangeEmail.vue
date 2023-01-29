<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../../stores/user";

const email = ref("");
const email2 = ref("");
const password = ref("");
const user = useUserStore();

const dontMatch = computed(() => email.value !== email2.value);

async function changeEmail() {
  if (email.value !== email2.value) {
    user.error = "Emails do not match";
    return;
  }

  const res = await user.update(password.value, null, null, null, email.value);
  if (res) user.info = "email changed";
}
</script>

<template>
  <form @submit.prevent="changeEmail" class="d-flex flex-column align-items-center">
    <h1 class="display-6">Change Email</h1>
    <div class="form-floating mb-3">
      <input type="email" class="form-control" id="newEmail" placeholder="New Email" v-model="email" />
      <label for="newEmail">New Email</label>
    </div>
    <div class="form-floating mb-3">
      <input type="email" class="form-control" id="newEmail" placeholder="New Email" v-model="email2" />
      <label for="newEmail">Confirm Email</label>
    </div>

    <p v-if="dontMatch" class="text-danger">❌ emails do not match</p>
    <p v-else class="text-success">✅ emails match</p>

    <div class="form-floating mb-3">
      <input type="password" class="form-control" id="newEmail" placeholder="New Email" v-model="password" />
      <label for="newEmail">Password</label>
    </div>

    <button type="submit" class="btn btn-primary">Save</button>
  </form>
</template>

<style scoped>
.display-6 {
  color: white;
  margin-bottom: 40px;
}

.btn {
  width: 100px;
}

.mb-3 {
  color: black;
  width: 250px;
}
</style>
