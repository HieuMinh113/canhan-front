<template>
  <div class="admin-booking-page">
    <h1 class="animate-pulse">📅 Quản lý Đặt lịch</h1>
    <p class="subtitle">Danh sách các lịch đặt bác sĩ từ khách hàng</p>

    <!-- Thống kê -->
    <div class="summary-box">
      <p><strong>Tổng số lịch đặt:</strong> {{ bookings.length }}</p>
    </div>

    <!-- Bộ lọc -->
    <div class="filter-box">
      <div class="form-row">
        <label for="handled">Trạng thái:</label>
        <select v-model="filter.handled" required>
          <option value="">Tất cả</option>
          <option value="true">Đã xử lý</option>
          <option value="false">Chưa xử lý</option>
        </select>
      </div>
      <div class="form-row button-row">
        <button @click="applyHandled" class="filter-btn">🔍 Lọc</button>
        <button @click="cancelHandled" class="reset-btn">🔄 Xóa</button>
      </div>
    </div>

    <hr class="divider" />

    <!-- Danh sách đặt lịch -->
    <div class="booking-list">
      <div class="booking-card" v-for="(booking, index) in bookings" :key="index">
        <h3><strong>Khách hàng:</strong> {{ booking.owner }}</h3>
        <p><strong>Email:</strong> {{ booking.email }}</p>
        <p><strong>Ngày và giờ:</strong> {{ formatDate(booking.date) }} lúc {{ booking.time }}</p>
        <p><strong>Bác sĩ:</strong> {{ booking.doctor?.name || 'Không có thông tin' }}</p>
        <p>
          <strong>Trạng thái:</strong>
          <span :style="{ color: booking.handled ? '#43a047' : '#ff6b6b' }">
            {{ booking.handled ? '✅ Đã xử lý' : '❌ Chưa xử lý' }}
          </span>
        </p>
      </div>
    </div>

    <div v-if="bookings.length === 0" class="empty-state">
      <p>Hiện chưa có lịch đặt nào. Hãy chờ khách hàng đặt lịch!</p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "AdminBookingPage",
  data() {
    return {
      bookings: [],
      filter: {
        handled: '',
      },
    };
  },
  mounted() {
    this.cancelHandled();
  },
  methods: {
    async fetchBooking() {
      try {
        const params = {};
        if (this.filter.handled !== '') {
          params.handled = this.filter.handled;
        }
        const res = await apiClient.get('/api/booking', { params });
        this.bookings = res.data;
      } catch (error) {
        console.error('Lỗi khi tải danh sách đặt lịch:', error);
        alert('Không thể tải danh sách đặt lịch. Vui lòng thử lại!');
      }
    },
    applyHandled() {
      this.fetchBooking();
    },
    cancelHandled() {
      this.filter.handled = '';
      this.fetchBooking();
    },
    formatDate(date) {
      if (!date) return 'N/A';
      return new Date(date).toLocaleDateString('vi-VN');
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-booking-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
}

.admin-booking-page::before {
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
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #2a9d8f;
  font-weight: 600;
  font-size: 1.2rem;
  position: relative;
  overflow: hidden;
}

.summary-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.filter-box {
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  position: relative;
  overflow: hidden;
}

.filter-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.form-row {
  flex: 1 1 200px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-row label {
  font-weight: 600;
  color: #2a9d8f;
  font-size: 1.1rem;
  min-width: 100px;
}

.form-row select {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
}

.form-row select:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.filter-box .button-row {
  justify-content: flex-end;
  flex: 1 1 100%;
}

.filter-btn,
.reset-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
  margin-left: 10px;
}

.reset-btn {
  background: linear-gradient(90deg, #9ca3af, #6b7280);
}

.filter-btn::before,
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

.filter-btn:hover::before,
.reset-btn:hover::before {
  width: 200px;
  height: 200px;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.reset-btn:hover {
  background: linear-gradient(90deg, #6b7280, #4b5563);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  margin: 30px auto;
  width: 80%;
  border: none;
  border-radius: 2px;
}

.booking-list {
  max-width: 800px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booking-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.5s ease forwards;
}

.booking-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.booking-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.booking-card h3 {
  margin-bottom: 12px;
  color: #2a9d8f;
  font-size: 1.3rem;
  font-weight: 600;
}

.booking-card p {
  margin: 8px 0;
  color: #333;
  font-size: 1rem;
  text-align: left;
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
  .admin-booking-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .filter-box {
    flex-direction: column;
  }
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .form-row label {
    min-width: auto;
  }
  .filter-btn,
  .reset-btn {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .booking-card h3 {
    font-size: 1.2rem;
  }
  .booking-card p {
    font-size: 0.9rem;
  }
  .form-row select {
    font-size: 0.9rem;
    padding: 10px;
  }
  .filter-btn,
  .reset-btn {
    font-size: 1rem;
    padding: 10px;
  }
}
</style>