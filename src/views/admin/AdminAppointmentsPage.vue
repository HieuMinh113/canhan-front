<template>
  <div class="admin-appointments-page">
    <h1 class="animate-pulse">📅 Quản lý Lịch hẹn</h1>
    <p class="subtitle">Danh sách tất cả các lịch hẹn đã được khách đặt.</p>

    <!-- Tổng số -->
    <div class="summary-box">
      <p><strong>Tổng số lịch hẹn:</strong> {{ appointments.length }}</p>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-box">
      <label for="handled">Trạng thái:
        <select v-model="filter.handled" required>
          <option value="">Tất cả</option>
          <option value="true">Đã xử lý</option>
          <option value="false">Chưa xử lý</option>
        </select>
      </label>
      <button @click="applyFilter" class="filter-btn">🔍 Lọc</button>
      <button @click="resetFilter" class="reset-btn">🔄 Reset</button>
    </div>

    <!-- Danh sách lịch hẹn -->
    <div class="appointments-list">
      <div class="appointment-card" v-for="(appointment, index) in appointments" :key="index">
        <p><strong>Khách hàng:</strong> {{ appointment.owner }}</p>
        <p><strong>Thú cưng:</strong> {{ appointment.name }}</p>
        <p><strong>Dịch vụ:</strong> {{ appointment.service?.name }}</p>
        <p><strong>Nhân viên:</strong> {{ appointment.staff?.name }}</p>
        <p><strong>Thời gian:</strong> {{ appointment.date }} lúc {{ appointment.time }}</p>
        <p>
          <strong>Trạng thái:</strong>
          <span :style="{ color: appointment.handled ? '#2a9d8f' : '#ff6b6b' }">
            {{ appointment.handled ? '✅ Đã xử lý' : '❌ Chưa xử lý' }}
          </span>
        </p>
      </div>
    </div>

    <!-- Nếu không có lịch -->
    <div v-if="appointments.length === 0" class="empty-state">
      <p>Chưa có lịch hẹn nào được đặt.</p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "AdminAppointmentsPage",
  data() {
    return {
      appointments: [],
      filter: {
        handled: '',
      },
    };
  },
  mounted() {
    this.resetFilter();
  },
  methods: {
    async fetchappointment() {
      try {
        const params = {
          ...this.filter,
        };
        if (this.filter.handled !== '') {
          params.handled = this.filter.handled;
        }
        const res = await apiClient.get('/api/appointment', {
          params
        });
        this.appointments = res.data;
      } catch (error) {
        console.error('Lỗi khi tải danh sách:', error);
      }
    },
    applyFilter() {
      this.fetchappointment();
    },
    resetFilter() {
      this.filter.handled = '';
      this.fetchappointment();
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-appointments-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.admin-appointments-page::before {
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

h1 {
  font-size: 2.8rem;
  font-weight: 600;
  color: #2a9d8f;
  text-align: center;
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.subtitle {
  text-align: center;
  color: #4a4a4a;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.summary-box {
  max-width: 600px;
  margin: 20px auto;
  padding: 15px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #2a9d8f;
  font-weight: 600;
  font-size: 1.2rem;
  border-left: 4px solid #2a9d8f;
}

.filter-box {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin: 20px 0;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filter-box label {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-box select {
  padding: 10px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
}

.filter-box select:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.filter-btn, .reset-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.filter-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.reset-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.reset-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.filter-btn::before, .reset-btn::before {
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

.filter-btn:hover::before, .reset-btn:hover::before {
  width: 200px;
  height: 200px;
}

.appointments-list {
  max-width: 900px;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.appointment-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: slideUp 0.5s ease forwards;
  border-left: 4px solid #2a9d8f;
}

.appointment-card p {
  margin: 10px 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(42, 157, 143, 0.1);
  padding-bottom: 8px;
}

.appointment-card p:last-child {
  border-bottom: none;
}

.appointment-card p strong {
  color: #f28c38;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  margin-top: 40px;
  color: #4a4a4a;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
  .admin-appointments-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .summary-box {
    font-size: 1.1rem;
    padding: 12px;
  }
  .filter-box {
    flex-direction: column;
    align-items: stretch;
  }
  .appointment-card p {
    font-size: 1rem;
    flex-direction: column;
    text-align: left;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .filter-box select, .filter-btn, .reset-btn {
    font-size: 0.9rem;
    padding: 8px;
  }
  .appointment-card {
    padding: 15px;
  }
  .appointment-card p {
    font-size: 0.95rem;
  }
}
</style>