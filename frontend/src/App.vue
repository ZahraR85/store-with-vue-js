<script setup>
import Navbar from "./components/Navbar.vue"

import { createAppContext } from "./context/AppContext"
import { createFavoritesContext } from "./context/FavoriteContext"

const appContext = createAppContext()

createFavoritesContext(appContext.isAuthenticated)
</script>

<template>
  <Navbar />
  <router-view />
</template>