<script setup>
import { ref, onMounted } from "vue"
import axios from "axios"

const products = ref([])

// get products from backend
const fetchProducts = async () => {
  const res = await axios.get("http://localhost:5000/products")
  products.value = res.data
}
//in run mount
onMounted(fetchProducts)

// delete product
const deleteProduct = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/products/${id}`)
    // refresh product list after deletion
    fetchProducts()
  } catch (err) {
    console.error(err)
    alert("Error deleting product")
  }
}
</script>

<template>
  <div>
    <h2>Clothes Store</h2>

    <div v-for="p in products" :key="p._id" style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px;">
      <h3>{{ p.name }}</h3>
      <p>{{ p.price }} €</p>
      <p>Size: {{ p.size }}</p>
      <img :src="p.image" width="150" />
      <br />
      <button @click="deleteProduct(p._id)" style="margin-top: 5px; background-color: red; color: white; padding: 5px 10px; border: none; cursor: pointer;">
        Delete
      </button>
    </div>

  </div>
</template>