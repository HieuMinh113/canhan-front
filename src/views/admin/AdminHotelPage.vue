<template>
  <div class="admin-hotel-page">
    <h1 class="animate-pulse">🏨 Quản lý Khách sạn Thú Cưng</h1>
    <p class="subtitle">Quản lý các phòng khách sạn dành cho thú cưng của bạn</p>

    <button class="add-button" @click="openModal">➕ Thêm Phòng</button>

    <div class="room-list">
      <div class="room-card" v-for="(room, index) in rooms" :key="room.id">
        <img :src="room.image" alt="Ảnh phòng" class="room-image" />
        <h3>{{ room.name }}</h3>
        <p><strong>Loại:</strong> {{ room.category }}</p>
        <p><strong>Giá:</strong> {{ formatPrice(room.price) }}</p>
        <p class="description">{{ room.description }}</p>
        <div class="actions">
          <button @click="editRoom(index)" class="edit-btn">✏️ Sửa</button>
          <button @click="deleteRoom(index)" class="delete-btn">🗑️ Xóa</button>
        </div>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEdit ? 'Sửa phòng' : 'Thêm phòng mới' }}</h3>

        <input v-model="form.name" placeholder="Tên phòng" required />
        <input v-model="form.category" placeholder="Loại phòng (ví dụ: VIP, Tiêu chuẩn)" required />
        <input type="number" v-model="form.price" placeholder="Giá mỗi đêm (VNĐ)" required />
        <textarea v-model="form.description" placeholder="Mô tả phòng..."></textarea>
        <input type="file" @change="handleImageUpload" accept="image/*" />

        <div v-if="form.previewImage" class="preview">
          <img :src="form.previewImage" alt="Xem trước ảnh" />
        </div>

        <div class="modal-actions">
          <button @click="saveRoom" class="save-btn">Lưu</button>
          <button @click="closeModal" class="cancel-btn">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "AdminHotelPage",
  data() {
    return {
      rooms: [], 
      form: {
        name: '',
        category: '',
        price: '',
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
    this.fetchRooms();
  },
  methods: {
    openModal() {
      this.resetForm();
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        previewImage: ''
      };
      this.isEdit = false;
      this.editIndex = -1;
    },
    async handleImageUpload(event) {
      const fileList = event?.target?.files;
      if (!fileList || fileList.length === 0) {
        console.warn("Không có file nào được chọn");
        return;
      }
      const selectedFile = fileList[0];
      const formData = new FormData();
      formData.append('image', selectedFile);
      try {
        const response = await apiClient.post('/api/hoteluploadImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.form.previewImage = response.data.url;
        this.form.image = response.data.url;
      } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
        alert('Upload ảnh thất bại');
      }
    },
    formatPrice(value) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    },
    async fetchRooms() {
      try {
        const response = await apiClient.get('/api/hotel');
        this.rooms = response.data;
      } catch (error) {
        console.error('Lỗi khi tải danh sách phòng:', error);
        alert('Không thể tải danh sách phòng. Vui lòng thử lại!');
      }
    },
    async saveRoom() {
      if (!this.form.name || !this.form.category || !this.form.price || !this.form.image) {
        alert('Vui lòng nhập đầy đủ thông tin và chọn ảnh');
        return;
      }

      const roomData = {
        name: this.form.name,
        category: this.form.category,
        price: Number(this.form.price),
        description: this.form.description,
        image: this.form.image,
      };

      try {
        if (this.isEdit) {
          const id = this.rooms[this.editIndex].id;
          const res = await apiClient.put(`/api/hotel/${id}`, roomData);
          this.rooms[this.editIndex] = res.data;
          alert('Cập nhật phòng thành công!');
        } else {
          const res = await apiClient.post('/api/hotel', roomData);
          this.rooms.push(res.data);
          alert('Thêm phòng thành công!');
        }
        this.closeModal();
      } catch (error) {
        console.error('Lỗi khi lưu phòng:', error);
        alert('Lưu phòng thất bại');
      }
    },
    editRoom(index) {
      const room = this.rooms[index];
      this.form = {
        name: room.name,
        category: room.category,
        price: room.price,
        description: room.description,
        image: room.image,
        previewImage: room.image,
      };
      this.isEdit = true;
      this.editIndex = index;
      this.showModal = true;
    },
    async deleteRoom(index) {
      if (!confirm('Bạn có chắc muốn xóa phòng này?')) return;
      const room = this.rooms[index];
      try {
        await apiClient.delete(`/api/hotel/${room.id}`);
        this.rooms.splice(index, 1);
        alert('Xóa phòng thành công!');
      } catch (error) {
        console.error('Xóa thất bại:', error);
        alert('Xóa phòng thất bại!');
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-hotel-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.admin-hotel-page::before {
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

.room-list {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
}

.room-card {
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

.room-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.room-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.room-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  margin-bottom: 12px;
}

.room-card h3 {
  margin: 0 0 8px 0;
  color: #2a9d8f;
  font-size: 1.3rem;
  font-weight: 600;
}

.room-card p {
  margin: 4px 0;
  color: #333;
  font-size: 1rem;
}

.description {
  min-height: 48px;
  color: #555;
  font-style: italic;
  font-size: 0.95rem;
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

.edit-btn:hover,
.delete-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.4);
}

.delete-btn:hover {
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  background: linear-gradient(90deg, #ee5a52, #ff6b6b);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
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
.cancel-btn::before:hover {
  width: 200px;
  height: 200px;
}

.save-btn:hover,
.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.cancel-btn:hover {
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
  .admin-hotel-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .room-list {
    gap: 16px;
  }
  .room-card {
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
  .room-card h3 {
    font-size: 1.2rem;
  }
  .room-card p {
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