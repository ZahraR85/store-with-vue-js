import { reactive, readonly, provide, inject, computed, onMounted } from "vue"
import axios from "axios"

const AppContextSymbol = Symbol("AppContext")

export function createAppContext() {
  const state = reactive({
    userId: null,
    isAuthenticated: false,
    role: null, // "user" or "admin"
    hoveredDropdown: null,
    isDropdownOpen: false,
  })

  // expose authentication as a computed ref
  const isAuthenticated = computed(() => state.isAuthenticated)

  // Methods
  const setAuth = (auth, userId, role) => {
    state.isAuthenticated = auth
    state.userId = userId
    state.role = role
  }

  const signOut = () => {
    localStorage.removeItem("token")
    state.isAuthenticated = false
    state.userId = null
    state.role = null
  }

  const setHoveredDropdown = (dropdown) => {
    state.hoveredDropdown = dropdown
  }

  const clearHoveredDropdown = () => {
    state.hoveredDropdown = null
  }

  const setDropdownOpen = (isOpen) => {
    state.isDropdownOpen = isOpen
  }

  // Fetch user profile if token exists
  const getUserProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) return

      const response = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      })

      const data = response.data

      setAuth(true, data.userId, data.role)
    } catch (error) {
      console.error("Failed to fetch user profile:", error)
      signOut()
    }
  }

  // Run on app start
  onMounted(() => {
    getUserProfile()
  })

  const context = {
    state: readonly(state),
    isAuthenticated, // 👈 important
    setAuth,
    signOut,
    setHoveredDropdown,
    clearHoveredDropdown,
    setDropdownOpen,
  }

  provide(AppContextSymbol, context)

  return context
}

// Hook for components
export function useAppContext() {
  const context = inject(AppContextSymbol)

  if (!context) {
    throw new Error("useAppContext must be used within a provider")
  }

  return context
}