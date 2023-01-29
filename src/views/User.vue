<script setup>
import ChangeEmail from "../components/User/ChangeEmail.vue";
import ChangePassword from "../components/User/ChangePassword.vue";
import DeleteAccount from "../components/User/DeleteAccount.vue";
import AddTimetable from "../components/AddTimetable.vue";
import { useUserStore } from "../stores/user";
import { onMounted } from "vue";

const user = useUserStore();
onMounted(async () => !user.user && user.getUserData());

async function deleteAccount(password) {
  if (password.length === 0) {
    user.error = "Invalid password";
    return;
  }

  const correctPassword = await user.login(user.user.username, password);
  if (correctPassword) {
    const res = await user.deleteUser();
    if (res) {
      // router.push("/");
      user.error = "Account deleted";
    }
  }
}
</script>

<template>
  <div class="d-flex align-items-center justify-content-center gap-4 userNav">
    <!-- OPTIONS -->
    <div
      class="nav flex-column nav-pills me-3 bg-dark py-3 px-4 rounded shadow justify-self-start"
      id="v-pills-tab"
      role="tablist"
      aria-orientation="vertical">
      <p class="display-6 navHeader text-white">User Settings</p>
      <hr />
      <button
        class="nav-link active"
        id="v-pills-changePassword-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-changePassword"
        type="button"
        role="tab"
        aria-controls="v-pills-changePassword"
        aria-selected="false">
        Change Password
      </button>
      <button
        class="nav-link"
        id="v-pills-changeEmail-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-changeEmail"
        type="button"
        role="tab"
        aria-controls="v-pills-changeEmail"
        aria-selected="true">
        Change Email
      </button>
      <button
        class="nav-link"
        id="v-pills-deleteAccount-tab"
        data-bs-toggle="pill"
        data-bs-target="#v-pills-deleteAccount"
        type="button"
        role="tab"
        aria-controls="v-pills-deleteAccount"
        aria-selected="false">
        Delete Account
      </button>
      <hr />
      <button @click="user.logout" class="btn btn-danger">Logout</button>
    </div>

    <!-- CONTENT -->
    <div class="tab-content" id="v-pills-tabContent">
      <div
        class="tab-pane fade show active"
        id="v-pills-changePassword"
        role="tabpanel"
        aria-labelledby="v-pills-changePassword-tab"
        tabindex="0">
        <ChangePassword />
      </div>
      <div
        class="tab-pane fade"
        id="v-pills-changeEmail"
        role="tabpanel"
        aria-labelledby="v-pills-changeEmail-tab"
        tabindex="1">
        <ChangeEmail />
      </div>
      <div
        class="tab-pane fade"
        id="v-pills-deleteAccount"
        role="tabpanel"
        aria-labelledby="v-pills-deleteAccount-tab"
        tabindex="2">
        <DeleteAccount deleteAccount="deleteAccount" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.nav-link {
  font-size: 16px;
  color: rgb(209, 209, 209);
}
</style>
