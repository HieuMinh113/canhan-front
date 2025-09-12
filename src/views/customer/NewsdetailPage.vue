<template>
  <div class="news-detail-page">
    <div v-if="loading" class="loading">⏳ Đang tải chi tiết tin tức...</div>
    <div v-else-if="error" class="error">❌ {{ error }}</div>
    <div v-else>
      <h1 class="news-title">{{ news.title }}</h1>
      <p><strong> {{ formatDate(news.updated_at) }}</strong></p>
      <img :src="news.image" alt="Ảnh tin tức" class="news-image" />
      <p>{{ news.description }}</p>
    </div>
    <button class="showNewsdetail" @click="$router.push('/news')">⬅ Quay lại tin tức</button>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "NewsDetailPage",
  data() {
    return {
      news: {},
      loading: true,
      error: null,
    };
  },
  created() {
    this.fetchNewsDetail();
  },
  methods: {
    fetchNewsDetail() {
      const id = this.$route.params.id;
      apiClient.get(`http://localhost:8000/api/news/${id}`)
        .then(res => {
          this.news = {
            image: res.data.image,
            title: res.data.title,
            updated_at: res.data.updated_at,
            description: res.data.description,
            created_at: res.data.created_at,
          };
          this.loading = false;
        })
        .catch(err => {
          this.error = "Không tìm thấy bài viết.";
          this.loading = false;
          console.error(err);
        });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fredoka&display=swap");

.news-detail-page {
  font-family: "Fredoka", sans-serif;
  max-width: 960px;
  margin: 40px auto;
  padding: 20px;
  background: linear-gradient(to bottom, #fffaf0, #fce4ec);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.4s ease;
}

.news-title {
  font-size: 2rem;
  color: #e91e63;
  margin-bottom: 16px;
}

.news-meta {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 24px;
}

.news-content {
  font-size: 1.1rem;
  color: #444;
  line-height: 1.6;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  border-left: 6px solid #ff69b4;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.news-content ul,
.news-content ol {
  padding-left: 20px;
  margin-top: 10px;
  margin-bottom: 20px;
}

.news-content li {
  margin-bottom: 8px;
}

.showNewsdetail {
  background-color: #ff69b4;
  color: #fff;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.showNewsdetail:hover {
  background-color: #e91e63;
}

.loading,
.error {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 40px 0;
}

.error {
  color: #c62828;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
