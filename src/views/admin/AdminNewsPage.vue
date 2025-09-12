<template>
  <div class="admin-news-page">
    <h1 class="animate-pulse">📰 Quản lý Tin tức</h1>
    <p class="subtitle">Quản lý các bài viết tin tức và thông báo cho khách hàng</p>

    <button class="add-button" @click="openModal">➕ Thêm Tin tức</button>

    <div class="news-list">
      <div class="news-card" v-for="(news, index) in newsList" :key="news.id">
        <img :src="news.image" alt="Ảnh tin" class="news-image" />
        <h3>{{ news.title }}</h3>
        <p class="description">{{ truncate(news.description, 80) }}</p>
        <div class="actions">
          <button @click="editNews(index)" class="edit-btn">✏️ Sửa</button>
          <button @click="deleteNews(index)" class="delete-btn">🗑️ Xóa</button>
        </div>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEdit ? 'Sửa Tin tức' : 'Thêm Tin tức Mới' }}</h3>

        <input v-model="form.title" placeholder="Tiêu đề" required />
        <textarea v-model="form.description" placeholder="Mô tả nội dung" rows="4"></textarea>
        <input type="file" @change="handleImageUpload" accept="image/*" />

        <div v-if="form.previewImage" class="preview">
          <img :src="form.previewImage" alt="Xem trước" />
        </div>

        <div class="modal-actions">
          <button @click="saveNews" class="save-btn">💾 Lưu</button>
          <button @click="closeModal" class="cancel-btn">❌ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: 'AdminNewsPage',
  data() {
    return {
      newsList: [],
      form: {
        title: '',
        description: '',
        image: '',
        previewImage: ''
      },
      showModal: false,
      isEdit: false,
      editIndex: -1
    };
  },
  mounted() {
    this.fetchNews();
  },
  methods: {
    async fetchNews() {
      try {
        const res = await apiClient.get('http://localhost:8000/api/news');
        this.newsList = res.data;
      } catch (error) {
        console.error('Lỗi khi tải tin tức:', error);
        alert('Không thể tải danh sách tin tức. Vui lòng thử lại!');
      }
    },
    openModal() {
      this.resetForm();
      this.showModal = true;
    },
    closeModal() {
      this.resetForm();
      this.showModal = false;
    },
    resetForm() {
      this.form = {
        title: '',
        description: '',
        image: '',
        previewImage: ''
      };
      this.isEdit = false;
      this.editIndex = -1;
    },
    truncate(text, length) {
      return text?.length > length ? text.slice(0, length) + '...' : text;
    },
    async handleImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await apiClient.post('http://localhost:8000/api/uploadImage', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        this.form.previewImage = response.data.url;
        this.form.image = response.data.url;
      } catch (error) {
        console.error('Lỗi upload ảnh:', error);
        alert('Không thể upload ảnh');
      }
    },
    async saveNews() {
      if (!this.form.title || !this.form.image) {
        alert('Vui lòng nhập tiêu đề và chọn ảnh');
        return;
      }

      const newsData = {
        title: this.form.title,
        description: this.form.description,
        image: this.form.image
      };

      try {
        if (this.isEdit) {
          const id = this.newsList[this.editIndex].id;
          const res = await apiClient.put(`http://localhost:8000/api/news/${id}`, newsData);
          this.newsList[this.editIndex] = res.data;
          alert('Cập nhật tin tức thành công!');
        } else {
          const res = await apiClient.post('http://localhost:8000/api/news', newsData);
          this.newsList.unshift(res.data);
          alert('Thêm tin tức thành công!');
        }
        this.closeModal();
      } catch (error) {
        console.error('Lỗi khi lưu tin:', error);
        alert('Không thể lưu tin tức');
      }
    },
    editNews(index) {
      const news = this.newsList[index];
      this.form = {
        title: news.title,
        description: news.description,
        image: news.image,
        previewImage: news.image
      };
      this.isEdit = true;
      this.editIndex = index;
      this.showModal = true;
    },
    async deleteNews(index) {
      if (!confirm('Bạn có chắc muốn xóa tin này?')) return;
      const news = this.newsList[index];
      try {
        await apiClient.delete(`http://localhost:8000/api/news/${news.id}`);
        this.newsList.splice(index, 1);
        alert('Xóa tin tức thành công!');
      } catch (error) {
        console.error('Xóa thất bại:', error);
        alert('Xóa tin tức thất bại!');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-news-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.admin-news-page::before {
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

.add-button {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: white;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
  display: block;
  margin: 0 auto 30px;
}

.add-button::before {
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

.add-button:hover::before {
  width: 300px;
  height: 300px;
}

.add-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.news-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.news-card {
  width: 280px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 16px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  animation: slideUp 0.5s ease forwards;
}

.news-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.news-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.news-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 12px;
}

.news-card h3 {
  margin: 0 0 8px 0;
  color: #2a9d8f;
  font-size: 1.3rem;
  font-weight: 600;
}

.description {
  color: #555;
  font-size: 0.95rem;
  min-height: 40px;
  line-height: 1.4;
}

.actions {
  margin-top: 12px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  padding: 8px 12px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.edit-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  box-shadow: 0 2px 8px rgba(42, 157, 143, 0.3);
}

.delete-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.edit-btn::before,
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

.edit-btn:hover::before,
.delete-btn::before:hover {
  width: 200px;
  height: 200px;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.4);
}

.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  background: linear-gradient(90deg, #ee5a52, #ff6b6b);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  width: 90%;
  max-width: 400px;
  padding: 24px;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.modal-content h3 {
  margin-top: 0;
  color: #2a9d8f;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 12px 16px;
  margin: 12px 0;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-family: 'Fredoka', sans-serif;
  font-size: 1rem;
  background: #f9f9f9;
  transition: border-color 0.3s ease;
}

.modal-content input:focus,
.modal-content textarea:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.preview {
  margin: 12px 0;
  text-align: center;
}

.preview img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.save-btn,
.cancel-btn {
  padding: 12px 20px;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.save-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.cancel-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.save-btn::before,
.cancel-btn::before {
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

.save-btn:hover::before,
.cancel-btn:hover::before {
  width: 200px;
  height: 200px;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  background: linear-gradient(90deg, #ee5a52, #ff6b6b);
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
  .admin-news-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .news-list {
    gap: 16px;
  }
  .news-card {
    width: 100%;
    max-width: 300px;
  }
  .modal-content {
    width: 95%;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .add-button {
    font-size: 1rem;
    padding: 12px 20px;
    width: 100%;
  }
  .news-card h3 {
    font-size: 1.2rem;
  }
  .description {
    font-size: 0.9rem;
  }
  .edit-btn,
  .delete-btn {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
  .modal-actions {
    flex-direction: column;
  }
  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}
</style>