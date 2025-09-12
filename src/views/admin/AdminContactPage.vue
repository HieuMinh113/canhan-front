<template>
  <div class="contact-page">
    <h1 class="animate-pulse">📨 Quản lý Liên hệ</h1>
    <p class="subtitle">Danh sách các tin nhắn liên hệ từ khách hàng. Bạn có thể xem và xử lý phản hồi tại đây.</p>

    <!-- Tổng số -->
    <div class="summary-box">
      <p><strong>Tổng số liên hệ:</strong> {{ contacts.length }}</p>
    </div>

    <!-- Danh sách liên hệ -->
    <div class="contact-list">
      <div class="contact-card" v-for="(contact, index) in contacts" :key="index">
        <h3><strong>Tên:</strong> {{ contact.name }}</h3>
        <p><strong>Email:</strong> {{ contact.email }}</p>
        <p class="date">🕒 Ngày gửi: {{ formatDate(contact.created_at) }}</p>
        <p><strong>Tin nhắn:</strong> {{ contact.message }}</p>
        <button @click="Accept(index)" class="accept-btn">✅ Xác nhận liên hệ</button>
      </div>
    </div>

    <!-- Hiển thị khi không có dữ liệu -->
    <div v-if="contacts.length === 0" class="empty-state">
      <p>Hiện chưa có liên hệ nào. Hãy chờ khách hàng gửi tin nhắn!</p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "AdminContactPage",
  data() {
    return {
      contacts: [],
    };
  },
  async created() {
    try {
      const res = await apiClient.get('http://localhost:8000/api/contact');
      this.contacts = res.data;
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu liên hệ:", err);
      alert('Không thể tải danh sách liên hệ. Vui lòng thử lại!');
    }
  },
  methods: {
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('vi-VN', options);
    },
    async Accept(index) {
      if (!confirm('Bạn có chắc muốn xác nhận tin nhắn này?')) return;
      const contact = this.contacts[index];
      try {
        await apiClient.delete(`http://localhost:8000/api/contact/${contact.id}`);
        this.contacts.splice(index, 1);
        alert('Xác nhận liên hệ thành công!');
      } catch (error) {
        console.error('Xóa thất bại:', error);
        alert('Lỗi khi xác nhận liên hệ!');
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.contact-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-page::before {
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

.contact-list {
  max-width: 850px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.contact-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.5s ease forwards;
}

.contact-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.contact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.contact-card h3 {
  margin-bottom: 12px;
  color: #2a9d8f;
  font-size: 1.3rem;
  font-weight: 600;
}

.contact-card p {
  margin: 8px 0;
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
  text-align: left;
}

.contact-card .date {
  font-style: italic;
  color: #888;
  font-size: 0.95rem;
}

.accept-btn {
  background: linear-gradient(90deg, #43a047, #8bc34a);
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
  box-shadow: 0 4px 15px rgba(67, 160, 71, 0.3);
  margin-top: 12px;
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

.accept-btn:hover::before {
  width: 200px;
  height: 200px;
}

.accept-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 160, 71, 0.4);
  background: linear-gradient(90deg, #388e3c, #cddc39);
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
  .contact-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .contact-card {
    padding: 16px;
  }
  .contact-card h3 {
    font-size: 1.2rem;
  }
  .contact-card p {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .contact-card h3 {
    font-size: 1.1rem;
  }
  .contact-card p {
    font-size: 0.9rem;
  }
  .accept-btn {
    font-size: 1rem;
    padding: 10px;
    width: 100%;
  }
}
</style>