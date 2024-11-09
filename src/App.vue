<template>
  <div id="app" class="min-h-screen flex flex-col bg-cover bg-main-background bg-center">
    <NavBar />
    <div class="flex-1 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import NavBar from './components/NavBar.vue';

export default defineComponent({
  name: 'App',
  components: {
    NavBar
  }
});
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: auto;
}
</style>
