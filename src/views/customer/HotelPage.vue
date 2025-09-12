<template>
  <div class="hotel-page">
    <h1 class="animate-pulse">🏨 Khách sạn Thú Cưng</h1>
    <p class="intro-text">
      Chúng tôi cung cấp các dịch vụ chăm sóc thú cưng với không gian thoải mái và an toàn cho thú cưng của bạn.
    </p>

    <section class="rooms">
      <h2 class="emoji-glow">Phòng dành cho thú cưng</h2>
      <div class="room-list">
        <div
          v-for="room in rooms"
          :key="room.id"
          class="room"
          @click="viewRoomDetail(room.id)"
        >
          <img :src="room.image" :alt="room.name" class="room-image" />
          <h3>{{ room.name }}</h3>
          <p>{{ room.description }}</p>
          <p>Giá: <strong>{{ formatPrice(room.price) }}/ngày</strong></p>
          <button class="btn-detail">Xem chi tiết</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "HotelPage",
  data() {
    return {
      rooms: []
    };
  },
  created() {
    apiClient.get('/api/hotel') 
      .then(res => this.rooms = res.data)
      .catch(err => console.error(err));
  },
  methods: {
    viewRoomDetail(id) {
      this.$router.push(`/hotel/${id}`);
    },
    formatPrice(price) {
      return Number(price).toLocaleString('vi-VN') + 'đ';
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.hotel-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 40px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.hotel-page::before {
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

.intro-text {
  font-size: 1.2rem;
  color: #4a4a4a;
  margin-bottom: 40px;
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 1s ease-in-out;
}

.rooms {
  margin-top: 40px;
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  animation: slideUp 0.8s ease forwards;
}

h2 {
  font-size: 2rem;
  color: #f28c38;
  margin-bottom: 25px;
  text-align: center;
}

.emoji-glow:hover {
  transform: scale(1.15);
  text-shadow: 0 0 10px rgba(242, 140, 56, 0.5);
  transition: all 0.3s ease;
}

.room-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  justify-content: center;
}

.room {
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.room:hover {
  transform: translateY(-8px);
  background: linear-gradient(145deg, #f9f9f9, #e8f0ff);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.room-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
  transition: transform 0.4s ease;
}

.room:hover .room-image {
  transform: scale(1.08);
}

.room h3 {
  font-size: 1.4rem;
  color: #2a9d8f;
  font-weight: 600;
  margin: 10px 0;
}

.room p {
  font-size: 1.1rem;
  color: #333;
  margin: 8px 0;
}

.room p strong {
  color: #f28c38;
}

.btn-detail {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.btn-detail::before {
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

.btn-detail:hover::before {
  width: 200px;
  height: 200px;
}

.btn-detail:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(42, 157, 143, 0.4);
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
  .hotel-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .intro-text {
    font-size: 1.1rem;
    max-width: 600px;
  }
  .room-list {
    grid-template-columns: 1fr;
  }
  .room-image {
    height: 160px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  h2 {
    font-size: 1.6rem;
  }
  .room {
    padding: 15px;
  }
  .btn-detail {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>