<template>
  <div class="appointments-page">
    <h1 class="animate-pulse">📅 Lịch chăm sóc thú cưng</h1>
    <p class="subtitle">Chọn ngày và giờ để đặt lịch chăm sóc cho thú cưng của bạn.</p>

    <!-- Form để đặt lịch -->
    <form @submit.prevent="submitAppointment" class="appointment-form">
      <label for="name">🐾 Tên thú cưng:</label>
      <input type="text" id="name" v-model="appointment.name" required />

      <label for="owner">👤 Tên chủ:</label>
      <input type="text" id="owner" v-model="appointment.owner" required />

      <label for="email">📧 Email:</label>
      <input type="email" id="email" v-model="appointment.email" required />

      <label for="date">🗓️ Chọn ngày:</label>
      <input type="date" id="date" v-model="appointment.date" required />

      <label for="time">⏰ Chọn giờ:</label>
      <input type="time" id="time" v-model="appointment.time" required />

      <label for="service">🛀 Dịch vụ:</label>
      <select v-model="appointment.service_id" required>
        <option disabled value="">Chọn Dịch Vụ</option>
        <option v-for="service in services" :value="service.id.toString()" :key="service.id">
          {{ service.name }} 
        </option>
      </select>

      <label for="staff">👩‍⚕️ Chọn nhân viên:</label>
      <select v-model="appointment.staff_id" required>
        <option disabled value="">-- Chọn nhân viên --</option>
        <option v-for="staff in staffList" :value="staff.id.toString()" :key="staff.id">
          {{ staff.name }}
        </option>
      </select>

      <button type="submit">📨 Đặt lịch</button>
    </form>

    <!-- Thông báo thành công -->
    <p v-if="appointmentSubmitted" class="success-message">
      ✅ Lịch chăm sóc đã được đặt thành công!
    </p>

    <!-- Lịch sử -->
    <div v-if="history.length > 0" class="history-section">
      <h2 class="emoji-glow">🕓 Lịch sử đặt lịch</h2>
      <ul>
        <li v-for="(item, index) in history" :key="index">
          🐾 <strong>{{ item.name }}</strong> - {{ formatDate(item.date) }} lúc {{ item.time }} ({{ getServiceName(item.service_id) }})
          | Nhân viên: {{ getStaffName(item.staff_id) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppointmentsPage",
  data() {
    return {
      staffList: [],
      services: [],
      appointment: {
        name: "",
        date: "", 
        time: "",
        service_id: "",
        staff_id: "",
        email: "",
        owner: "", 
      },
      appointmentSubmitted: false,
      history: []
    };
  },
  methods: {
    async submitAppointment() {
      try {
        const response = await fetch("http://localhost:8000/api/appointment", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(this.appointment),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Lỗi khi gửi yêu cầu đặt lịch");
        }
        const newAppointment = { ...this.appointment };
        this.history.push(newAppointment);
        localStorage.setItem("appointmentHistory", JSON.stringify(this.history));
        this.appointmentSubmitted = true;

        this.appointment = {
          name: "",
          date: "",
          time: "",
          service_id: "",
          staff_id: "",
          email: "",
          owner: "", 
        };
      } catch (error) {
        alert("❌ Đặt lịch thất bại: " + error.message);
      }
    },

    formatDate(dateStr) {
      return new Date(dateStr).toLocaleDateString("vi-VN");
    },
    loadHistory() {
      const stored = localStorage.getItem("appointmentHistory");
      if (stored) {
        this.history = JSON.parse(stored);
      }
    },
    getServiceName(id) {
      const service = this.services.find(s => s.id.toString() === id.toString());
      return service ? service.name : '';
    },
    getStaffName(id) {
      const staff = this.staffList.find(s => s.id.toString() === id.toString());
      return staff ? staff.name : '';
    }
  },
  mounted() {
    this.loadHistory();
    fetch("http://localhost:8000/api/staff-appointment")
      .then(res => res.json())
      .then(data => this.staffList = data)
      .then(() => fetch("http://localhost:8000/api/service"))
      .then(res => res.json())
      .then(data => this.services = data)
      .catch(err => console.error("Lỗi tải staff:", err));
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.appointments-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 40px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.appointments-page::before {
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
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.subtitle {
  font-size: 1.2rem;
  color: #4a4a4a;
  margin-bottom: 30px;
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 1s ease-in-out;
}

.appointment-form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto 40px;
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
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
}

.history-section {
  max-width: 800px;
  margin: 40px auto 0;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  animation: slideUp 0.8s ease forwards;
}

.emoji-glow:hover {
  transform: scale(1.15);
  text-shadow: 0 0 10px rgba(242, 140, 56, 0.5);
  transition: all 0.3s ease;
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
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
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
  .appointments-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1.1rem;
    max-width: 600px;
  }
  .appointment-form {
    padding: 20px;
    max-width: 90%;
  }
  .history-section {
    padding: 15px;
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
  .history-section li {
    font-size: 1rem;
    flex-direction: column;
    gap: 5px;
  }
}
</style>