<template>
  <div class="staff-bookinghotel-page">
    <h1 class="animate-pulse">📅 Quản lý Đặt lịch</h1>
    <p class="intro-text">Danh sách các lịch đặt khách sạn từ khách hàng để quản lý</p>

    <!-- Thống kê -->
    <div class="summary-box">
      <p><strong>Tổng số lịch đặt:</strong> {{ bookinghotels.length }}</p>
    </div>

    <!-- Danh sách đặt lịch -->
    <div class="bookinghotel-list">
      <div class="bookinghotel-card" v-for="(bookinghotel, index) in bookinghotels" :key="index">
        <p><strong>Tên khách hàng:</strong> {{ bookinghotel.name }}</p>
        <p><strong>Email:</strong> {{ bookinghotel.email }}</p>
        <p><strong>Số điện thoại:</strong> {{ bookinghotel.phone }}</p>
        <p><strong>Ngày check-in:</strong> {{ formatDate(bookinghotel.check_in) }}</p>
        <p><strong>Ngày check-out:</strong> {{ formatDate(bookinghotel.check_out) }}</p>
        <p><strong>Giờ check-in:</strong> {{ bookinghotel.check_in_time }} <strong>Giờ check-out:</strong> {{ bookinghotel.check_out_time }}</p>
        <p><strong>Khách sạn:</strong> {{ bookinghotel.hotel?.name || 'Không có thông tin' }}</p>
        <p><strong>Tổng giá tiền:</strong> {{ formatPrice(bookinghotel.total_price) }}</p>
        <p>
          <strong>Trạng thái:</strong>
          <span :style="{ color: bookinghotel.handled ? '#2a9d8f' : '#ff6b6b' }">
            {{ bookinghotel.handled ? '✅ Đã xử lý' : '❌ Chưa xử lý' }}
          </span>
        </p>
        <button @click="Accept(index)" class="accept-btn" :disabled="bookinghotel.handled">
          {{ bookinghotel.handled ? 'Đã xác nhận' : 'Xác nhận' }}
        </button>
      </div>
    </div>

    <!-- Nếu không có lịch -->
    <div v-if="bookinghotels.length === 0" class="empty-state">
      <p>Hiện tại chưa có lịch đặt nào.</p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "StaffBookingHotelPage",
  data() {
    return {
      bookinghotels: [],
      hotel: {},
    };
  },
  mounted() {
    this.fetchBookingHotel();
  },
  methods: {
    async fetchBookingHotel() {
      try {
        const res = await apiClient.get('http://localhost:8000/api/bookinghotel');
        this.bookinghotels = res.data;
      } catch (error) {
        console.error('Lỗi khi tải danh sách:', error);
        alert('Lỗi tải danh sách đặt lịch!');
      }
    },
    async Accept(index) {
      if (!confirm('Bạn có chắc muốn xác nhận lịch đặt này?')) return;
      const bookinghotel = this.bookinghotels[index];
      try {
        await apiClient.put(`http://localhost:8000/api/bookinghotel/${bookinghotel.id}`, {
          handled: true
        });
        this.bookinghotels[index].handled = true;
      } catch (error) {
        console.error('Xác nhận thất bại:', error);
        alert('Xác nhận thất bại!');
      }
    },
    formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    },
    formatPrice(value) {
      if (!value) return '0 đ';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.staff-bookinghotel-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.staff-bookinghotel-page::before {
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

.intro-text {
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

.bookinghotel-list {
  max-width: 900px;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bookinghotel-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: slideUp 0.5s ease forwards;
  border-left: 4px solid #2a9d8f;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.bookinghotel-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.bookinghotel-card p {
  margin: 10px 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(42, 157, 143, 0.1);
  padding-bottom: 8px;
}

.bookinghotel-card p:last-child {
  border-bottom: none;
}

.bookinghotel-card strong {
  color: #f28c38;
  font-weight: 500;
}

.accept-btn {
  display: block;
  margin: 15px auto 0;
  padding: 12px 25px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.accept-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  box-shadow: none;
}

.accept-btn::before {
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

.accept-btn:not(:disabled):hover::before {
  width: 200px;
  height: 200px;
}

.accept-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
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
  .staff-bookinghotel-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .intro-text {
    font-size: 1rem;
  }
  .summary-box {
    font-size: 1.1rem;
    padding: 12px;
  }
  .bookinghotel-card p {
    font-size: 1rem;
    flex-direction: column;
    text-align: left;
  }
  .accept-btn {
    font-size: 1rem;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .bookinghotel-card {
    padding: 15px;
  }
  .bookinghotel-card p {
    font-size: 0.95rem;
  }
  .accept-btn {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
}
</style>