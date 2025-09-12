<template>
  <div class="hotel-detail-page">
    <h1 class="animate-pulse">🏨 Chi Tiết Phòng Khách Sạn</h1>

    <div v-if="room" class="room-detail-card">
      <h2>{{ room.name }}</h2>
      <img :src="room.image" alt="Ảnh phòng" class="room-image" />
      <p class="description">{{ room.description }}</p>
      <p class="price">Giá: <strong>{{ room.price }} VNĐ / ngày</strong></p>
      <button class="confirm-btn-book" @click="showBookingForm = true">🏠 Đặt Ngay</button>
    </div>

    <div v-else class="loading">
      <p>⏳ Đang tải thông tin phòng...</p>
    </div>
    <!-- Form đặt phòng -->
    <div v-if="showBookingForm" class="booking-modal-overlay">
      <div class="booking-modal">
        <h3>📝 Điền Thông Tin Đặt Phòng</h3>
        <input v-model="bookingroom.name" placeholder="Họ tên" />
        <input v-model="bookingroom.phone" placeholder="Số điện thoại" />
        <input v-model="bookingroom.email" placeholder="Email" />
        <input type="date" v-model="bookingroom.check_in" />
        <input type="time" v-model="bookingroom.check_in_time" placeholder="Giờ nhận phòng" />
        <input type="date" v-model="bookingroom.check_out" />
        <input type="time" v-model="bookingroom.check_out_time" placeholder="Giờ trả phòng" />

        <div class="modal-actions">
          <button @click="submitBooking" class="confirm-btn">✅ Xác nhận</button>
          <button @click="showBookingForm = false" class="cancel-btn">❌ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HotelDetailPage",
  data() {
    return {
      room: null,
      showBookingForm: false,
      bookingroom: {
        name: "",
        phone: "",
        email: "",
        check_in: "",
        check_in_time: "",
        check_out: "",
        check_out_time: "",
        total_price: 0,
      },
    };
  },
  mounted() {
    const id = this.$route.params.id;
    fetch(`http://localhost:8000/api/hotel/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.message) {
          this.room = data;
        } else {
          alert("Không tìm thấy phòng!");
          this.$router.push("/");
        }
      })
      .catch(() => {
        alert("Lỗi khi tải dữ liệu phòng!");
        this.$router.push("/");
      });
  },
  methods: {
    async submitBooking() {
      try {
        const check_in = new Date(this.bookingroom.check_in);
        const check_out = new Date(this.bookingroom.check_out);
        const timeDiff = check_out - check_in

        if (timeDiff <= 0) {
          alert("❌ Ngày trả phòng phải sau ngày nhận phòng!");
          return;
        }

        const payload = {
          hotel_id: this.room.id,
          name: this.bookingroom.name,
          phone: this.bookingroom.phone,
          email: this.bookingroom.email,
          check_in: this.bookingroom.check_in,
          check_out: this.bookingroom.check_out,
          check_in_time: this.bookingroom.check_in_time,
          check_out_time: this.bookingroom.check_out_time,
        };

        const response = await fetch("http://localhost:8000/api/bookinghotel", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(
            Object.values(data.errors || {}).flat().join("\n") ||
            data.message ||
            "Lỗi khi gửi yêu cầu đặt phòng"
          );
        }

        alert("✅ Đặt phòng thành công!");
        this.bookingroom = {
          name: "",
          phone: "",
          email: "",
          check_in: "",
          check_in_time: "",
          check_out: "",
          check_out_time: "",
        };
        this.showBookingForm = false;

      } catch (error) {
        alert("❌ Đặt lịch thất bại: " + error.message);
      }
    }
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.hotel-detail-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 60px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.hotel-detail-page::before {
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
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.room-detail-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.8s ease forwards;
  position: relative;
  overflow: hidden;
}

.room-detail-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.room-detail-card h2 {
  font-size: 2.2rem;
  color: #2a9d8f;
  margin-bottom: 20px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.room-image {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 15px;
  margin-bottom: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s ease;
}

.room-image:hover {
  transform: scale(1.02);
}

.description {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.7;
  text-align: justify;
  background: rgba(42, 157, 143, 0.05);
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #2a9d8f;
}

.price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f28c38;
  margin-bottom: 25px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.confirm-btn-book {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.confirm-btn-book::before {
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

.confirm-btn-book:hover::before {
  width: 300px;
  height: 300px;
}

.confirm-btn-book:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.loading {
  text-align: center;
  font-size: 1.3rem;
  color: #4a4a4a;
  margin-top: 60px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
}

.booking-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.3s ease;
}

.booking-modal {
  background: rgba(255, 255, 255, 0.98);
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease;
  position: relative;
  overflow: hidden;
}

.booking-modal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.booking-modal h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2a9d8f;
  font-size: 1.5rem;
  font-weight: 600;
}

.booking-modal input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  font-size: 1rem;
  color: #333;
  transition: all 0.3s ease;
}

.booking-modal input:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}

.confirm-btn,
.cancel-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.confirm-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.cancel-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
  .hotel-detail-page {
    padding: 30px 15px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .room-detail-card {
    padding: 20px;
  }
  .room-image {
    height: 250px;
  }
  .booking-modal {
    width: 95%;
    padding: 20px;
  }
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .room-detail-card h2 {
    font-size: 1.8rem;
  }
  .price {
    font-size: 1.5rem;
  }
  .confirm-btn-book {
    padding: 12px 20px;
    font-size: 1rem;
  }
  .booking-modal input {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>