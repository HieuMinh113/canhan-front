<template>
  <div class="schedule-register">
    <h1 class="animate-pulse">📅 Đăng ký lịch làm / nghỉ</h1>
    <p class="intro-text">Quản lý lịch làm việc và ngày nghỉ của bạn một cách dễ dàng</p>

    <div v-for="(entry, index) in form.entries" :key="index" class="schedule-entry">
      <div class="form-group">
        <label for="date">Ngày:</label>
        <input :id="'date-' + index" type="date" v-model="entry.date" required />
      </div>
      <div class="form-group">
        <label for="type">Trạng thái:</label>
        <select :id="'type-' + index" v-model="entry.type" required>
          <option value="" disabled>-- Chọn trạng thái --</option>
          <option value="Làm việc">Làm việc</option>
          <option value="Nghỉ">Nghỉ</option>
        </select>
      </div>
      <button v-if="form.entries.length > 1" @click="removeEntry(index)" class="remove-btn">🗑 Xóa</button>
    </div>

    <div class="action-buttons">
      <button @click="addEntry" class="add-btn">➕ Thêm ngày</button>
      <button @click="submitSchedule" class="submit-btn">💾 Gửi đăng ký</button>
    </div>

    <p v-if="submitted" class="success animate-pulse">✅ Đăng ký thành công!</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '@/service/axios'

const form = ref({
  entries: [{ date: '', type: '' }]
})
const submitted = ref(false)

function addEntry() {
  form.value.entries.push({ date: '', type: '' })
}

function removeEntry(index) {
  form.value.entries.splice(index, 1)
}

function submitSchedule() {
  const groupedByStatus = {}

  form.value.entries.forEach(entry => {
    if (entry.date && entry.type) {
      const statusKey = entry.type === 'Làm việc' ? 'work' : 'off'
      if (!groupedByStatus[statusKey]) {
        groupedByStatus[statusKey] = []
      }
      groupedByStatus[statusKey].push(entry.date)
    }
  })

  const sendGroupedRequests = async () => {
    try {
      for (const [status, dates] of Object.entries(groupedByStatus)) {
        await apiClient.post('/api/work-schedule', {
          dates,
          status
        })
      }
      submitted.value = true
      form.value.entries = [{ date: '', type: '' }]
      setTimeout(() => {
        submitted.value = false
      }, 3000)
    } catch (error) {
      console.error('❌ Lỗi gửi:', error.response?.data || error)
      alert('Đăng ký thất bại!')
    }
  }

  sendGroupedRequests()
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.schedule-register {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f0f4ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.schedule-register::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://www.transparenttextures.com/patterns/paws.png') repeat;
  opacity: 0.1;
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

.schedule-entry {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  position: relative;
  border-left: 4px solid #2a9d8f;
  animation: slideUp 0.5s ease forwards;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9f9f9;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.remove-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.remove-btn::before {
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

.remove-btn:hover::before {
  width: 200px;
  height: 200px;
}

.remove-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.add-btn,
.submit-btn {
  padding: 12px 25px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.add-btn {
  background: linear-gradient(90deg, #f28c38, #ff8c42);
  color: #fff;
  box-shadow: 0 4px 15px rgba(242, 140, 56, 0.3);
}

.add-btn::before {
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

.add-btn:hover::before {
  width: 200px;
  height: 200px;
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 140, 56, 0.4);
}

.submit-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.submit-btn::before {
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

.submit-btn:hover::before {
  width: 200px;
  height: 200px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.success {
  text-align: center;
  color: #2a9d8f;
  font-size: 1.2rem;
  font-weight: 600;
  margin-top: 20px;
  padding: 15px;
  background: rgba(42, 157, 143, 0.1);
  border-radius: 10px;
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
  .schedule-register {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .intro-text {
    font-size: 1rem;
  }
  .schedule-entry {
    flex-direction: column;
    align-items: flex-start;
  }
  .form-group {
    width: 100%;
  }
  .remove-btn, .add-btn, .submit-btn {
    font-size: 1rem;
    padding: 10px 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .schedule-entry {
    padding: 15px;
  }
  .form-group label {
    font-size: 1rem;
  }
  .form-group input,
  .form-group select {
    font-size: 0.95rem;
    padding: 10px;
  }
  .success {
    font-size: 1.1rem;
  }
}
</style>