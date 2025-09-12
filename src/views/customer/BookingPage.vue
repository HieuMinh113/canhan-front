<template>
  <div class="booking-page">
    <h1 class="animate-pulse">📅 Đặt lịch khám cho thú cưng</h1>
    <form @submit.prevent="submitBooking" class="booking-form">
      <label for="name">🐾 Tên thú cưng:</label>
      <input type="text" id="name" v-model="booking.name" required />

      <label>🐶 Loại thú cưng:</label>
      <select v-model="booking.type" required>
        <option disabled value="">-- Chọn loại --</option>
        <option value="dog">Chó</option>
        <option value="cat">Mèo</option>
        <option value="other">Khác</option>
      </select>

      <label>👤 Tên chủ:</label>
      <input type="text" id="owner" v-model="booking.owner" required />

      <label>📧 Email:</label>
      <input type="text" id="email" v-model="booking.email" required />

      <label>📞 Số điện thoại:</label>
      <input type="tel" id="phone" v-model="booking.phone" required pattern="[0-9]{10}" />

      <label>🗓️ Ngày khám:</label>
      <input type="date" id="date" v-model="booking.date" required />

      <label>⏰ Giờ khám:</label>
      <input type="time" id="time" v-model="booking.time" required />

      <label for="doctor">👩‍⚕️ Bác sĩ:</label>
      <select v-model="booking.doctor_id" required>
        <option disabled value="">-- Chọn nhân viên --</option>
        <option v-for="doctor in doctorList" :value="doctor.id.toString()" :key="doctor.id">
          {{ doctor.name }}
        </option>
      </select>

      <button type="submit">📨 Gửi yêu cầu</button>
    </form>

    <p v-if="bookingSubmitted" class="success-message">
      ✅ Lịch khám đã được gửi! Chúng tôi sẽ liên hệ bạn sớm nhất!
    </p>

    <div class="history-section" v-if="History.length > 0">
      <h2>📋 Lịch sử đặt lịch</h2>
      <ul>
        <li v-for="(item, index) in History" :key="index">
          🐾 <strong>{{ item.name }}</strong> ({{ getServiceName(item.type) }}) -
          {{ formatDate(item.date) }} lúc {{ item.time }} |
          Bác sĩ: {{ item.doctor }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookingPage",
  data() {
    return {
      doctorList: [],
      booking: {
        name: '',
        type: '',
        owner: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        doctor_id: ''
      },
      bookingSubmitted: false,
      History: []
    };
  },
  methods: {
    async submitBooking() {
      try {
        const response = await fetch('http://localhost:8000/api/booking', {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(this.booking),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Lỗi khi đặt lịch");
        }
        const selectedDoctor = this.doctorList.find(
          doc => doc.id.toString() === this.booking.doctor_id
        );

        const newBooking = {
          ...this.booking,
          doctor: selectedDoctor ? selectedDoctor.name : "Không rõ"
        };

        this.History.push(newBooking);
        localStorage.setItem("bookingHistory", JSON.stringify(this.History));
        this.bookingSubmitted = true;

        this.booking = {
          name: '',
          type: '',
          owner: '',
          email: '',
          phone: '',
          date: '',
          time: '',
          doctor_id: ''
        };
      } catch (error) {
        alert("❌ Đặt lịch thất bại: " + error.message);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    },
    getServiceName(code) {
      switch (code) {
        case "dog": return "Chó";
        case "cat": return "Mèo";
        case "other": return "Khác";
        default: return code;
      }
    },
    loadHistory() {
      const stored = localStorage.getItem("bookingHistory");
      if (stored) {
        this.History = JSON.parse(stored);
      }
    }
  },
  mounted() {
    this.loadHistory();
    fetch("http://localhost:8000/api/doctor-booking")
      .then(res => res.json())
      .then(data => this.doctorList = data)
      .catch(err => console.error("Lỗi tải doctor:", err));
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.booking-page {
  max-width: 700px;
  margin: 40px auto;
  padding: 40px;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Fredoka', sans-serif;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.booking-page::before {
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
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.booking-form {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.8s ease forwards;
}

label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-top: 15px;
  text-align: left;
}

input, select {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 1rem;
  color: #333;
  margin-top: 5px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus, select:focus {
  border-color: #2a9d8f;
  outline: none;
  box-shadow: 0 0 5px rgba(42, 157, 143, 0.5);
}

button {
  margin-top: 25px;
  padding: 12px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

button::before {
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

button:hover::before {
  width: 200px;
  height: 200px;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(42, 157, 143, 0.4);
}

.success-message {
  margin-top: 20px;
  text-align: center;
  font-size: 1.2rem;
  color: #2a9d8f;
  font-weight: 600;
  animation: fadeIn 1s ease-in-out;
}

.history-section {
  margin-top: 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.8s ease forwards;
}

.history-section h2 {
  font-size: 2rem;
  color: #f28c38;
  margin-bottom: 15px;
  text-align: center;
}

.history-section ul {
  list-style-type: none;
  padding: 0;
}

.history-section li {
  font-size: 1.1rem;
  color: #333;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.history-section li:last-child {
  border-bottom: none;
}

.history-section li strong {
  color: #2a9d8f;
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
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
  .booking-page {
    padding: 20px;
    margin: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .booking-form {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .history-section h2 {
    font-size: 1.6rem;
  }
  input, select, button {
    font-size: 0.9rem;
    padding: 10px;
  }
}
</style>