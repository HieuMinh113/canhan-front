<template>
  <nav v-if="isStaff">
    <div class="logo-section">
      <img :src="logoSrc" alt="Logo" class="logo" />
      <span class="brand-name">
        <router-link to="/staff">Trang Hmm Staff</router-link>
      </span>
    </div>

    <!-- Menu Icon for Mobile -->
    <button class="menu-toggle" @click="toggleMenu">
      <span>☰</span>
    </button>

    <!-- Menu Items -->
    <ul :class="{ active: isMenuOpen }">
      <li><router-link :to="`/staff/${staffId}`"><span>🏠</span> Trang chủ</router-link></li>
      <li><router-link :to="`/staffappointments/${staffId}`"><span>📅</span> Lịch chăm sóc</router-link></li>
      <li><router-link to="/staffbookinghotel"><span>🏩</span> Đặt phòng khách sạn</router-link></li>
      <li><router-link to="/staffbill"><span>🧾</span> Hóa đơn</router-link></li>
      <li><router-link to="/staffwork"><span>💼</span> Công việc</router-link></li>
      <li v-if="isLoggedIn">
        <a href="#" @click.prevent="logout" class="logout"><span>🚪</span> Đăng xuất</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import apiClient from '../service/axios';

export default {
  name: 'AppnavbarStaff',
  data() {
    return {
      logoSrc: require('../assets/Healing.png'),
      isMenuOpen: false,
      staffId: localStorage.getItem('user_id') || '',
      isLoggedIn: !!localStorage.getItem('auth_token'),
      isStaff: false,
    };
  },
  mounted() {
    const role = localStorage.getItem('user_role');
    const id = localStorage.getItem('user_id');
    console.log('Role:', role);
    console.log('User ID:', id);

    if (role === 'staff' && id) {
      this.isStaff = true;
      this.staffId = id;
    } else {
      this.$router.push('/login');
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
    },
    logout() {
      apiClient.post('http://localhost:8000/api/logout', {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      }).finally(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
        this.isLoggedIn = false;
        this.$router.push('/login');
      });
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.logout {
  cursor: pointer;
}

/* Tổng quan */
nav {
  background: linear-gradient(135deg, #07d9cb 0%, #0fdc65 100%);
  padding: 15px 20px;
  font-family: 'Fredoka', sans-serif;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0 0 15px 15px;
  position: relative;
  color: #2a9d8f;
  border-top: 4px solid;
  border-image: linear-gradient(90deg, #2a9d8f, #4ab8a9) 1;
}

/* Logo */
.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(42, 157, 143, 0.2);
}

.brand-name {
  font-size: 1.6rem;
  font-weight: 600;
}

.brand-name a {
  color: #2a9d8f;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.brand-name a:hover {
  color: #4ab8a9;
}

/* Menu Toggle (Mobile) */
.menu-toggle {
  display: none;
  font-size: 1.8rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #2a9d8f;
  transition: color 0.3s ease;
}

.menu-toggle:hover {
  color: #4ab8a9;
}

/* Menu Items */
ul {
  display: flex;
  gap: 12px;
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 14px;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

li:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.2);
}

a {
  text-decoration: none;
  color: #2a9d8f;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: color 0.3s ease;
}

a:hover {
  color: #4ab8a9;
}

/* Responsive Design */
@media (max-width: 768px) {
  nav {
    padding: 12px 15px;
  }

  .menu-toggle {
    display: block;
  }

  ul {
    flex-direction: column;
    width: 100%;
    background: rgba(249, 230, 255, 0.95);
    position: absolute;
    top: 70px;
    left: 0;
    padding: 20px;
    display: none;
    border-radius: 0 0 15px 15px;
    z-index: 999;
    animation: slideDown 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  ul.active {
    display: flex;
    text-align: center;
  }

  li {
    width: 100%;
    margin-bottom: 10px;
  }

  .logo-section {
    gap: 8px;
  }

  .logo {
    width: 40px;
    height: 40px;
  }

  .brand-name {
    font-size: 1.4rem;
  }
}

@media (max-width: 480px) {
  nav {
    padding: 10px 10px;
  }

  .brand-name {
    font-size: 1.2rem;
  }

  ul.active {
    padding: 15px;
  }

  li {
    padding: 12px;
  }
}

/* Animation cho mobile menu */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>