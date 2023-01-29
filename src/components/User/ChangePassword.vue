<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "../../stores/user";

const user = useUserStore();

const old = ref("");

const p1 = ref("");
const p2 = ref("");

const match = computed(() => p1.value === p2.value);

async function changePassword() {
  if (p1.value !== p2.value) {
    user.error = "passwords do not match";
    return;
  }

  const res = await user.update(old.value, p1.value, null, null, null);
  if (res) user.info = "password changed";
}
</script>

<template>
  <form @submit.prevent="changePassword" class="d-flex flex-column align-items-center">
    <h1 class="display-6">Change Password</h1>
    <div class="form-floating mb-3">
      <input type="password" class="form-control" id="currentPassword" placeholder="Current Password" v-model="old" />
      <label for="currentPassword">Current Password</label>
    </div>
    <div class="form-floating mb-3">
      <input type="password" class="form-control" id="password" placeholder="New Password" v-model="p1" />
      <label for="password">New Password</label>
    </div>
    <div class="form-floating mb-3">
      <input type="password" class="form-control" id="password" placeholder="Confirm New Password" v-model="p2" />
      <label for="password">Confirm New Password</label>
    </div>

    <p v-if="!match" class="text-danger">❌ passwords do not match</p>
    <p v-else class="text-success">✅ passwords match</p>
    <button type="submit" class="btn btn-primary" :disabled="!match">Save</button>
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
