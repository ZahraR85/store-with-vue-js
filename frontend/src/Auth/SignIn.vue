<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAppContext } from "../context/AppContext.js"; // Make sure your Vue context is ready

// State
const formData = reactive({
  identifier: "",
  password: "",
});

const error = ref("");
const router = useRouter();

// App context for authentication
const { setAuth } = useAppContext();

// Sign in handler
const handleSignIn = async () => {
  error.value = "";
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      // Set authentication context and store user info in localStorage
      setAuth(true, data.userId, data.role);
      localStorage.setItem("role", data.role);
      localStorage.setItem("token", data.token);
      router.push("/");
    } else {
      const message = await response.text();
      error.value = message || "Invalid login credentials";
    }
  } catch (err) {
    console.error(err);
    error.value = "Failed to sign in. Please try again later.";
  }
};
</script>

<template>
  <div class="flex flex-col md:flex-row min-h-screen bg-customBg">

    <!-- Left Section: Form -->
    <div class="w-full md:w-1/2 flex items-center justify-center min-h-screen">
      <div class="w-full max-w-md bg-white shadow-lg rounded-lg p-10 space-y-6">
        <h2 class="text-3xl font-bold text-center text-BgFont mb-5">
          Please Login!
        </h2>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <input
          type="text"
          v-model="formData.identifier"
          placeholder="Name or Email"
          class="block w-full p-2 border rounded border-BgBlack focus:outline-none focus:ring focus:ring-BgBlackLight"
        />
        <input
          type="password"
          v-model="formData.password"
          placeholder="Password"
          class="block w-full p-2 border rounded border-BgBlack focus:outline-none focus:ring focus:ring-BgBlackLight"
        />

        <div class="text-start underline hover:decoration-2 text-sm">
          <router-link to="/register" class="text-BgFont">
            Forgot your password?
          </router-link>
        </div>

        <button
          @click="handleSignIn"
          class="bg-BgBlack text-white py-2 text-lg font-bold hover:bg-BgBlackLight rounded w-full"
        >
          Sign In
        </button>

        <div class="text-center underline hover:decoration-2 text-BgFont text-sm">
          <router-link to="/register">Create Account / Register</router-link>
        </div>
      </div>
    </div>

    <!-- Right Section: Picture -->
    <div
      class="w-full md:w-1/2 flex justify-center items-center bg-cover bg-center"
      style="background-image: url('https://i.postimg.cc/sXN2SjZQ/Quiet-Luxury-fashion-12.jpg')"
    >
      <div class="w-full h-full"></div>
    </div>

  </div>
</template>