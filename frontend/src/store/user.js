import { reactive } from "vue";

export const userStore = reactive({
  userId: null,
  role: null,
  isAuth: false,
  setAuth(userId, role) {
    this.userId = userId;
    this.role = role;
    this.isAuth = !!userId;
  },
  logout() {
    this.userId = null;
    this.role = null;
    this.isAuth = false;
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  },
});