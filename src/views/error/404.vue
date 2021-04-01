<template>
  <div class="login">
    <img src="@/assets/images/404/404.jpg" alt="">
  </div>
</template>

<script>
import { login } from "@/api/login";
import { type } from "os";
import crypto from 'crypto'
export default {
  data() {
    return {
    }
  },
  created(){
  },
  methods: {
    toHome() {
      this.$router.replace('home')
    }
  }
};
</script>
<style scoped>
  .login{
    width: 100%;
    height: 100%;
    position: relative;
  }
  .login img{
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%, -50%);
    width: 550px;
  }
</style>
