<script setup>
import { ref, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const products = ref([])
const hoveredProductId = ref(null)
const currentPage = ref(1)

const productsPerPage = 8

const route = useRoute()
const router = useRouter()

const fetchProducts = async (query = "") => {
  try {
    let url = "http://localhost:5000/products"

    if (query) {
      url = `http://localhost:5000/products/search?name=${encodeURIComponent(query)}`
    }

    const res = await fetch(url)
    const data = await res.json()

    products.value = data
    currentPage.value = 1
  } catch (err) {
    console.error("Fetch products error:", err)
  }
}

watch(
  () => route.query.search,
  (search) => {
    fetchProducts(search || "")
  },
  { immediate: true }
)

/* -------- Pagination -------- */

const indexOfLastProduct = computed(() => currentPage.value * productsPerPage)

const indexOfFirstProduct = computed(
  () => indexOfLastProduct.value - productsPerPage
)

const currentProducts = computed(() =>
  products.value.slice(indexOfFirstProduct.value, indexOfLastProduct.value)
)

const totalPages = computed(() =>
  Math.ceil(products.value.length / productsPerPage)
)

const goToProduct = (id) => {
  router.push(`/product/${id}`)
}
</script>

<template>
  <div class="bg-white min-h-screen">

    <!-- Hero Section -->
    <div class="relative h-[80vh] w-full overflow-hidden">

      <video
        class="absolute top-0 left-0 w-full h-full object-cover"
        src="/video1.mp4"
        autoplay
        loop
        muted
        playsinline
      />

      <div class="absolute inset-0 bg-black/40 flex items-center justify-center">

        <div class="text-center text-white p-6 md:p-12">

          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            New Season. New Style.
          </h1>

          <p class="text-lg md:text-xl mb-8">
            Discover our latest collections for clothing and home.
          </p>

          <a
            href="#products"
            class="bg-white text-gray-900 py-3 px-8 rounded-full font-semibold shadow-lg hover:bg-gray-200 transition"
          >
            Shop Now
          </a>

        </div>

      </div>

    </div>


    <!-- Product Grid -->
    <div id="products" class="container mx-auto py-16">

      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">

        <div
          v-for="product in currentProducts"
          :key="product._id"
          class="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer bg-white"
          @mouseenter="hoveredProductId = product._id"
          @mouseleave="hoveredProductId = null"
          @click="goToProduct(product._id)"
        >

          <!-- Image Hover -->
          <div class="relative pt-[125%]">

            <img
              :src="product.images[0]"
              :alt="product.name"
              class="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
              :class="hoveredProductId === product._id ? 'opacity-0' : 'opacity-100'"
            />

            <img
              :src="product.images[1] || product.images[0]"
              :alt="product.name"
              class="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300"
              :class="hoveredProductId === product._id ? 'opacity-100' : 'opacity-0'"
            />

          </div>

          <!-- Product Info -->
          <div class="p-4">

            <h3 class="text-lg font-semibold truncate">
              {{ product.name }}
            </h3>

            <p class="text-gray-600 mt-1">
              {{ product.price }} €
            </p>

            <!-- Colors -->
            <div
              v-if="product.colors?.length"
              class="flex gap-2 mt-2"
            >

              <span
                v-for="color in product.colors"
                :key="color"
                class="w-4 h-4 rounded-full border"
                :title="color"
                :style="{
                  backgroundColor: color.toLowerCase().replace(/\\s+/g,'')
                }"
              />

            </div>

          </div>

        </div>

        <p
          v-if="currentProducts.length === 0"
          class="col-span-4 text-center text-gray-500"
        >
          No products found.
        </p>

      </div>


      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="flex justify-center mt-12 gap-2"
      >

        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          class="px-4 py-2 border rounded"
          :class="currentPage === page ? 'bg-black text-white' : 'hover:bg-gray-100'"
        >
          {{ page }}
        </button>

      </div>

    </div>

  </div>
</template>