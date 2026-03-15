<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar component -->
    <Navbar />

    <!-- Main content -->
    <main class="flex-grow">
      <slot />        <!-- برای هر چیزی که داخل Layout استفاده شود -->
      <router-view /> <!-- معادل Outlet در React -->
    </main>

    <!-- Footer component -->
    <Footer />
  </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "Layout",
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style scoped>
</style>