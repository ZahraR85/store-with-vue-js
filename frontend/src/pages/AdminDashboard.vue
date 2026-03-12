<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAppContext } from "../context/AppContext"; // Vue equivalent of AppContext
import toast from "vue-toastification"; // assuming you have vue-toastification installed

const router = useRouter();
const { state: appState } = useAppContext();

const token = localStorage.getItem("token");

// -------------------- STATE --------------------
const categories = ref([]);
const categoryName = ref("");
const genderForCategory = ref("women");
const subcategoriesInput = ref("");

const productData = reactive({
  name: "",
  description: "",
  price: "",
  gender: "",
  category: "",
  subcategory: "",
  brand: "",
  sizes: [],
  colors: [],
  stock: "",
});

const imageFiles = ref([]);
const loadingCategory = ref(false);
const loadingProduct = ref(false);

// -------------------- WATCH / GUARD --------------------
watch(
  () => appState.userId,
  () => {
    if (!appState.userId || appState.role !== "admin") {
      router.push("/");
    }
  },
  { immediate: true }
);

watch(
  () => productData.gender,
  (newGender) => {
    if (newGender) fetchCategoriesByGender(newGender);
  }
);

// -------------------- FETCH CATEGORIES --------------------
const fetchCategoriesByGender = async (gender) => {
  try {
    const res = await fetch(
      `http://localhost:3001/categories?gender=${gender}`
    );
    categories.value = await res.json();
  } catch (err) {
    toast.error("Error while fetching categories");
  }
};

// -------------------- ADD CATEGORY --------------------
const handleAddCategory = async () => {
  if (!categoryName.value.trim()) {
    toast.error("Category name is required");
    return;
  }

  loadingCategory.value = true;

  try {
    const res = await fetch("http://localhost:3001/categories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: categoryName.value,
        gender: genderForCategory.value,
        subcategories: subcategoriesInput.value
          .split(",")
          .map((s) => s.trim()),
      }),
    });

    if (!res.ok) throw new Error();

    toast.success("Category added successfully ✅");
    categoryName.value = "";
    subcategoriesInput.value = "";
    fetchCategoriesByGender(genderForCategory.value);
  } catch {
    toast.error("Error adding category");
  } finally {
    loadingCategory.value = false;
  }
};

// -------------------- ADD PRODUCT --------------------
const handleAddProduct = async () => {
  if (
    !productData.gender ||
    !productData.category ||
    !productData.name ||
    !productData.price
  ) {
    toast.error("Gender, Category, Name, and Price are required");
    return;
  }

  if (imageFiles.value.length === 0) {
    toast.error("At least one image is required");
    return;
  }

  loadingProduct.value = true;

  const formData = new FormData();

  Object.entries(productData).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      formData.append(key, value.join(","));
    } else {
      formData.append(key, value);
    }
  });

  imageFiles.value.forEach((file) => formData.append("images", file));

  try {
    const res = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) throw new Error();

    toast.success("Product added successfully ✅");

    // Reset form
    Object.keys(productData).forEach((key) => {
      productData[key] = Array.isArray(productData[key]) ? [] : "";
    });
    imageFiles.value = [];
  } catch {
    toast.error("Error adding product");
  } finally {
    loadingProduct.value = false;
  }
};

// -------------------- IMAGE HANDLING --------------------
const handleImageChange = (e) => {
  imageFiles.value.push(...Array.from(e.target.files));
};

const removeImage = (index) => {
  imageFiles.value.splice(index, 1);
};
</script>

<template>
  <div class="min-h-screen p-10 bg-gray-100">
    <div class="max-w-[1200px] mx-auto bg-white p-6 rounded shadow space-y-6">
      
      <!-- Add Category -->
      <div class="border p-4 rounded space-y-3">
        <h2 class="text-xl font-semibold">Add Category</h2>
        <select v-model="genderForCategory" class="border p-2 w-full">
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
          <option value="home">Home</option>
        </select>
        <input
          v-model="categoryName"
          placeholder="Category name"
          class="border p-2 w-full"
        />
        <input
          v-model="subcategoriesInput"
          placeholder="Subcategories (comma separated)"
          class="border p-2 w-full"
        />
        <button
          @click="handleAddCategory"
          :disabled="loadingCategory"
          class="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {{ loadingCategory ? "Adding..." : "Add Category" }}
        </button>
      </div>

      <!-- Add Product -->
      <div class="border p-4 rounded space-y-3">
        <h2 class="text-xl font-bold">Add Product</h2>

        <select v-model="productData.gender" class="border p-2 rounded w-full">
          <option value="">Select Gender</option>
          <option value="women">Women</option>
          <option value="men">Men</option>
          <option value="kids">Kids</option>
          <option value="home">Home</option>
        </select>

        <select
          v-model="productData.category"
          class="border p-2 rounded w-full"
          :disabled="!productData.gender"
        >
          <option value="">Select Category</option>
          <option
            v-for="cat in categories"
            :key="cat._id"
            :value="cat._id"
          >
            {{ cat.name }}
          </option>
        </select>

        <select
          v-model="productData.subcategory"
          class="border p-2 rounded w-full"
          :disabled="!productData.category"
        >
          <option value="">Select Subcategory</option>
          <option
            v-for="sub in categories.find(c => c._id === productData.category)?.subcategories || []"
            :key="sub"
            :value="sub"
          >
            {{ sub }}
          </option>
        </select>

        <input v-model="productData.name" placeholder="Product Name" class="border p-2 rounded w-full" />
        <textarea v-model="productData.description" placeholder="Description" class="border p-2 rounded w-full"></textarea>
        <input v-model="productData.price" type="number" placeholder="Price" class="border p-2 rounded w-full" />
        <input v-model="productData.brand" placeholder="Brand" class="border p-2 rounded w-full" />
        <input v-model="productData.sizes" placeholder="Sizes (comma separated)" @input="productData.sizes = $event.target.value.split(',')" class="border p-2 rounded w-full" />
        <input v-model="productData.colors" placeholder="Colors (comma separated)" @input="productData.colors = $event.target.value.split(',')" class="border p-2 rounded w-full" />
        <input v-model="productData.stock" type="number" placeholder="Stock" class="border p-2 rounded w-full" />

        <input type="file" multiple @change="handleImageChange" class="border p-2 rounded w-full mb-2" />

        <div class="flex flex-wrap gap-2">
          <div v-for="(file, index) in imageFiles" :key="index" class="relative">
            <img :src="URL.createObjectURL(file)" class="w-16 h-16 object-cover rounded" />
            <button @click="removeImage(index)" class="absolute top-0 right-0 text-white bg-red-600 rounded-full w-6 h-6 flex items-center justify-center">
              &times;
            </button>
          </div>
        </div>

        <button @click="handleAddProduct" :disabled="loadingProduct" class="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {{ loadingProduct ? "Saving..." : "Add Product" }}
        </button>
      </div>
    </div>
  </div>
</template>