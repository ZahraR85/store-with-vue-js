// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import Layout from "../pages/Layout.vue";
import SignIn from "../Auth/SignIn.vue";
import Register from "../Auth/Register.vue";
import Homepage from "../pages/HomePage.vue";
import AdminDashboard from "../pages/AdminDashboard.vue";
import EditProduct from "../pages/EditProduct.vue";
import AdminProducts from "../pages/AdminProducts.vue";
import ProductPage from "../pages/ProductPage.vue";
import ProductDetails from "../pages/ProductDetails.vue";
import FavoritesPage from "../pages/FavoritesPage.vue";
import ShoppingCart from "../pages/ShoppingCart.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    children: [
      { path: "", component: Homepage },
      { path: "signin", component: SignIn },
      { path: "register", component: Register },
      { path: "products/:gender", component: ProductPage },
      { path: "products/:gender/:categoryId", component: ProductPage },
      {
        path: "products/:gender/:categoryId/:subcategory",
        component: ProductPage,
      },
      { path: "product/:id", component: ProductDetails },
      { path: "favorites", component: FavoritesPage },
      { path: "shoppingcart", component: ShoppingCart },

      /* Admin */
      {
        path: "admin",
        component: AdminDashboard,
        meta: { requiresAdmin: true },
      },
      {
        path: "admin/products",
        component: AdminProducts,
        meta: { requiresAdmin: true },
      },
      {
        path: "admin/products/edit/:id",
        component: EditProduct,
        meta: { requiresAdmin: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard برای مسیرهای Admin
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAdmin) {
    if (userStore.userId && userStore.role === "admin") {
      next();
    } else {
      next("/"); // هدایت به صفحه اصلی
    }
  } else {
    next();
  }
});

export default router;