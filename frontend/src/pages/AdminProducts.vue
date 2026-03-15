<template>
  <div class="p-10">
    <h1 class="text-2xl font-bold mb-6">Manage Products</h1>

    <div class="grid md:grid-cols-4 gap-6">
      <div
        v-for="p in products"
        :key="p._id"
        class="border p-4 rounded shadow"
      >
        <img
          :src="p.images[0]"
          :alt="p.name"
          class="h-40 object-contain mx-auto"
        />
        <h2 class="font-semibold mt-2">{{ p.name }}</h2>
        <p class="text-gray-600">€{{ p.price }}</p>

        <div class="flex justify-between mt-4">
          <button
            @click="navigateToEdit(p._id)"
            class="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            @click="handleDelete(p._id)"
            class="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAppContext } from "../context/AppContext"; // باید Vue version این context داشته باشی

export default {
  name: "AdminProducts",
  setup() {
    const products = ref([]);
    const router = useRouter();
    const { role } = useAppContext(); // مشابه React context

    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        products.value = data;
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    const navigateToEdit = (id) => {
      router.push(`/admin/products/edit/${id}`);
    };

    const handleDelete = async (id) => {
      if (!confirm("Are you sure you want to delete this product?")) return;

      try {
        const res = await fetch(`http://localhost:5000/products/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          products.value = products.value.filter((p) => p._id !== id);
        }
      } catch (err) {
        console.error("Delete failed:", err);
      }
    };

    // Redirect if role is not admin
    watch(
      () => role.value,
      (newRole) => {
        if (newRole !== "admin") {
          router.push("/");
        } else {
          fetchProducts();
        }
      },
      { immediate: true }
    );

    return {
      products,
      navigateToEdit,
      handleDelete,
    };
  },
};
</script>

<style scoped>
</style>