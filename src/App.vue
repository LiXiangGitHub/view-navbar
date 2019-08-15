<template>
  <div id="navbar-view">
    <!--<router-link to="/app1">App1</router-link>-->
    <!--<router-link to="/app2">App2</router-link>-->
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: 'App'
    }
</script>

<style lang="less">
  .size{
    width: 100%;
    height: 100%;
  }
  html,body{
  .size;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }
  #app {
  .size;
  }
</style>