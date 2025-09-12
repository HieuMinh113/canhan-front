<template>
  <div class="register-page">
    <h2 class="animate-pulse">🐶 Tạo Tài Khoản Mới</h2>
    <form @submit.prevent="handleRegister" class="register-form">
      <div class="form-group">
        <input v-model="name" placeholder="👤 Họ tên" />
      </div>
      <div class="form-group">
        <input v-model="email" placeholder="📧 Email" type="email" />
      </div>
      <div class="form-group">
        <input v-model="password" type="password" placeholder="🔑 Mật khẩu" />
      </div>
      <div class="form-group">
        <input v-model="confirmPassword" type="password" placeholder="🔁 Xác nhận mật khẩu" />
      </div>
      <button type="submit" class="btn-register">🎉 Đăng Ký</button>
      <p class="auth-link">Nếu đã có tài khoản? <router-link to="/login" class="link">Đăng nhập</router-link></p>
    </form>
    <p class="error" v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '@/service/axios'

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')

const handleRegister = async () => {
  errorMessage.value = ''
  if (!name.value || !email.value || !password.value || !confirmPassword.value) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin!'
    return
  }

  try {
    const response = await apiClient.post('http://localhost:8000/api/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value
    })

    const token = response.data.token
    localStorage.setItem('auth_token', token)
    alert('Đăng ký thành công!')
  } catch (error) {
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'Lỗi không xác định khi đăng ký.'
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.register-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.register-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://www.transparenttextures.com/patterns/paws.png') repeat;
  opacity: 0.15;
  animation: slidePaws 25s linear infinite;
}

@keyframes slidePaws {
  0% { background-position: 0 0; }
  100% { background-position: 150px 150px; }
}

h2 {
  font-size: 2.8rem;
  font-weight: 600;
  color: #2a9d8f;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.register-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 400px;
  text-align: center;
  animation: slideUp 0.8s ease forwards;
  position: relative;
  overflow: hidden;
}

.register-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

input {
  width: 100%;
  padding: 14px 16px;
  border: 2px solid #ddd;
  border-radius: 12px;
  background: #f9f9f9;
  font-size: 1.1rem;
  color: #333;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.btn-register {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  padding: 15px;
  width: 100%;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
  margin: 20px 0;
}

.btn-register::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.btn-register:hover::before {
  width: 300px;
  height: 300px;
}

.btn-register:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.auth-link {
  margin-top: 20px;
  color: #4a4a4a;
  font-size: 1rem;
}

.link {
  color: #f28c38;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.link:hover {
  color: #ff8c42;
  text-decoration: underline;
}

.error {
  color: #ff6b6b;
  font-size: 1rem;
  margin-top: 15px;
  text-align: center;
  background: rgba(255, 107, 107, 0.1);
  padding: 10px;
  border-radius: 8px;
  border-left: 4px solid #ff6b6b;
  animation: fadeIn 0.5s ease;
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .register-page {
    padding: 20px;
  }
  h2 {
    font-size: 2.2rem;
  }
  .register-form {
    padding: 30px;
    max-width: 90%;
  }
  input {
    font-size: 1rem;
    padding: 12px;
  }
  .btn-register {
    font-size: 1.1rem;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.8rem;
  }
  .register-form {
    padding: 20px;
  }
  input {
    font-size: 0.9rem;
    padding: 10px;
  }
  .btn-register {
    font-size: 1rem;
    padding: 10px;
  }
}
</style>