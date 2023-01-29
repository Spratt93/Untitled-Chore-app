<template>
  <div v-if="user.error" class="container">
    <div class="alert alert-danger">
      <h6 class="alert-heading">❌ {{ user.error }}</h6>
    </div>
  </div>
  <div v-if="user.info" class="container">
    <div class="alert alert-info">
      <h6 class="alert-heading">💡 {{ user.info }}</h6>
    </div>
  </div>
</template>
<script setup>
import { useUserStore } from "../stores/user";

const user = useUserStore();
</script>
