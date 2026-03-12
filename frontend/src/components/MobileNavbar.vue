<script setup>
import { ref } from "vue"

const props = defineProps({
  menuOpen: Boolean,
  setMenuOpen: Function,
  categories: Array,
  genders: Array,
  isAuthenticated: Boolean,
  role: String
})

const mobileGender = ref(null)
const mobileCategory = ref(null)

const goBack = () => {
  if (mobileCategory.value) {
    mobileCategory.value = null
  } else {
    mobileGender.value = null
  }
}

const closeMenu = () => {
  props.setMenuOpen(false)
  mobileGender.value = null
  mobileCategory.value = null
}
</script>

<template>

<div v-if="menuOpen" class="fixed inset-0 z-50 flex">

  <!-- Left panel -->

  <div class="w-[80%] max-w-sm bg-white h-full p-4 overflow-y-auto">

    <!-- Header -->

    <div class="flex items-center gap-3 mb-4">

      <button v-if="mobileGender || mobileCategory" @click="goBack">
        ←
      </button>

      <h2 class="font-bold capitalize">
        {{ mobileCategory?.name || mobileGender || "Menu" }}
      </h2>

    </div>


    <!-- Gender selection -->

    <ul v-if="!mobileGender" class="space-y-3">

      <li
        v-for="g in genders"
        :key="g"
        class="flex justify-between py-2 cursor-pointer hover:bg-gray-100 px-2"
        @click="mobileGender = g"
      >

        {{ g }}

        <span>›</span>

      </li>

    </ul>


    <!-- Category selection -->

    <ul
      v-if="mobileGender && !mobileCategory"
      class="space-y-3"
    >

      <li
        v-for="cat in categories.filter(c => c.gender === mobileGender)"
        :key="cat._id"
        class="flex justify-between py-2 cursor-pointer hover:bg-gray-100 px-2"
        @click="mobileCategory = cat"
      >

        {{ cat.name }}

        <span>›</span>

      </li>

    </ul>


    <!-- Subcategories -->

    <ul v-if="mobileCategory" class="space-y-3">

      <li
        v-for="(sub, i) in mobileCategory.subcategories"
        :key="i"
      >

        <router-link
          :to="`/products/${mobileGender}/${mobileCategory._id}/${encodeURIComponent(sub.toLowerCase())}`"
          class="block px-2 py-1 hover:bg-gray-100"
          @click="closeMenu"
        >

          {{ sub }}

        </router-link>

      </li>

    </ul>


    <!-- Admin Mobile -->

    <div
      v-if="isAuthenticated && role === 'admin'"
      class="border-t mt-4 p-4"
    >

      <h4 class="font-semibold mb-2">
        Admin
      </h4>

      <router-link
        to="/admin"
        class="block py-1 hover:text-BgFont"
        @click="closeMenu"
      >
        Dashboard
      </router-link>

      <router-link
        to="/admin/products"
        class="block py-1 hover:text-BgFont"
        @click="closeMenu"
      >
        Products
      </router-link>

    </div>

  </div>


  <!-- Backdrop -->

  <div
    class="flex-1 bg-black/50"
    @click="closeMenu"
  ></div>

</div>

</template>