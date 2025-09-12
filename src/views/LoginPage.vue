<template>
  <div class="login-page">
    <h2 class="animate-pulse">🔐 Đăng Nhập Hệ Thống</h2>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <input type="email" placeholder="📧 Email" v-model="email" required />
      </div>
      <div class="form-group">
        <input type="password" placeholder="🔑 Mật khẩu" v-model="password" required />
      </div>
      <button type="submit" class="btn-login">🐾 Đăng Nhập</button>
      <p class="social-text">Hoặc đăng nhập nhanh bằng:</p>
      <button type="button" class="btn-google" @click="loginWithGoogle">
        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" class="icon" />
        Đăng nhập bằng Google
      </button>
      <button type="button" class="btn-github" @click="loginWithGithub">
        <img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" class="icon" />
        Đăng nhập bằng GitHub
      </button>
      <p class="auth-links">
        Nếu chưa có tài khoản? <router-link to="/register" class="link">Đăng ký</router-link>
      </p>
      <p class="auth-links">
        Nếu quên mật khẩu? <router-link to="/forgot" class="link">Quên mật khẩu</router-link>
      </p>
    </form>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    loginWithGoogle() {
      window.location.href = '/auth/google/redirect';
    },
    loginWithGithub() {
      window.location.href = '/auth/github/redirect';
    },
    async handleLogin() {
      if (!this.email || !this.password) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
      }
      try {
        const response = await apiClient.post('/api/login', {
          email: this.email,
          password: this.password,
        });

        const user = response.data.user;
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user_id', user.id);
        window.dispatchEvent(new Event('auth-changed'));
        await apiClient.post('/api/cart/syn');

        alert("Đăng nhập thành công");
        switch (user.role) {
          case 'admin':
            this.$router.push('/admin');
            break;
          case 'staff':
            this.$router.push(`/staff/${user.id}`);
            break;
          case 'doctor':
            this.$router.push(`/doctor/${user.id}`);
            break;
          default:
            this.$router.push('/');
        }
      } catch (error) {
        this.successMessage = '';
        this.errorMessage = error.response?.data?.message || 'Không thể kết nối đến server';
        alert(this.errorMessage);
      }
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.login-page {
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

.login-page::before {
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

.login-form {
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

.login-form::before {
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

.btn-login {
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

.btn-login::before {
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

.btn-login:hover::before {
  width: 300px;
  height: 300px;
}

.btn-login:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.social-text {
  margin: 20px 0 15px 0;
  color: #4a4a4a;
  font-size: 1rem;
}

.btn-google, .btn-github {
  margin: 10px 0;
  background: #fff;
  color: #333;
  border: 2px solid #ddd;
  padding: 12px 20px;
  width: 100%;
  font-size: 1rem;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.btn-google:hover {
  border-color: #4285f4;
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.2);
}

.btn-github:hover {
  border-color: #333;
  background: #f8f9fa;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(51, 51, 51, 0.2);
}

.auth-links {
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

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
  .login-page {
    padding: 20px;
  }
  h2 {
    font-size: 2.2rem;
  }
  .login-form {
    padding: 30px;
    max-width: 90%;
  }
  input {
    font-size: 1rem;
    padding: 12px;
  }
  .btn-login {
    font-size: 1.1rem;
    padding: 12px;
  }
  .btn-google, .btn-github {
    font-size: 0.95rem;
    padding: 10px 16px;
  }
}

@media (max-width: 480px) {
  h2 {
    font-size: 1.8rem;
  }
  .login-form {
    padding: 20px;
  }
  input {
    font-size: 0.9rem;
    padding: 10px;
  }
  .btn-login {
    font-size: 1rem;
    padding: 10px;
  }
}
</style>
