<template>
  <!-- <div>
    <header class="title">
      <h2>Login</h2>
    </header>
    <form ref="authForm" @submit="sendAuthenticationData">
      <label for="">
        Eamil:
        <input ref="emailInput" name="email" type="email" />
      </label>
      <label for="">
        Password:
        <input ref="passInput" name="password" type="password" />
      </label>
      <button ref="loginButton" type="submit">Log in</button>
    </form>
  </div> -->
  <div class="login-container">
    <header class="title">
      <h2>Login</h2>
    </header>
    <form ref="authForm" @submit="sendAuthenticationData" class="login-form">
      <div class="form-group">
        <label for="email">
          Email:
          <input
            ref="emailInput"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />
        </label>
      </div>
      <div class="form-group">
        <label for="password">
          Password:
          <input
            ref="passInput"
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </label>
      </div>
      <button ref="loginButton" type="submit" class="login-button">
        Log in
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "~/store/user";
import { useSocket } from "~/store/socket";
const store = useUserStore();
const config = useRuntimeConfig();
const apiUrl = config.public.apiUrl;
const emailInput = ref(null);
const passInput = ref(null);
const socket = useSocket().getSocket();

const sendAuthenticationData = async (event) => {
  event.preventDefault();
  const email = emailInput.value.value;
  const password = passInput.value.value;
  try {
    const response = await $fetch(`${apiUrl}/api/users/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === "success") {
      const { data, token } = response;
      const user = data.user;
      store.setUserData({ user, token });
      socket.emit("User logged in", user);
      navigateTo("/");
    }
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error.message,
      fatal: true,
    });
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  margin-bottom: 2rem;
  text-align: center;
}

.title h2 {
  color: #2d3748;
  font-size: 1.875rem;
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #4a5568;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background-color: #f8fafc;
  transition: border-color 0.2s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.15);
}

.form-group input::placeholder {
  color: #a0aec0;
}

.login-button {
  background-color: #12b488;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-button:hover {
  background-color: #3182ce;
}

.login-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
}

@media (max-width: 480px) {
  .login-container {
    margin: 1rem;
    padding: 1.5rem;
  }

  .title h2 {
    font-size: 1.5rem;
  }

  .form-group input {
    padding: 0.625rem;
  }
}
</style>
