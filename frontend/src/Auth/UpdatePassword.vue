<script setup>
import { ref } from "vue";

const formData = ref({
  oldPassword: "",
  newPassword: "",
});

const message = ref("");

const handleChange = (e) => {
  const { name, value } = e.target;
  formData.value[name] = value;
};

const handleUpdatePassword = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/password`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData.value),
      }
    );

    if (response.ok) {
      message.value = "Password updated successfully";
    } else {
      const text = await response.text();
      message.value = text || "Password update failed";
    }
  } catch (err) {
    console.error(err);
    message.value = "An error occurred. Please try again later.";
  }
};
</script>

<template>
  <div class="form-container p-4 bg-white rounded shadow space-y-3 max-w-md mx-auto">
    <h2 class="text-xl font-bold">Update Password</h2>
    <p v-if="message" class="text-sm text-red-600">{{ message }}</p>

    <input
      type="password"
      name="oldPassword"
      placeholder="Old Password"
      v-model="formData.oldPassword"
      class="border p-2 w-full rounded"
    />

    <input
      type="password"
      name="newPassword"
      placeholder="New Password"
      v-model="formData.newPassword"
      class="border p-2 w-full rounded"
    />

    <button
      @click="handleUpdatePassword"
      class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
    >
      Update Password
    </button>
  </div>
</template>