<template>
  <div class="_main">
    <app-navbar></app-navbar>
    <div class="container">
      <app-header></app-header>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import AppHeader from "./appHeader";
import AppNavbar from "./appNavbar";
import AppMain from "./appMain";

export default {
  name: "Layout",
  components: {
    AppHeader,
    AppNavbar,
    AppMain
  }
};
</script>

<style scoped>

._main {
  height: 100%;
  display: flex;
  display: -webkit-flex; 
}

.container {
  flex: 1;
  overflow: auto;
  position: relative;
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
}
</style>

