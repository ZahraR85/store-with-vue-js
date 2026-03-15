import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import './assets/index.css'
// Vue 3 toastification
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { createAppContext } from "./context/AppContext.js";

const app = createApp(App);

// Provide AppContext at root
createAppContext();
app.use(router);
app.use(Toast, { position: POSITION.TOP_RIGHT, timeout: 3000 });

app.mount("#app");