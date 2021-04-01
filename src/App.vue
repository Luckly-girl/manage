<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width:100%;
  height:100%;
}
html, body, ul, li, p, h1, h2, h3, h4, h5, span, input {
  margin:0;
  padding:0;
}
html, body{
  width: 100%;
  height: 100%;
}
ul,ol,li { 
  list-style:none; 
}
h1,h2,h3,h4,h5,h6 {
  font-weight: normal;
}
img {
  border: none;
  font-size: 0;
}
a {
  color: #71777d;
  text-decoration: none;
}
a:hover {
  text-decoration: none;
}
ul,li {
  list-style-type: none;
}
body {
  margin: 0;
  padding: 0;
  border: 0;
  position: relative;
  min-width: 1400px;
  color: #666;
  font-family: "Microsoft YaHei", "YouYuan";
}
.floatL{
  float:left; 
}
.floatR{ 
  float:right; 
}
.clear{
  clear:both;
}
.blank32 {
  height: 32px;
}
.blank40 {
  height: 40px;
}

.mt-18 {
  margin-top: 18px
}
.mt-10 {
  margin-top: 10px
}
.mb-16 {
  margin-bottom: 16px
}

.pointer {
  cursor: pointer;
}


</style>
