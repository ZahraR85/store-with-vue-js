<script setup>
import { useRouter } from "vue-router";
import { useAppContext } from "../context/AppContext.js"; // make sure your Vue context exists

const { signOut } = useAppContext();
const router = useRouter();

const handleSignOut = () => {
  signOut();
  router.push("/signin");
};
</script>

<template>
  <button
    @click="handleSignOut"
    class="ml-4 font-bold px-6 py-3 text-white rounded underline hover:decoration-2"
  >
    Sign Out
  </button>
</template>