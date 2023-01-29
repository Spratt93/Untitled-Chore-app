<script setup></script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand d-flex align-items-center">
        <img src="@/assets/logo.svg" alt="Image can't be displayed" width="40" height="40" />
        <a>Untitled Chore App</a>
      </router-link>

      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul class="navbar-nav me-auto">
          <li class="nav-item dropdown">
            <div class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              🏡 Home
            </div>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><router-link to="/home/dashboard" class="dropdown-item">🗓️ Dashboard</router-link></li>
              <li><router-link to="/home/create" class="dropdown-item">➕ Create</router-link></li>
            </ul>
          </li>

          <li class="nav-item dropdown">
            <div class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              📃 Chores
            </div>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><router-link to="/chores" class="dropdown-item">🧑 Your chores</router-link></li>
              <li><router-link to="/chores/create" class="dropdown-item">➕ Create</router-link></li>
            </ul>
          </li>
          <li class="nav-item">
            <router-link to="/help" class="nav-link">❓ Help</router-link>
          </li>
        </ul>
        <router-link to="/user" class="nav-link"
          ><img src="@/assets/userIcon.png" alt="Image can't be displayed" width="40" height="40"
        /></router-link>
      </div>
    </div>
  </nav>
  <div class="space"></div>
</template>

<style scoped>
/* yes i know it is jank */
div.space {
  padding-top: 5em;
}
.router-link-exact-active {
  color: white;
}

li.nav-item {
  margin-left: 1em;
}

img {
  margin-right: 0.5em;
  float: right;
}

h5 {
  margin: 0;
}
</style>
