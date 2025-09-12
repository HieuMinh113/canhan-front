<template>
  <div>Đang đăng nhập bằng Google...</div>
</template>

<script>
export default {
  name: 'LoginSuccess',
  mounted() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const role = params.get('role');
    const id = params.get('id');

    if (token) {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_id', id);
      window.dispatchEvent(new Event('auth-changed'));
      switch (role) {
        case 'admin':
          this.$router.push('/admin');
          break;
        case 'staff':
          this.$router.push(`/staff/${id}`);
          break;
        case 'doctor':
          this.$router.push(`/doctor/${id}`);
          break;
        default:
          this.$router.push('/');
      }
    } else {
      alert('Không nhận được token từ Google.');
      this.$router.push('/login');
    }
  }
};
</script>
