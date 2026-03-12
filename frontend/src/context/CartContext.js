// /context/CartContext.js
import { reactive, ref, computed, watchEffect, provide, inject, onMounted } from "vue";
import { useToast } from "vue-toastification";

const CartSymbol = Symbol("CartContext");

export function createCartContext() {
  const cartItems = reactive([]);
  const cartCount = ref(0);
  const toast = useToast();

  const token = localStorage.getItem("token");

  // Fetch cart from API
  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:3001/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      cartItems.splice(0, cartItems.length, ...(data.items || []));
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  onMounted(() => {
    if (token) fetchCart();
    else cartItems.splice(0);
  });

  // Automatically update cartCount
  watchEffect(() => {
    cartCount.value = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  });

  // Add to cart
  const addToCart = async (product, size, color, quantity = 1) => {
    if (!token) {
      toast.error("You must be logged in");
      return false;
    }
    try {
      const res = await fetch("http://localhost:3001/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          size,
          color,
          quantity,
        }),
      });

      if (!res.ok) return false;

      const data = await res.json();
      cartItems.splice(0, cartItems.length, ...(data.items || []));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Update quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/cart/update/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) {
        toast.error("Failed to update quantity");
        return;
      }
      const data = await res.json();
      cartItems.splice(0, cartItems.length, ...(data.items || []));
      toast.success("Quantity updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  // Remove from cart
  const removeFromCart = async (cartItemId) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await fetch(`http://localhost:3001/cart/remove/${cartItemId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        toast.error("Failed to remove item");
        return;
      }
      const data = await res.json();
      cartItems.splice(0, cartItems.length, ...(data.items || []));
      toast.success("Item removed");
    } catch (err) {
      console.error(err);
      toast.error("Remove failed");
    }
  };

  // Provide the cart context
  provide(CartSymbol, {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
  });

  return {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
  };
}

// Hook to use cart context
export function useCart() {
  const context = inject(CartSymbol);
  if (!context) {
    throw new Error("useCart must be used inside a component wrapped with createCartContext");
  }
  return context;
}