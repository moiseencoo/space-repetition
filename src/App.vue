<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/header/index.vue'
</script>

<template>
  <div class="app-wrapper">
    <AppHeader />
    <RouterView />
  </div>
</template>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100vh;
  background-color: var(--color-background-mute);
  color: var(--color-text);
}

.app-wrapper:before {
  content: '';
  position: absolute;
  background-color: rgba(0, 109, 240, 0.32);
  width: 35%;
  height: 50%;
  top: 0;
  left: 0;
  z-index: 0;
}

.app-wrapper:after {
  content: '';
  position: absolute;
  background-color: rgba(237, 139, 87, 0.8);
  width: 40%;
  height: 70%;
  bottom: 0;
  right: 0;
  z-index: 0;
}
</style>
