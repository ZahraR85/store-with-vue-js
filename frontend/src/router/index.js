import { createRouter, createWebHistory } from "vue-router";
import SignIn from "../Auth/SignIn.vue";
import Register from "../Auth/Register.vue";
import AddProduct from "../components/AddProduct.vue";
import ProductList from "../components/ProductList.vue";
import ProductDetails from "../components/ProductDetails.vue";

const routes = [
  { path: "/", redirect: "/products" },  // default page
  { path: "/signin", component: SignIn },
  { path: "/register", component: Register },
  { path: "/add-product", component: AddProduct },
  { path: "/products", component: ProductList },
  { path: "/products/:id", component: ProductDetails },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;