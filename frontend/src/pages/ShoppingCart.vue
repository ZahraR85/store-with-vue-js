<script setup>
import { ref, watch, computed } from "vue"
import { RouterLink } from "vue-router"
import { useCart } from "../context/CartContext"
import { useFavorites } from "../context/FavoriteContext"

const { cartItems, removeFromCart, updateQuantity } = useCart()
const { favorites, toggleFavorite } = useFavorites()

// local quantity state
const quantities = ref({})

// sync quantities when cart changes
watch(
  cartItems,
  (items) => {
    const initial = {}
    items.forEach((item) => {
      initial[item._id] = item.quantity || 1
    })
    quantities.value = initial
  },
  { immediate: true }
)

// change quantity
const handleQuantityChange = (itemId, value) => {
  const newQuantity = Math.max(1, Number(value))

  quantities.value[itemId] = newQuantity

  updateQuantity(itemId, newQuantity)
}

// total price
const totalPrice = computed(() => {
  return cartItems.reduce((total, item) => {
    const quantity = quantities.value[item._id] || 1
    return total + item.product.price * quantity
  }, 0)
})

// check favorite
const isFavorite = (productId) => {
  return favorites.some((f) => f._id === productId)
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">

    <!-- Empty Cart -->
    <p v-if="cartItems.length === 0" class="text-lg text-center">
      Your cart is empty.
    </p>

    <!-- Cart Items -->
    <div
      v-for="item in cartItems"
      :key="item._id"
      class="flex items-center gap-6 border-b py-6"
    >

      <!-- Product Info -->
      <RouterLink
        :to="`/product/${item.product._id}`"
        class="flex items-center gap-4 flex-1"
      >
        <img
          :src="item.product.images?.[0]"
          :alt="item.product.name"
          class="w-24 h-24 object-contain"
        />

        <div>
          <p class="font-semibold text-lg">
            {{ item.product.name }}
          </p>

          <p class="text-gray-500">
            €{{ item.product.price.toFixed(2) }}
          </p>

          <!-- Size -->
          <p
            v-if="item.size"
            class="text-sm text-gray-600"
          >
            Size:
            <span class="font-medium">{{ item.size }}</span>
          </p>

          <!-- Color -->
          <div
            v-if="item.color"
            class="flex items-center gap-2 text-sm text-gray-600"
          >
            <span>Color:</span>

            <span
              class="w-4 h-4 rounded-full border"
              :style="{
                backgroundColor: item.color.toLowerCase().replace(/\\s+/g,'')
              }"
            ></span>

            <span class="font-medium">{{ item.color }}</span>
          </div>
        </div>
      </RouterLink>

      <!-- Favorite -->
      <button
        @click="toggleFavorite(item.product)"
        class="text-xl"
      >
        <span
          :class="
            isFavorite(item.product._id)
              ? 'text-red-500'
              : 'text-gray-300 hover:text-red-400'
          "
        >
          ♥
        </span>
      </button>

      <!-- Quantity -->
      <div class="flex flex-col items-center gap-2">
        <div class="flex items-center gap-3">

          <button
            @click="handleQuantityChange(item._id, quantities[item._id] - 1)"
            class="px-3 py-1 border rounded hover:bg-gray-100"
          >
            -
          </button>

          <input
            type="number"
            min="1"
            :value="quantities[item._id]"
            @input="handleQuantityChange(item._id, $event.target.value)"
            class="w-16 text-center border rounded py-1"
          />

          <button
            @click="handleQuantityChange(item._id, quantities[item._id] + 1)"
            class="px-3 py-1 border rounded"
          >
            +
          </button>

        </div>

        <p class="text-sm font-semibold">
          €{{
            (item.product.price *
              (quantities[item._id] || 1)).toFixed(2)
          }}
        </p>
      </div>

      <!-- Remove -->
      <div class="flex flex-col items-end gap-3">
        <button
          @click="removeFromCart(item._id)"
          class="hover:underline"
        >
          🗑
        </button>
      </div>

    </div>

    <!-- Total -->
    <div
      v-if="cartItems.length > 0"
      class="mt-8 flex justify-between items-center border-t pt-6"
    >
      <h2 class="text-xl font-bold">
        Total:
      </h2>

      <p class="text-2xl font-bold">
        €{{ totalPrice.toFixed(2) }}
      </p>
    </div>

  </div>
</template>