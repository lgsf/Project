<template>
  <div class="Navbar">
    <nav class="nav-extended nav-wrapper indigo darken-2">
      <Sidenav />
      <div class="nav-content">
        <router-link to>
          <a class="nav-title">Project Zero</a>
        </router-link>
        <ul id="nav-list" class="right hide-on-med-and-down">
          <li>
            <router-link :to="{ name: 'Home' }">Home</router-link>
          </li>
          <li>
            <router-link :to="{ name: 'About' }">About</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import Sidenav from "@/components/Sidenav.vue";

export default {
  name: "Navbar",
  components: {
    Sidenav
  },
  data() {
    return {};
  }
};
</script>

<style>
#nav-list {
  margin-right: 60px;
  padding: 39px;
}
.nav-title {
  margin-left: 60px;
}
</style>