<template>
  <div class="feedback-page">
    <h1 class="animate-pulse">🌟 Gửi phản hồi của bạn</h1>
    <form @submit.prevent="submitFeedback" class="feedback-form">
      <!-- Tên -->
      <div class="form-group">
        <label for="name">👤 Tên của bạn</label>
        <input v-model="form.name" type="text" id="name" required placeholder="Nhập tên của bạn" />
      </div>

      <!-- Email -->
      <div class="form-group">
        <label for="email">📧 Email</label>
        <input v-model="form.email" type="email" id="email" required placeholder="Nhập email của bạn" />
      </div>

      <!-- Chức vụ -->
      <div class="form-group">
        <label>🎯 Chức vụ:</label>
        <select v-model="form.position" required>
          <option disabled value="">-- Chọn chức vụ --</option>
          <option value="staff">Nhân viên</option>
          <option value="doctor">Bác Sĩ</option>
        </select>
      </div>

      <!-- Danh sách bác sĩ -->
      <div v-if="form.position === 'doctor'" class="form-group">
        <label>👩‍⚕️ Bác sĩ:</label>
        <select v-model="form.doctor_id" required>
          <option disabled value="">-- Chọn bác sĩ --</option>
          <option v-for="doctor in doctorList" :key="doctor.id" :value="doctor.id.toString()">
            {{ doctor.name }}
          </option>
        </select>
      </div>

      <!-- Danh sách nhân viên -->
      <div v-if="form.position === 'staff'" class="form-group">
        <label>👨‍💼 Chọn nhân viên:</label>
        <select v-model="form.staff_id" required>
          <option disabled value="">-- Chọn nhân viên --</option>
          <option v-for="staff in staffList" :key="staff.id" :value="staff.id.toString()">
            {{ staff.name }}
          </option>
        </select>
      </div>

      <!-- Đánh giá -->
      <div class="rating-box">
        <h2 class="rating-title">🌟 Đánh giá của bạn</h2>
        <div class="rating-display">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ active: star <= form.rating, hover: star <= hover }"
            @click="form.rating = star"
            @mouseover="hover = star"
            @mouseleave="hover = 0"
          >
            {{ star <= (hover || form.rating) ? '★' : '☆' }}
          </span>
        </div>
        <p class="rating-text" v-if="form.rating > 0">
          Bạn đã chọn: {{ form.rating }} sao
        </p>
      </div>

      <!-- Nội dung phản hồi -->
      <div class="form-group">
        <label for="message">💬 Nội dung phản hồi</label>
        <textarea v-model="form.message" id="message" rows="5" required placeholder="Nhập nội dung phản hồi của bạn"></textarea>
      </div>

      <!-- Submit -->
      <button type="submit" class="submit-btn">📨 Gửi phản hồi</button>
    </form>

    <!-- Thông báo thành công -->
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
import apiClient from "@/service/axios";

export default {
  name: "FeedbackPage",
  data() {
    return {
      form: {
        name: "",
        email: "",
        message: "",
        position: "",
        staff_id: "",
        doctor_id: "",
        user_id: "",
        rating: 0,
      },
      doctorList: [],
      staffList: [],
      successMessage: "",
      hover: 0,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    async fetchUser() {
      try {
        const res = await apiClient.get("/api/user");

        const users = Array.isArray(res.data) ? res.data : res.data.data;

        if (!Array.isArray(users)) {
          throw new Error("Dữ liệu trả về không đúng định dạng mảng.");
        }

        this.doctorList = users.filter((u) => u.role === "doctor");
        this.staffList = users.filter((u) => u.role === "staff");
      } catch (error) {
        console.error("Lỗi tải danh sách người dùng:", error);
        alert("Không thể tải danh sách người dùng.");
      }
    },

    async submitFeedback() {
      try {
        // Gán user_id theo vị trí chọn
        this.form.user_id =
          this.form.position === "doctor"
            ? this.form.doctor_id
            : this.form.staff_id;

        // Gửi API
        await apiClient.post("/api/feedback", this.form, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        this.successMessage = "✅ Phản hồi đã được gửi thành công!";

        // Reset form
        this.form = {
          name: "",
          email: "",
          message: "",
          position: "",
          staff_id: "",
          doctor_id: "",
          user_id: "",
          rating: 0,
        };
      } catch (error) {
        console.error("Lỗi gửi phản hồi:", error);
        alert("Gửi phản hồi thất bại: " + (error.response?.data?.message || error.message));
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.feedback-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 60px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.feedback-page::before {
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
  font-size: 3rem;
  font-weight: 600;
  color: #2a9d8f;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto 50px;
  background: rgba(255, 255, 255, 0.97);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.8s ease forwards;
  backdrop-filter: blur(8px);
}

.form-group {
  margin-bottom: 25px;
  position: relative;
}

label {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  text-align: left;
  display: block;
}

input, textarea, select {
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #f9f9f9;
  font-size: 1.1rem;
  color: #333;
  width: 100%;
  transition: all 0.3s ease;
}

input:focus, textarea:focus, select:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

select {
  cursor: pointer;
}

/* Rating styles */
.rating-box {
  text-align: center;
  margin: 30px 0;
  background: rgba(255, 255, 255, 0.8);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.rating-title {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: #f28c38;
  font-weight: 600;
}

.rating-display {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.star {
  font-size: 2.5rem;
  color: #e0e0e0;
  cursor: pointer;
  transition: all 0.3s ease;
  transform-origin: center;
}

.star.hover,
.star:hover {
  transform: scale(1.2);
  color: #f28c38;
}

.star.active {
  color: #f28c38;
  transform: scale(1.1);
}

.rating-text {
  font-size: 1.1rem;
  color: #f28c38;
  font-weight: 600;
  margin-top: 10px;
}

.submit-btn {
  margin-top: 30px;
  padding: 14px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.submit-btn:hover::before {
  width: 300px;
  height: 300px;
}

.submit-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(42, 157, 143, 0.5);
}

.success-message {
  max-width: 600px;
  margin: 30px auto 0;
  padding: 25px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  text-align: center;
  animation: fadeIn 0.8s ease;
  border-left: 5px solid #2a9d8f;
}

.success-message p {
  font-size: 1.3rem;
  color: #2a9d8f;
  font-weight: 600;
  line-height: 1.6;
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
  .feedback-page {
    padding: 30px 15px;
  }
  h1 {
    font-size: 2.4rem;
  }
  .feedback-form {
    padding: 25px;
    max-width: 90%;
  }
  .rating-display {
    gap: 5px;
  }
  .star {
    font-size: 2rem;
  }
  .success-message {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 2rem;
  }
  .feedback-form {
    padding: 20px;
  }
  input, textarea, select, .submit-btn {
    font-size: 1rem;
    padding: 12px;
  }
  .success-message p {
    font-size: 1.1rem;
  }
  .rating-box {
    padding: 20px;
  }
}
</style>