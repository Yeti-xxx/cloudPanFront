<template>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import request from './axios/axios'
import Home from './components/Home.vue'
</script>

<style lang="less" scoped>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
