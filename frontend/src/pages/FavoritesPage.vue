<script setup>
import { useFavorites } from "../context/FavoriteContext"
import { RouterLink } from "vue-router"
import { Icon } from "@iconify/vue"
const { favorites, toggleFavorite } = useFavorites()
</script>

<template>
  <div class="p-6">
    <h1 class="text-3xl font-bold mb-6">My Favorites</h1>

    <p v-if="favorites.length === 0">
      No favorite products yet.
    </p>

    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      <div
        v-for="p in favorites"
        :key="p._id"
        class="border rounded-lg p-4 shadow relative flex flex-col"
      >
        <!-- Favorite Button -->
        <button
          @click="toggleFavorite(p)"
          class="absolute top-2 right-2 text-xl z-10 text-red-500"
        >
        <Icon icon="mdi:heart" class="text-red-500 text-xl" />
        </button>

        <!-- Product Link -->
        <RouterLink
          :to="`/product/${p._id}`"
          class="cursor-pointer"
        >
          <img
            :src="p.images[0]"
            :alt="p.name"
            class="h-48 w-full object-cover rounded"
          />

          <h2 class="text-lg font-semibold mt-2">
            {{ p.name }}
          </h2>

          <p class="text-gray-600">
            {{ p.brand }}
          </p>

          <p class="text-gray-900 font-bold">
            €{{ p.price }}
          </p>
        </RouterLink>
      </div>
    </div>
  </div>
</template>