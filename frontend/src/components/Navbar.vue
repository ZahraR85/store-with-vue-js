<script setup>
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import DesktopNavbar from "./DesktopNavbar.vue"
import MobileNavbar from "./MobileNavbar.vue"
import { useAppContext } from "../context/AppContext";

const { state,  signOut: appSignOut, setAuth } = useAppContext();

console.log(state.isAuthenticated);
const router = useRouter()

const menuOpen = ref(false)
const openGender = ref(null)
const activeCategory = ref(null)
const mobileGender = ref(null)
const mobileCategory = ref(null)
const categories = ref([])

const searchOpen = ref(false)
const searchTerm = ref("")
const suggestions = ref([])

const genders = ["women", "men", "kids", "home"]

const cartCount = ref(0)
const favoriteCount = ref(0)

const isAuthenticated = ref(false)
const role = ref(null)

onMounted(async () => {
  try {
    const res = await fetch("http://localhost:3001/categories")
    categories.value = await res.json()
  } catch (err) {
    console.error(err)
  }
})

const handleSearch = async (query) => {
  searchTerm.value = query

  if (!query.trim()) {
    suggestions.value = []
    return
  }

  try {
    const res = await fetch(
      `http://localhost:3001/products/search?name=${encodeURIComponent(query)}`
    )

    if (res.ok) {
      suggestions.value = await res.json()
    }
  } catch (err) {
    console.error(err)
  }
}

const handleSelect = (name) => {
  searchOpen.value = false
  searchTerm.value = ""
  suggestions.value = []

  router.push(`/?search=${encodeURIComponent(name)}`)
}

const signOut = () => {
  isAuthenticated.value = false
}
</script>

<template>
  <nav class="sticky top-0 z-50 bg-BgKhaki border-b shadow-md">

    <!-- Top bar -->
    <div class="flex items-center justify-between px-4 py-2 md:px-8">

      <button class="lg:hidden text-BgFont" @click="menuOpen = true">
        ☰
      </button>

      <router-link to="/" class="text-BgFont">
        🏠
      </router-link>

      <router-link to="/" class="hidden lg:block">
        <img src="../images/Logo.png" class="h-16"/>
      </router-link>

      <ul class="flex items-center gap-6 text-BgFont font-bold">

        <li>
          <button @click="searchOpen = true">🔍</button>
        </li>

        <li>
          <router-link to="/favorites" class="relative">
            ❤️
            <span
              v-if="favoriteCount > 0"
              class="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 rounded-full"
            >
              {{ favoriteCount }}
            </span>
          </router-link>
        </li>

        <li>
          <router-link to="/ShoppingCart" class="relative">
            🛒
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-3 bg-red-600 text-white text-xs px-2 rounded-full"
            >
              {{ cartCount }}
            </span>
          </router-link>
        </li>

        <li v-if="isAuthenticated">
          <button @click="signOut">
            Logout
          </button>
        </li>

        <li v-else>
          <router-link to="/signin">
            👤
          </router-link>
        </li>

      </ul>

    </div>

    <!-- Search Overlay -->

    <div
      v-if="searchOpen"
      class="fixed top-0 right-0 h-full w-full md:w-1/3 bg-white z-50 p-6"
    >

      <div class="flex items-center border-b pb-2">

        <input
          autofocus
          class="flex-1 outline-none"
          placeholder="Search products..."
          v-model="searchTerm"
          @input="handleSearch($event.target.value)"
        />

        <button @click="searchOpen = false">
          ✖
        </button>

      </div>

      <ul class="mt-4">

        <li
          v-for="p in suggestions"
          :key="p._id"
          class="p-2 hover:bg-gray-100 cursor-pointer"
          @click="handleSelect(p.name)"
        >
          {{ p.name }}
        </li>

      </ul>

    </div>

<DesktopNavbar
  :genders="genders"
  :openGender="openGender"
  :categories="categories"
  :activeCategory="activeCategory"
  :isAuthenticated="isAuthenticated"
  :role="role"
  @setOpenGender="openGender = $event"
  @setActiveCategory="activeCategory = $event"
/>

    <MobileNavbar
      :menuOpen="menuOpen"
      :setMenuOpen="(v) => menuOpen = v"
      :genders="genders"
      :categories="categories"
      :mobileGender="mobileGender"
      :setMobileGender="(g) => mobileGender = g"
      :mobileCategory="mobileCategory"
      :setMobileCategory="(c) => mobileCategory = c"
      :isAuthenticated="isAuthenticated"
      :role="role"
    />

  </nav>
</template>