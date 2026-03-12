<script setup>
import Navbar from "./components/Navbar.vue"
import { createAppContext } from "./context/AppContext";

createAppContext();
</script>

<template>
  <Navbar />

  <router-view />
</template>