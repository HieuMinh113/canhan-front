<template>
  <div class="admin-banner-page">
    <h1 class="animate-pulse">🖼️ Quản lý Banner</h1>
    <p class="subtitle">Quản lý các banner quảng cáo trên trang chủ</p>

    <!-- Form thêm banner -->
    <form @submit.prevent="saveBanner" class="banner-form">
      <div class="form-group">
        <label for="link">🔗 Link khi click (tùy chọn):</label>
        <input type="url" id="link" v-model="form.link" placeholder="https://example.com" />
      </div>
      <div class="form-group">
        <label for="image">📸 Chọn ảnh banner:</label>
        <input type="file" id="image" @change="handleFile" accept="image/*" />
        <div v-if="selectedFile" class="file-preview">
          <p>✅ Đã chọn: {{ selectedFile.name }}</p>
        </div>
      </div>
      <button type="submit" class="save-btn">➕ Thêm Banner</button>
    </form>

    <hr class="divider" />

    <!-- Danh sách banner -->
    <div class="banners-list">
      <div v-for="banner in banners" :key="banner.id" class="banner-item">
        <a :href="banner.link" target="_blank" class="banner-link">
          <img :src="banner.image" class="banner-preview" />
          <span v-if="banner.link" class="link-indicator">🔗</span>
        </a>
        <div class="banner-actions">
          <button @click="deleteBanner(banner.id)" class="delete-btn">🗑 Xóa</button>
        </div>
      </div>
    </div>

    <!-- Nếu không có banner -->
    <div v-if="banners.length === 0" class="empty-state">
      <p>Chưa có banner nào. Hãy thêm banner đầu tiên!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiClient from '@/service/axios' 

const banners = ref([])
const form = ref({ link: '', image: '' })
const selectedFile = ref(null)

const getBanners = async () => {
  const { data } = await apiClient.get('/api/banners')
  banners.value = data
}

const handleFile = (e) => {
  selectedFile.value = e.target.files[0]
}

const saveBanner = async () => {
  if (!selectedFile.value) {
    alert('Vui lòng chọn ảnh')
    return
  }

  const fd = new FormData()
  fd.append('image', selectedFile.value)
  const uploadRes = await apiClient.post('/api/banneruploadImage', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  form.value.image = uploadRes.data.url

  await apiClient.post('/api/banners', form.value)

  form.value = { link: '', image: '' }
  selectedFile.value = null

  await getBanners()
}

const deleteBanner = async (id) => {
  if (confirm('Bạn có chắc chắn muốn xóa banner này?')) {
    await apiClient.delete(`/api/banners/${id}`)
    await getBanners()
  }
}

onMounted(getBanners)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-banner-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.admin-banner-page::before {
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

.banner-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  margin: 0 auto 30px;
  animation: slideUp 0.8s ease forwards;
  position: relative;
  overflow: hidden;
}

.banner-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

.form-group label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group input[type="url"],
.form-group input[type="file"] {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  font-size: 1rem;
  color: #333;
  transition: all 0.3s ease;
}

.form-group input[type="url"]:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.form-group input[type="file"] {
  cursor: pointer;
}

.file-preview {
  margin-top: 8px;
  padding: 10px;
  background: rgba(42, 157, 143, 0.1);
  border-radius: 8px;
  font-size: 0.95rem;
  color: #2a9d8f;
}

.save-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 15px 30px;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
  width: 100%;
}

.save-btn::before {
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

.save-btn:hover::before {
  width: 300px;
  height: 300px;
}

.save-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  margin: 30px auto;
  width: 80%;
  border: none;
  border-radius: 2px;
}

.banners-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.banner-item {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
  position: relative;
  animation: slideUp 0.5s ease forwards;
}

.banner-link {
  display: block;
  position: relative;
  flex: 1;
}

.banner-preview {
  max-width: 300px;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.banner-preview:hover {
  transform: scale(1.02);
}

.link-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(42, 157, 143, 0.8);
  color: #fff;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.banner-actions {
  display: flex;
  align-items: center;
}

.delete-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.delete-btn::before {
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

.delete-btn:hover::before {
  width: 200px;
  height: 200px;
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
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
  .admin-banner-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .banner-form {
    padding: 20px;
  }
  .banner-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .banner-preview {
    max-width: 100%;
    height: auto;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .banner-form .form-group label {
    font-size: 1rem;
  }
  .banner-form input {
    font-size: 0.9rem;
    padding: 10px;
  }
  .save-btn, .delete-btn {
    font-size: 1rem;
    padding: 12px;
  }
}
</style>