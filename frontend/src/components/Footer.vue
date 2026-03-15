<script setup>
import { RouterLink } from "vue-router"
import logo from "../images/Logo.png"
</script>

<template>
  <footer class="bg-BgKhaki text-BgFont py-8 px-4 md:py-12 md:px-6">
    <div class="container mx-auto grid grid-cols-3 gap-2 lg:gap-8 text-left">

      <!-- Menu Section -->
      <div>
        <ul class="space-y-2 md:space-y-3">
          <li>
            <RouterLink to="/" class="hover:underline">
              Home
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/aboutus" class="hover:underline">
              About Us
            </RouterLink>
          </li>

          <li>
            <RouterLink to="/faq" class="hover:underline">
              FAQ
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- Center Section -->
      <div
        class="border-t border-BgKhakiDark md:border-t-0 md:border-l md:border-r md:px-6 flex flex-col items-center"
      >
        <img
          :src="logo"
          alt="I Said Yes Logo"
          class="w-24 h-auto mb-4 md:w-32"
        />

        <p class="text-xs md:text-sm mb-4 hidden md:block">
          Buy all thing in your Dreams!
        </p>

        <p class="text-xs">
          © 2025 Number One. All Rights Reserved.
        </p>
      </div>

      <!-- Contact Section -->
      <div>
        <p class="mb-2 text-sm md:text-base">
          Email:
          <a
            href="mailto:info@numberone.com"
            class="hover:underline"
          >
            info@NumberOne.com
          </a>
        </p>

        <p class="mb-4 text-sm md:mb-6 md:text-base">
          Phone: +49 (777) 123-4567
        </p>

        <div class="flex justify-center md:justify-start space-x-3 text-lg md:text-2xl">
          <a href="#" class="hover:text-BgPinkDark">
            <i class="fab fa-instagram"></i>
          </a>

          <a href="#" class="hover:text-BgPinkDark">
            <i class="fab fa-facebook"></i>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom Links -->
    <div
      class="mt-4 md:mt-8 text-center text-xs md:text-sm border-t border-BgKhakiDark pt-4 md:pt-6"
    >
      <a href="#impressum" class="hover:underline mx-2 md:mx-4">
        Impressum
      </a>

      <a href="#privacy" class="hover:underline mx-2 md:mx-4">
        Privacy Policy
      </a>
    </div>
  </footer>
</template>