<template>
  <div class="news-page">
    <h1 class="animate-pulse">📰 Tin Tức Thú Cưng</h1>

    <div class="news-list">
      <div v-for="news in newsList" :key="news.id" class="news-item">
        <h2>{{ news.title }}</h2>
        <p class="date">🗓️ {{ formatDate(news.created_at) }}</p>
        <p class="summary">{{ news.summary }}</p>
        <button class="showNewsdetail" @click="showNewsDetail(news.id)">📖 Xem chi tiết</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: "NewsPage",
  data() {
    return {
      newsList: [],
    };
  },
  created() {
    axios.get('/api/news')
      .then(res => this.newsList = res.data)
      .catch(err => console.error(err));
  },
  methods: {
    formatDate(dateStr) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateStr).toLocaleDateString('vi-VN', options);
    },
    showNewsDetail(id) {
      this.$router.push(`/news/${id}`);
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.news-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 40px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.news-page::before {
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

.news-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 800px;
  margin: 0 auto;
}

.news-item {
  background: rgba(255, 255, 255, 0.95);
  border-left: 6px solid #f28c38;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.8s ease forwards;
}

.news-item:nth-child(1) { animation-delay: 0.1s; }
.news-item:nth-child(2) { animation-delay: 0.2s; }
.news-item:nth-child(3) { animation-delay: 0.3s; }
.news-item:nth-child(4) { animation-delay: 0.4s; }

.news-item:hover {
  transform: translateY(-8px);
  background: linear-gradient(145deg, #f9f9f9, #e8f0ff);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.news-item h2 {
  font-size: 1.8rem;
  color: #2a9d8f;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.4;
}

.date {
  font-size: 1rem;
  color: #f28c38;
  margin-bottom: 15px;
  font-weight: 500;
}

.summary {
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 20px;
  line-height: 1.6;
}

.showNewsdetail {
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

.showNewsdetail::before {
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

.showNewsdetail:hover::before {
  width: 200px;
  height: 200px;
}

.showNewsdetail:hover {
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
  .news-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .news-item {
    padding: 20px;
  }
  .news-item h2 {
    font-size: 1.5rem;
  }
  .summary {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .news-item h2 {
    font-size: 1.3rem;
  }
  .showNewsdetail {
    padding: 8px 16px;
    font-size: 0.9rem;
  }
}
</style>