<template>
  <v-app>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
  
</template>

<script setup>
  import {  RouterView } from 'vue-router'
  import { useWsDataStore } from '@/stores/wsData'

  const wsDataStore = useWsDataStore()

  wsDataStore.connect()

</script>

<style scoped></style>
