<script setup>
const props = defineProps({
  genders: Array,
  openGender: String,
  categories: Array,
  activeCategory: Object,
  isAuthenticated: Boolean,
  role: String
})

// Define emits instead of passing functions
const emit = defineEmits(["setOpenGender", "setActiveCategory"])

// Helper functions to emit events
const selectGender = (gender) => {
  emit("setOpenGender", gender)
  emit("setActiveCategory", null)
}

const selectCategory = (cat) => {
  emit("setActiveCategory", cat)
}

const backToCategories = () => {
  emit("setActiveCategory", null)
}

const closeMenu = () => {
  emit("setOpenGender", null)
  emit("setActiveCategory", null)
}
</script>

<template>
  <!-- Desktop Gender Bar -->
  <div class="hidden lg:flex justify-center bg-gray-100 py-2 gap-8">
    <span
      v-for="gender in genders"
      :key="gender"
      class="capitalize cursor-pointer px-4 py-2"
      @mouseenter="selectGender(gender)"
    >
      {{ gender }}
    </span>
  </div>

  <!-- Desktop Left Menu -->
  <div
    v-if="openGender"
    class="fixed top-[120px] left-0 h-[calc(100vh-120px)] w-[320px] bg-white shadow-2xl z-40"
    @mouseleave="closeMenu"
  >
    <div class="p-4 border-b font-bold capitalize">
      {{ openGender }}
    </div>

    <!-- Category List -->
    <ul v-if="!activeCategory" class="p-4 space-y-3">
      <li
        v-for="cat in categories.filter(c => c.gender === openGender)"
        :key="cat._id"
        class="flex justify-between items-center cursor-pointer hover:bg-gray-100 px-2 py-2"
        @click="selectCategory(cat)"
      >
        {{ cat.name }}
        <span>›</span>
      </li>
    </ul>

    <!-- Subcategories -->
    <div v-else class="p-4">
      <button class="mb-4 text-sm flex gap-2" @click="backToCategories">
        ← Back
      </button>

      <h3 class="font-semibold mb-3">
        {{ activeCategory.name }}
      </h3>

      <ul class="space-y-2">
        <li v-for="(sub, i) in activeCategory.subcategories" :key="i">
          <router-link
            :to="`/products/${openGender}/${activeCategory._id}/${encodeURIComponent(sub.toLowerCase())}`"
            class="block px-2 py-1 hover:bg-gray-100"
            @click="closeMenu"
          >
            {{ sub }}
          </router-link>
        </li>
      </ul>
    </div>

    <!-- Admin Links -->
    <div v-if="isAuthenticated && role === 'admin'" class="border-t mt-4 p-4">
      <h4 class="font-semibold mb-2">Admin</h4>
      <router-link to="/admin" class="block py-1" @click="closeMenu">
        Dashboard
      </router-link>
      <router-link to="/admin/products" class="block py-1" @click="closeMenu">
        Products
      </router-link>
    </div>
  </div>
</template>