import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './assets/index.css'
// Vue 3 toastification
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";

const app = createApp(App);

app.use(router);
app.use(Toast, { position: POSITION.TOP_RIGHT, timeout: 3000 });

app.mount("#app");