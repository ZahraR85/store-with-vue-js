<script setup>
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { useFavorites } from "../context/FavoriteContext"

const route = useRoute()
const router = useRouter()

const products = ref([])
const headerName = ref("")

const { favorites, toggleFavorite } = useFavorites()

const gender = ref(route.params.gender)
const categoryId = ref(route.params.categoryId)
const subcategory = ref(route.params.subcategory)

const fetchProducts = async () => {
  try {
    let url = "http://localhost:5000/products"

    if (gender.value && categoryId.value && subcategory.value) {
      url = `http://localhost:5000/products/gender/${gender.value}/category/${categoryId.value}/subcategory/${subcategory.value}`
      headerName.value = subcategory.value
    }
    else if (gender.value && categoryId.value) {
      url = `http://localhost:5000/products/gender/${gender.value}/category/${categoryId.value}`
      headerName.value = "All in Category"
    }
    else if (gender.value) {
      url = `http://localhost:5000/products/gender/${gender.value}`
      headerName.value = "All Products"
    }
    else {
      headerName.value = "All Products"
    }

    const res = await fetch(url)
    const data = await res.json()

    products.value = data
  } catch (error) {
    console.error("Error fetching products:", error)
  }
}

watch(
  () => route.params,
  (params) => {
    gender.value = params.gender
    categoryId.value = params.categoryId
    subcategory.value = params.subcategory
    fetchProducts()
  },
  { immediate: true }
)

const isFavorite = (productId) => {
  return favorites.some((f) => f._id === productId)
}

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}
</script>


<template>
  <div class="p-6">

    <!-- Header -->
    <h2 class="text-2xl mb-4">
      {{ gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "" }}
      <span v-if="headerName"> - {{ headerName }}</span>
    </h2>

    <!-- No Products -->
    <p v-if="products.length === 0" class="text-gray-500">
      No products found.
    </p>

    <!-- Product Grid -->
    <div
      v-else
      class="grid grid-cols-2 md:grid-cols-5 gap-6"
    >

      <div
        v-for="p in products"
        :key="p._id"
        class="border rounded-lg p-4 shadow relative cursor-pointer hover:shadow-lg transition"
        @click="goToProduct(p._id)"
      >

        <!-- Favorite -->
        <button
          @click.stop="toggleFavorite(p)"
          class="absolute top-2 right-2 text-xl"
        >
          <span
            :class="isFavorite(p._id) ? 'text-red-500' : 'text-gray-400'"
          >
            ♥
          </span>
        </button>

        <!-- Image -->
        <img
          :src="p.images[0]"
          :alt="p.name"
          class="h-72 w-72 object-contain rounded mx-auto"
        />

        <!-- Info -->
        <h2 class="text-sm font-semibold mt-2">
          {{ p.name }}
        </h2>

        <p class="text-m text-gray-600">
          {{ p.brand }}
        </p>

        <p class="text-gray-900 font-bold">
          €{{ p.price }}
        </p>

        <!-- Colors -->
        <div
          v-if="p.colors?.length"
          class="flex gap-2 mt-2"
        >

          <span
            v-for="color in p.colors"
            :key="color"
            class="w-3 h-3 rounded-full border"
            :title="color"
            :style="{
              backgroundColor: color.toLowerCase().replace(/\\s+/g,'')
            }"
          />

        </div>

      </div>

    </div>

  </div>
</template>