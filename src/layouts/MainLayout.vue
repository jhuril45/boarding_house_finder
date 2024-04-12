<template>
  <q-layout view="lHh Lpr lFf" container class="window-height">
    <Header />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Header from "./Header.vue";
</script>
