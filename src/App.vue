<template>
  <div>
    <component :is="navbarComponent" />
    <router-view />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue'
import AppNavbarAdmin from './components/AppNavbarAdmin.vue'
import AppNavbarDoctor from './components/AppNavbarDoctor.vue'
import AppNavbarStaff from './components/AppNavbarStaff.vue'
export default {
  components: {
    AppNavbar,
    AppNavbarAdmin,
    AppNavbarDoctor,
    AppNavbarStaff
  },
  data() {
    return {
      role: null
    }
  },
  mounted() {
    this.role = localStorage.getItem('user_role');
    window.addEventListener('auth-changed', () => {
      this.role = localStorage.getItem('user_role');
    });
  },
  computed: {
    navbarComponent() {
      switch (this.role) {
        case 'admin':
          return 'AppNavbarAdmin';
          case 'doctor':
          return 'AppNavbarDoctor';
          case 'staff':
          return 'AppNavbarStaff';
        default:
          return 'AppNavbar'; 
      }
    }
  }
}
</script>
