<template>
  <div>
    hi
  </div>
</template>

<script setup>
import { onBeforeMount } from 'vue';
import request from './axios/axios'
onBeforeMount(() => {
  request({
    url: '/test/hi',
    method: 'get'
  })
})
</script>

<style scoped></style>
