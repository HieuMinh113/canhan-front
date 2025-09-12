<template>
  <div class="doctor-bookings-page">
    <h1 class="animate-pulse">📅 Lịch Hẹn Bác Sĩ</h1>
    <p class="intro-text">Danh sách các lịch hẹn đã được phân công cho bạn</p>

    <!-- Tổng số -->
    <div class="summary">
      <p><strong>Tổng số lịch hẹn:</strong> {{ bookings.length }}</p>
    </div>

    <!-- Danh sách lịch hẹn -->
    <div class="booking-list">
      <div class="booking-card" v-for="(booking, index) in bookings" :key="index">
        <p><strong>Khách hàng:</strong> {{ booking.owner }}</p>
        <p><strong>Số điện thoại:</strong> {{ booking.phone }}</p>
        <p><strong>Email:</strong> {{ booking.email }}</p>
        <p><strong>Tên thú cưng:</strong> {{ booking.name }}</p>
        <p><strong>Loại thú cưng:</strong> {{ booking.type }}</p>
        <p><strong>Ngày giờ:</strong> {{ booking.date }} lúc {{ booking.time }}</p>
        <p><strong>Bác sĩ phụ trách:</strong> {{ doctor.name }}</p>
        <p>
          <strong>Trạng thái:</strong>
          <span :style="{ color: booking.handled ? '#2a9d8f' : '#ff6b6b' }">
            {{ booking.handled ? '✅ Đã xử lý' : '❌ Chưa xử lý' }}
          </span>
        </p>
        <button @click="Accept(index)" class="accept-btn" :disabled="booking.handled">
          {{ booking.handled ? 'Đã xác nhận' : 'Xác nhận' }}
        </button>
      </div>
    </div>

    <!-- Nếu không có lịch -->
    <div v-if="bookings.length === 0" class="empty-state">
      <p>Hiện tại chưa có lịch hẹn nào.</p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "DoctorBookingsPage",
  data() {
    return {
      bookings: [],
      booking: {
        name: "",
        date: "",
        phone: "",
        time: "",
        type: "",
        doctor: "",
        email: "",
        owner: "",
        handled: "",
      },
      doctor: {},
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const staffRes = await apiClient.get(`/api/doctor/${id}`);
      this.doctor = staffRes.data;

      const appointmentsRes = await apiClient.get(`/api/doctor/${id}/booking`);
      this.bookings = appointmentsRes.data;
    } catch (err) {
      console.log(err);
      alert("Lỗi tải dữ liệu");
    }
  },
  methods: {
    async Accept(index) {
      if (!confirm('Bạn có chắc muốn xác nhận lịch hẹn này?')) return;
      const booking = this.bookings[index];
      try {
        await apiClient.put(`/api/booking/${booking.id}`, {
          handled: true
        });
        this.bookings[index].handled = true;
      } catch (error) {
        console.error('Xác nhận thất bại:', error);
        alert('Xác nhận thất bại!');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.doctor-bookings-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.doctor-bookings-page::before {
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

.summary {
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

.booking-list {
  max-width: 900px;
  margin: 30px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.booking-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  animation: slideUp 0.5s ease forwards;
  border-left: 4px solid #2a9d8f;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.booking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.booking-card p {
  margin: 10px 0;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(42, 157, 143, 0.1);
  padding-bottom: 8px;
}

.booking-card p:last-child {
  border-bottom: none;
}

.booking-card strong {
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
  .doctor-bookings-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .intro-text {
    font-size: 1rem;
  }
  .summary {
    font-size: 1.1rem;
    padding: 12px;
  }
  .booking-card p {
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
  .booking-card {
    padding: 15px;
  }
  .booking-card p {
    font-size: 0.95rem;
  }
  .accept-btn {
    font-size: 0.9rem;
    padding: 8px 15px;
  }
}
</style>