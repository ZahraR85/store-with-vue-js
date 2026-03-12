<script setup>
import { ref } from "vue"
import axios from "axios"

const name = ref("")
const price = ref(0)
const size = ref("")
const image = ref("")

const addProduct = async () => {
  if (!name.value || !price.value) {
    alert("Please enter name and price")
    return
  }

  try {
    const res = await axios.post("http://localhost:5000/products", {
      name: name.value,
      price: price.value,
      size: size.value,
      image: image.value
    })

    alert(`Product ${res.data.name} added!`)

    name.value = ""
    price.value = 0
    size.value = ""
    image.value = ""

  } catch (err) {
    console.error(err)
    alert("Error adding product")
  }
}
</script>

<template>
  <h2>Add New Product</h2>
  <form @submit.prevent="addProduct">
    <input v-model="name" placeholder="Name" />
    <input v-model="price" type="number" placeholder="Price" />
    <input v-model="size" placeholder="Size (S/M/L)" />
    <input v-model="image" placeholder="Image URL" />
    <button type="submit">Add Product</button>
  </form>
</template>