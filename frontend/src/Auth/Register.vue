<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

// State
const formData = reactive({
  name: "",
  family: "",
  email: "",
  phone: "",
  password: "",
});

const error = ref("");
const success = ref(false);

const router = useRouter();

// Handle input change (v-model already updates reactive state)
const handleRegister = async () => {
  // Validation
  if (!/^[a-zA-Z]+$/.test(formData.name)) {
    error.value = "Name must contain only letters.";
    return;
  }
  if (!/^[a-zA-Z]+$/.test(formData.family)) {
    error.value = "Family name must contain only letters.";
    return;
  }
  if (!/^\d{10,15}$/.test(formData.phone)) {
    error.value = "Enter a valid phone number (10-15 digits).";
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    error.value = "Enter a valid email.";
    return;
  }
  if (!formData.password) {
    error.value = "Password is required.";
    return;
  }

  error.value = "";

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      success.value = true;
      setTimeout(() => router.push("/signin"), 2000); // Redirect after success
    } else {
      const message = await response.text();
      error.value = message || "Registration failed";
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to register. Please try again later.";
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-customBg">

    <!-- Left Section: Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center min-h-screen">
      <div class="w-full max-w-md bg-white shadow-lg rounded-lg p-10 space-y-6">
        <h2 class="text-3xl text-BgFont font-bold mb-10 text-center">
          Please Register!
        </h2>

        <p v-if="success" class="text-green-500 text-sm text-center">
          Registration successful! Redirecting...
        </p>
        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <input
          type="text"
          v-model="formData.name"
          placeholder="Name"
          class="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
        />
        <input
          type="text"
          v-model="formData.family"
          placeholder="Last Name"
          class="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
        />
        <input
          type="email"
          v-model="formData.email"
          placeholder="Email"
          class="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
        />
        <input
          type="text"
          v-model="formData.phone"
          placeholder="Phone"
          class="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
        />
        <input
          type="password"
          v-model="formData.password"
          placeholder="Password"
          class="block w-full p-2 border rounded border-BgPinkDark focus:outline-none focus:ring focus:ring-BgBlackLight"
        />

        <button
          @click="handleRegister"
          class="bg-BgBlack text-white py-2 text-lg font-bold hover:bg-BgBlackLight rounded w-full"
        >
          Register
        </button>
      </div>
    </div>

    <!-- Right Section: Picture -->
    <div
      class="w-full md:w-1/2 flex justify-center items-center bg-cover bg-center"
      style="background-image: url('https://i.postimg.cc/Gt6TTH3t/pick.jpg')"
    >
      <div class="w-full h-full"></div>
    </div>

  </div>
</template>