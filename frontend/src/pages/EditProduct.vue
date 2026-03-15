<script setup>
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import toast from "react-hot-toast"
import { useAppContext } from "../context/AppContext"

const route = useRoute()
const router = useRouter()
const { role } = useAppContext()

const id = route.params.id
const token = localStorage.getItem("token")

const product = ref(null)
const newImages = ref([])
const updating = ref(false)

/* Fetch product */
const fetchProduct = async () => {
  try {
    const res = await fetch(`http://localhost:5000/products/${id}`)
    const data = await res.json()

    product.value = {
      ...data,
      sizes: data.sizes?.join(", ") || "",
      colors: data.colors?.join(", ") || ""
    }
  } catch (err) {
    toast.error("Failed to load product")
    console.error(err)
  }
}

/* Check admin role */
watch(
  () => role,
  () => {
    if (role !== "admin") {
      router.push("/")
      return
    }
    fetchProduct()
  },
  { immediate: true }
)

/* Handle input change */
const handleChange = (e) => {
  product.value[e.target.name] = e.target.value
}

/* Add new images */
const handleImageChange = (e) => {
  newImages.value = [
    ...newImages.value,
    ...Array.from(e.target.files)
  ]
}

/* Delete existing image */
const removeOldImage = async (imgUrl) => {
  if (product.value.images.length === 1) {
    toast.error("Product must have at least one image")
    return
  }

  const previousImages = [...product.value.images]

  product.value.images =
    product.value.images.filter(img => img !== imgUrl)

  const toastId = toast.loading("Deleting image...")

  try {
    const res = await fetch(
      `http://localhost:5000/products/${id}/image`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ imageUrl: imgUrl })
      }
    )

    if (!res.ok) throw new Error("Delete failed")

    toast.success("Image deleted", { id: toastId })

  } catch (error) {

    product.value.images = previousImages

    toast.error("Failed to delete image", { id: toastId })
    console.error(error)
  }
}

/* Update product */
const handleUpdate = async () => {

  if (
    product.value.images.length === 0 &&
    newImages.value.length === 0
  ) {
    toast.error("At least one image is required")
    return
  }

  const formData = new FormData()

  formData.append("name", product.value.name)
  formData.append("price", product.value.price)
  formData.append("description", product.value.description)
  formData.append("brand", product.value.brand)
  formData.append("stock", product.value.stock)
  formData.append("sizes", product.value.sizes)

  /* Normalize colors */
  const normalizedColors = product.value.colors
    .split(",")
    .map(c => c.trim())
    .map(c =>
      c
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase())
    )
    .join(", ")

  formData.append("colors", normalizedColors)

  product.value.images.forEach(img => {
    formData.append("existingImages", img)
  })

  newImages.value.forEach(file => {
    formData.append("images", file)
  })

  const toastId = toast.loading("Updating product...")
  updating.value = true

  try {

    const res = await fetch(
      `http://localhost:5000/products/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    )

    if (!res.ok) throw new Error("Update failed")

    toast.success("Product updated successfully", { id: toastId })

    router.push("/admin/products")

  } catch (err) {

    toast.error("Failed to update product", { id: toastId })
    console.error(err)

  } finally {
    updating.value = false
  }
}
</script>


<template>
<div v-if="product" class="p-10 max-w-xl mx-auto">

  <h1 class="text-xl font-bold mb-4">
    Edit Product
  </h1>

  <input
    name="name"
    v-model="product.name"
    class="border p-2 w-full mb-2"
    placeholder="Name"
  />

  <input
    name="price"
    v-model="product.price"
    class="border p-2 w-full mb-2"
    placeholder="Price"
  />

  <input
    name="brand"
    v-model="product.brand"
    class="border p-2 w-full mb-2"
    placeholder="Brand"
  />

  <textarea
    name="description"
    v-model="product.description"
    class="border p-2 w-full mb-2"
    placeholder="Description"
  />

  <input
    name="sizes"
    v-model="product.sizes"
    class="border p-2 w-full mb-2"
    placeholder="Sizes (e.g. S, M, L, XL)"
  />

  <input
    name="colors"
    v-model="product.colors"
    class="border p-2 w-full mb-2"
    placeholder="Colors (e.g. Red, Light Blue, Black)"
  />

  <input
    name="stock"
    v-model="product.stock"
    class="border p-2 w-full mb-4"
    placeholder="Stock"
  />

  <!-- Existing images -->
  <div class="flex flex-wrap gap-2 mb-4">

    <div
      v-for="(img,index) in product.images"
      :key="index"
      class="relative"
    >

      <img
        :src="img"
        class="w-20 h-20 object-cover rounded"
      />

      <button
        type="button"
        @click="removeOldImage(img)"
        class="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
      >
        ×
      </button>

    </div>

  </div>

  <!-- Upload new images -->
  <input
    type="file"
    multiple
    accept="image/*"
    @change="handleImageChange"
    class="border p-2 w-full mb-4"
  />

  <button
    @click="handleUpdate"
    :disabled="updating"
    class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
  >
    {{ updating ? "Updating..." : "Update Product" }}
  </button>

</div>

<div v-else class="p-10">
  Loading...
</div>
</template>