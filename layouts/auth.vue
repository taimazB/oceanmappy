<template>
  <v-app>
    <v-card>
      <app-sidebar />
      <v-main class="d-flex flex-row align-center panel">
        <nuxt />
      </v-main>
    </v-card>
  </v-app>
</template>

<script>
import AppSidebar from './Panel/Sidebar'
export default {
  components: {
    AppSidebar,
  },
}
</script>

<style scoped>
@import 'assets/css/custom';
.v-card {
  height: 100%;
}
</style>
