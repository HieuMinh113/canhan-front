<template>
  <nav>
    <div class="logo-section">
      <img :src="logoSrc" alt="Logo" class="logo" />
      <span class="brand-name"><router-link to="/">Hmm PetStore</router-link></span>
    </div>

    <!-- Menu Icon for Mobile -->
    <button class="menu-toggle" @click="toggleMenu">
      <span>☰</span>
    </button>

    <!-- Menu Items -->
    <ul :class="{ 'active': isMenuOpen }">
      <li><router-link to="/"><span>🏠</span> Trang chủ</router-link></li>
      <li><router-link to="/products"><span>🛍️</span> Sản phẩm</router-link></li>
      <li><router-link to="/pets"><span>^.^</span> Thú Cưng</router-link></li>
      <li><router-link to="/booking"><span>🩺</span> Đặt lịch khám</router-link></li>
      <li><router-link to="/hotel"><span>🏨</span> Khách sạn</router-link></li>
      <li><router-link to="/appointments"><span>📅</span> Lịch chăm sóc</router-link></li>
      <li><router-link to="/news"><span>📰</span> Tin tức</router-link></li>
      <li><router-link to="/contact"><span>📞</span> Liên hệ</router-link></li>
      <li><router-link to="/feedback"><span>📝</span> Phản hồi</router-link></li>
      <li><router-link to="/cart"><span>🛒</span></router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/login"><span>🔑</span> Đăng nhập</router-link></li>
      <li v-if="!isLoggedIn"><router-link to="/register"><span>📝</span> Đăng ký</router-link></li>
      <li v-if="isLoggedIn && userRole === 'admin'"><router-link to="/admin"><span>🛠</span> Quản trị</router-link></li>
      <li v-if="isLoggedIn"><router-link to="/profile"><i class="fas fa-user"></i></router-link></li>
      <li v-if="isLoggedIn" @click="logout" class="logout">      
        <span>🚪</span> Đăng xuất
      </li>
    </ul>
  </nav>
</template>

<script>
import apiClient from '../service/axios';

export default {
  name: 'AppNavbar',
  data() {
    return {
      isMenuOpen: false,
      logoSrc: require('../assets/Healing.png'),
      isLoggedIn: false,
      userRole: '',
    };
  },
  mounted() {
    this.syncLoginStatus();
    window.addEventListener('auth-changed', this.syncLoginStatus);
  },
  unmounted() {
    window.removeEventListener('auth-changed', this.syncLoginStatus);
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    syncLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('auth_token');
      this.userRole = localStorage.getItem('user_role');
    },
    logout() {
      const token = localStorage.getItem('auth_token');
      apiClient.post('/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }).catch(error => {
        console.warn('⚠️ API logout thất bại:', error?.response?.data || error.message);
      }).finally(() => {
        alert('Đăng xuất thành công');
        localStorage.removeItem('user_id');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        this.isLoggedIn = false;
        this.userRole = '';
        window.dispatchEvent(new Event('auth-changed'));
        this.$router.push('/login');
      });
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

/* Tổng quan */
nav {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  padding: 20px;
  font-family: 'Fredoka', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  border-radius: 0 0 20px 20px;
  position: relative;
  z-index: 1000;
}

.logout {
  cursor: pointer;
}

/* Logo */
.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.brand-name {
  font-size: 1.8rem;
  font-weight: 600;
}

.brand-name a {
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-decoration: none;
  transition: color 0.3s ease;
}

.brand-name a:hover {
  color: #f9e6ff;
}

/* Menu Toggle (Mobile) */
.menu-toggle {
  display: none;
  font-size: 2rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  transition: transform 0.3s ease;
}

.menu-toggle:hover {
  transform: rotate(90deg);
}

/* Menu Items */
ul {
  display: flex;
  gap: 15px;
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  background: rgba(255, 255, 255, 0.2);
  padding: 10px 20px;
  border-radius: 15px;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

li:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

a {
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

a:hover {
  color: #f9e6ff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  ul {
    flex-direction: column;
    width: 100%;
    background: rgba(42, 157, 143, 0.95);
    position: absolute;
    top: 80px;
    left: 0;
    padding: 20px;
    display: none;
    border-radius: 0 0 20px 20px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    z-index: 999;
    animation: slideDown 0.4s ease;
  }

  ul.active {
    display: flex;
    text-align: center;
  }

  li {
    width: 100%;
    margin: 5px 0;
    padding: 12px;
  }

  a {
    font-size: 1.2rem;
    justify-content: center;
  }
}

/* Animation cho menu mobile */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>