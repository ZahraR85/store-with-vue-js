<script setup>
import { ref, computed, watch } from "vue"
import { useRoute } from "vue-router"
import { useCart } from "../context/CartContext"
import toast from "react-hot-toast"

const route = useRoute()
const { addToCart } = useCart()

const product = ref(null)
const activeImage = ref("")
const currentIndex = ref(0)

const selectedSize = ref("")
const selectedColor = ref("")
const quantity = ref(1)

const isAdding = ref(false)

const id = computed(() => route.params.id)

const fetchProduct = async () => {
  try {
    const res = await fetch(`http://localhost:5000/products/${id.value}`)
    const data = await res.json()

    product.value = data
    currentIndex.value = 0
    activeImage.value = data.images[0]

    if (data.sizes?.length === 1) selectedSize.value = data.sizes[0]
    if (data.colors?.length === 1) selectedColor.value = data.colors[0]

  } catch (err) {
    console.error(err)
  }
}

watch(id, fetchProduct, { immediate: true })

/* Image pagination */

const nextImage = () => {
  if (currentIndex.value < product.value.images.length - 1) {
    currentIndex.value++
    activeImage.value = product.value.images[currentIndex.value]
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    activeImage.value = product.value.images[currentIndex.value]
  }
}

/* Selection rules */

const sizeRequired = computed(() =>
  product.value?.sizes?.length > 1
)

const colorRequired = computed(() =>
  product.value?.colors?.length > 1
)

const canAddToCart = computed(() =>
  (!sizeRequired.value || selectedSize.value) &&
  (!colorRequired.value || selectedColor.value)
)

const increaseQty = () => {
  quantity.value++
}

const decreaseQty = () => {
  quantity.value = Math.max(1, quantity.value - 1)
}

const handleAddToCart = async () => {
  if (!canAddToCart.value) {
    toast.error("Please select size and color")
    return
  }

  isAdding.value = true

  const success = await addToCart(
    product.value,
    selectedSize.value,
    selectedColor.value,
    quantity.value
  )

  if (success) {
    toast.success("Added to cart successfully 🛒")
    quantity.value = 1
  } else {
    toast.error("Something went wrong")
  }

  isAdding.value = false
}
</script>

<template>
  <div v-if="product" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-10">

    <!-- Images -->
    <div>

      <img
        :src="activeImage"
        :alt="product.name"
        class="w-full h-[500px] object-contain border rounded"
      />

      <!-- pagination -->
      <div class="flex justify-between mt-4">

        <button
          @click="prevImage"
          :disabled="currentIndex === 0"
          class="px-4 py-2 border rounded disabled:opacity-40"
        >
          ◀ Prev
        </button>

        <span class="text-sm text-gray-500">
          {{ currentIndex + 1 }} / {{ product.images.length }}
        </span>

        <button
          @click="nextImage"
          :disabled="currentIndex === product.images.length - 1"
          class="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next ▶
        </button>

      </div>

      <!-- thumbnails -->
      <div class="flex gap-3 mt-4">

        <img
          v-for="(img, index) in product.images"
          :key="index"
          :src="img"
          @click="() => { activeImage = img; currentIndex = index }"
          class="w-20 h-20 object-contain border rounded cursor-pointer"
          :class="currentIndex === index ? 'border-blue-500' : ''"
        />

      </div>

    </div>

    <!-- Info -->
    <div>

      <h1 class="text-3xl font-bold">{{ product.name }}</h1>
      <p class="text-gray-600">{{ product.brand }}</p>
      <p class="text-2xl font-bold mt-2">€{{ product.price }}</p>

      <p class="mt-4 text-gray-700">
        {{ product.description }}
      </p>

      <!-- Sizes -->
      <div v-if="product.sizes?.length" class="mt-6">

        <h3 class="font-semibold mb-2">Size</h3>

        <div class="flex gap-2">

          <button
            v-for="size in product.sizes"
            :key="size"
            @click="selectedSize = size"
            class="border px-4 py-1 rounded"
            :class="selectedSize === size
              ? 'bg-black text-white'
              : 'hover:bg-gray-100'"
          >
            {{ size }}
          </button>

        </div>

      </div>

      <!-- Colors -->
      <div v-if="product.colors?.length" class="mt-6">

        <h3 class="font-semibold mb-2">Color</h3>

        <div class="flex gap-3 flex-wrap">

          <span
            v-for="color in product.colors"
            :key="color"
            @click="selectedColor = color"
            class="w-8 h-8 rounded-full border cursor-pointer"
            :class="selectedColor === color ? 'ring-2 ring-black' : ''"
            :style="{ backgroundColor: color.toLowerCase().replace(/\\s+/g,'') }"
            :title="color"
          />

        </div>

      </div>

      <!-- Quantity -->
      <div class="mt-6">

        <h3 class="font-semibold mb-2">Quantity</h3>

        <div class="flex items-center gap-3">

          <button
            @click="decreaseQty"
            class="px-3 py-1 border rounded hover:bg-gray-100"
          >
            -
          </button>

          <span class="w-12 text-center border rounded py-1">
            {{ quantity }}
          </span>

          <button
            @click="increaseQty"
            class="px-3 py-1 border rounded"
          >
            +
          </button>

        </div>

      </div>

      <!-- Add to Cart -->
      <button
        :disabled="!canAddToCart || isAdding"
        @click="handleAddToCart"
        class="mt-8 bg-blue-500 text-white px-6 py-3 rounded disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {{ isAdding ? "Adding..." : "Add to Cart" }}
      </button>

    </div>

  </div>

  <p v-else class="p-6">Loading...</p>
</template>