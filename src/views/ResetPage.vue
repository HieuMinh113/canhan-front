<template>
  <div class="reset-password-page">
    <div class="reset-password-container">
      <h1 class="animate-pulse">🔑 Đặt Lại Mật Khẩu</h1>
      <div class="form-group">
        <input v-model="email" placeholder="Email" type="email" />
        <input v-model="token" placeholder="Token (từ email)" />
        <input v-model="password" type="password" placeholder="Mật khẩu mới" />
        <input v-model="password_confirmation" type="password" placeholder="Xác nhận mật khẩu" />
        <button @click="resetPassword" class="reset-btn">🔄 Đặt lại mật khẩu</button>
      </div>
      <router-link to="/login" class="back-link">⬅ Quay lại đăng nhập</router-link>
    </div>
  </div>
</template>

<script>
import router from '@/router';
import apiClient from '@/service/axios';

export default {
  data() {
    return {
      email: '',
      token: '',
      password: '',
      password_confirmation: ''
    };
  },
  methods: {
    async resetPassword() {
      try {
        await apiClient.post('/api/reset', {
          email: this.email,
          token: this.token,
          password: this.password,
          password_confirmation: this.password_confirmation
        });
        alert('Đặt lại mật khẩu thành công!');
      } catch (error) {
        alert('Lỗi đặt lại mật khẩu: ' + (error.response?.data?.message || 'Vui lòng kiểm tra lại thông tin!'));
      }
      router.push('/login');
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.reset-password-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
}

.reset-password-page::before {
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

.reset-password-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 450px;
  width: 100%;
  text-align: center;
  animation: slideUp 0.8s ease forwards;
  position: relative;
  overflow: hidden;
}

.reset-password-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

h1 {
  font-size: 2.2rem;
  font-weight: 600;
  color: #2a9d8f;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  font-size: 1rem;
  color: #333;
  transition: all 0.3s ease;
}

input:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.reset-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 15px;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
  margin-top: 10px;
}

.reset-btn::before {
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

.reset-btn:hover::before {
  width: 300px;
  height: 300px;
}

.reset-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.back-link {
  display: inline-block;
  margin-top: 20px;
  color: #f28c38;
  font-size: 1rem;
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
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
  .reset-password-container {
    padding: 30px;
    max-width: 90%;
  }
  h1 {
    font-size: 2rem;
  }
  input {
    font-size: 0.9rem;
  }
  .reset-btn {
    font-size: 1rem;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .reset-password-container {
    padding: 20px;
  }
  input {
    padding: 10px;
  }
  .reset-btn {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>