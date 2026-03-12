import { reactive, readonly, provide, inject, onMounted } from "vue";
import axios from "axios";

const AppContextSymbol = Symbol("AppContext");

export function createAppContext() {
  const state = reactive({
    userId: null,
    isAuthenticated: false,
    role: null, // "user" or "admin"
    hoveredDropdown: null,
    isDropdownOpen: false,
  });

  // Methods
  const setAuth = (isAuthenticated, userId, role) => {
    state.isAuthenticated = isAuthenticated;
    state.userId = userId;
    state.role = role;
  };

  const signOut = () => {
    localStorage.removeItem("token");
    state.isAuthenticated = false;
    state.userId = null;
    state.role = null;
  };

  const setHoveredDropdown = (dropdown) => {
    state.hoveredDropdown = dropdown;
  };

  const clearHoveredDropdown = () => {
    state.hoveredDropdown = null;
  };

  const setDropdownOpen = (isOpen) => {
    state.isDropdownOpen = isOpen;
  };

  // Fetch user profile if token exists
  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;
      const user = {
        id: data.userId,
        email: data.email, // optional
        name: data.name, // optional
      };

      setAuth(true, user, data.role);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      signOut();
    }
  };

  // On mounted (like React's useEffect)
  onMounted(() => {
    getUserProfile();
  });

  const context = {
    state: readonly(state),
    setAuth,
    signOut,
    setHoveredDropdown,
    clearHoveredDropdown,
    setDropdownOpen,
  };

  provide(AppContextSymbol, context);
  return context;
}

// Hook for components to use
export function useAppContext() {
  const context = inject(AppContextSymbol);
  if (!context) {
    throw new Error("useAppContext must be used within a provider");
  }
  return context;
}