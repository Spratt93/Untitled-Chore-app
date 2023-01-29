<script setup>
import { onMounted, ref, computed } from "vue";
import AssignedList from "../../components/AssignedList.vue";
import ChoreCard from "../../components/ChoreCard.vue";
import { useChoreStore } from "../../stores/chores";
import { useHomeStore } from "../../stores/home";

const chores = useChoreStore();

const assignedChores = ref(null);
const loadingChores = ref(null);

const hasChoresToDo = computed(() => {
  if (loadingChores) return false;
  for (const [homeName, taskList] of Object.entries(assignedChores.value.tasks)) {
    if (taskList.length > 0) return true;
  }

  return false;
});

onMounted(async () => {
  loadingChores.value = true;
  assignedChores.value = await chores.getUsersAssignedChores();
  if (assignedChores.value) {
    for (const [homeName, taskList] of Object.entries(assignedChores.value.tasks)) {
      const tasks = taskList.map((task) => {
        task.chore = assignedChores.value.chores.filter((c) => c.id === task.chore_id)[0];
        return task;
      });

      assignedChores.value.tasks[homeName] = tasks;
    }
  }

  loadingChores.value = false;
});
</script>

<template>
  <div>
    <div class="container p-4" style="overflow-y: hidden">
      <div class="jumbotron bg-dark p-4 mb-4 shadow rounded">
        <h1 class="display-2 text-primary font-weight-bold">Your Chores</h1>
        <p class="lead">Listed below are the chores assigned to you!</p>
      </div>
    </div>

    <div v-if="!loadingChores">
      <div v-if="hasChoresToDo" v-for="(house, index) in Object.entries(assignedChores.tasks)" :key="index">
        <ChoreCard
          v-for="task in house[1]"
          :house="house[0]"
          :name="task.chore.name"
          :room="task.chore.room.name"
          :color="task.chore.room.colour"
          :icon="task.chore.room.icon"
          :expectedTime="task.chore.expected_time"
          :difficulty="task.chore.difficulty" />
      </div>

      <ChoreCard v-else name="No chores left to do" color="green" icon="fa-solid fa-square-check" room="good job!" />
    </div>

    <div v-else>
      <h1 class="display-2 info">Loading....</h1>
    </div>
  </div>
</template>

<style scoped>
h1.info {
  text-align: center;
}
</style>
