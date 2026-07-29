<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
</script>

<template>
  <div class="app-shell">
    <AppHeader />
    <div class="app-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.app-content {
  min-width: 0;
  min-height: 100vh;
  margin-left: 220px;
}

@media (max-width: 980px) {
  .app-content {
    margin-left: 0;
    padding-top: 64px;
  }
}
</style>
