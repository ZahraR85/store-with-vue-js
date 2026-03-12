import { createRouter, createWebHistory } from "vue-router"

import ProductList from "../components/ProductList.vue"
import AddProduct from "../components/AddProduct.vue"

const routes = [
  {
    path: "/",
    component: ProductList
  },
  {
    path: "/add",
    component: AddProduct
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router