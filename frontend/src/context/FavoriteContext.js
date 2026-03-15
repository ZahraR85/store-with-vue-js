import { ref, computed, provide, inject, watch } from "vue"

const FavoritesSymbol = Symbol("Favorites")

export function createFavoritesContext(isAuthenticated) {
    // ✅ safety check
  if (!isAuthenticated) {
    console.error("FavoritesContext requires isAuthenticated ref")
    return
  }

  const favorites = ref([])

  const normalizeServerData = (data) => {
    if (!Array.isArray(data)) return []
    return data.map((item) => (item.product ? item.product : item))
  }

  const fetchFavorites = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const res = await fetch("http://localhost:5000/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!res.ok) {
        console.error("Failed to fetch favorites:", res.status)
        return
      }

      const data = await res.json()
      favorites.value = normalizeServerData(data)

      localStorage.removeItem("favorites")
    } catch (err) {
      console.error("fetchFavorites error:", err)
    }
  }

  const loadFavorites = () => {
    const token = localStorage.getItem("token")

    if (isAuthenticated.value && token) {
      fetchFavorites()
    } else {
      const stored = localStorage.getItem("favorites")

      if (stored) {
        try {
          favorites.value = JSON.parse(stored)
        } catch {
          favorites.value = []
        }
      } else {
        favorites.value = []
      }
    }
  }

  watch(isAuthenticated, loadFavorites, { immediate: true })

  watch(favorites, () => {
    const token = localStorage.getItem("token")

    if (!token) {
      localStorage.setItem("favorites", JSON.stringify(favorites.value))
    }
  })

  const toggleFavorite = async (product) => {
    const token = localStorage.getItem("token")

    if (token && isAuthenticated.value) {
      try {
        const res = await fetch("http://localhost:5000/favorites/toggle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: product._id }),
        })

        if (!res.ok) {
          console.error("Failed to toggle favorite:", res.status)
          return
        }

        await fetchFavorites()
      } catch (err) {
        console.error("toggleFavorite error:", err)
      }
    } else {
      const exists = favorites.value.some((p) => p._id === product._id)

      if (exists) {
        favorites.value = favorites.value.filter(
          (p) => p._id !== product._id
        )
      } else {
        favorites.value.push(product)
      }
    }
  }

  const favoriteCount = computed(() => favorites.value.length)

  const context = {
    favorites,
    toggleFavorite,
    fetchFavorites,
    favoriteCount,
  }

  provide(FavoritesSymbol, context)

  return context
}

export function useFavorites() {
  return inject(FavoritesSymbol)
}