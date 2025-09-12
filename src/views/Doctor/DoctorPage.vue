<template>
  <div class="staff-page">
    <h1 class="animate-pulse">👤 Thông tin cá nhân</h1>
    <div class="profile-info">
      <img v-if="profile" :src="profile.avatar" alt="Avatar" class="avatar" />
      <div class="profiles" v-if="profile">
        <p><strong>Họ tên:</strong> {{ profile.name }}</p>
        <p><strong>Ngày sinh:</strong> {{ profile.birthday }}</p>
        <p><strong>Giới tính:</strong> {{ profile.gender }}</p>
        <p><strong>Email:</strong> {{ profile.email }}</p>
        <p><strong>Số điện thoại:</strong> {{ profile.phone }}</p>
        <p><strong>Địa chỉ:</strong> {{ profile.address }}</p>
      </div>
    </div>
    <button @click="editProfile" class="edit-btn">✏️ Chỉnh sửa thông tin</button>

    <!-- Modal thêm/sửa -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEdit ? 'Chỉnh sửa thông tin' : 'Thêm thông tin' }}</h3>
        <div class="form-group">
          <label for="name">Họ tên:</label>
          <input id="name" v-model="form.name" placeholder="Nhập họ tên" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input id="email" v-model="form.email" type="email" placeholder="Nhập email" />
        </div>
        <div class="form-group">
          <label for="phone">Số điện thoại:</label>
          <input id="phone" type="text" v-model="form.phone" placeholder="Nhập số điện thoại" />
        </div>
        <div class="form-group">
          <label for="address">Địa chỉ:</label>
          <input id="address" type="text" v-model="form.address" placeholder="Nhập địa chỉ" />
        </div>
        <div class="form-group">
          <label for="birthday">Ngày sinh:</label>
          <input id="birthday" type="date" v-model="form.birthday" />
        </div>
        <div class="form-group">
          <label for="gender">Giới tính:</label>
          <input id="gender" type="text" v-model="form.gender" placeholder="Nhập giới tính" />
        </div>
        <div class="form-group">
          <label for="avatar">Ảnh đại diện:</label>
          <input id="avatar" type="file" @change="handleImageUpload" accept="image/*" />
        </div>
        <div v-if="form.previewImage" class="preview">
          <img :src="form.previewImage" alt="Xem trước" />
        </div>
        <div class="modal-actions">
          <button @click="saveProduct" class="save-btn">💾 Lưu</button>
          <button @click="closeModal" class="cancel-btn">❌ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: 'StaffPage',
  data() {
    return {
      profile: null,
      form: {
        name: '',
        email: '',
        phone: '',
        address: '',
        birthday: '',
        gender: '',
        image: '',
        previewImage: '',
      },
      showModal: false,
      isEdit: false,
    };
  },
  async created() {
    try {
      const response = await apiClient.get('/api/profile');
      this.profile = response.data;
    } catch (error) {
      console.error('Lỗi tải thông tin người dùng:', error);
    }
  },
  methods: {
    editProfile() {
      this.form = {
        name: this.profile.name,
        email: this.profile.email,
        phone: this.profile.phone,
        address: this.profile.address,
        birthday: this.profile.birthday,
        gender: this.profile.gender,
        previewImage: this.profile.avatar || '',
      };
      this.isEdit = true;
      this.showModal = true;
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
        name: '',
        email: '',
        phone: '',
        address: '',
        birthday: '',
        gender: '',
        image: '',
        previewImage: '',
      };
      this.isEdit = false;
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
        const response = await apiClient.post('/api/profile/uploadImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.form.previewImage = response.data.url;
      } catch (error) {
        console.error('Lỗi khi upload ảnh:', error);
        alert('Upload ảnh thất bại');
      }
    },
    async saveProduct() {
      try {
        const payload = {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          address: this.form.address,
          birthday: this.form.birthday,
          gender: this.form.gender,
          avatar: this.form.previewImage,
        };

        const response = await apiClient.put('/api/profile/update', payload);
        this.profile = response.data;
        this.closeModal();
        alert('Cập nhật thông tin thành công!');
      } catch (error) {
        console.error('Lỗi cập nhật thông tin:', error);
        alert('Cập nhật thất bại!');
      }
    },
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.staff-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.staff-page::before {
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
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 30px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #2a9d8f;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.profiles p {
  font-size: 1.1rem;
  color: #333;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(42, 157, 143, 0.1);
  padding-bottom: 8px;
}

.profiles p strong {
  color: #f28c38;
  font-weight: 500;
}

.edit-btn {
  display: block;
  margin: 0 auto;
  padding: 12px 25px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.edit-btn::before {
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

.edit-btn:hover::before {
  width: 200px;
  height: 200px;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
  position: relative;
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
  text-align: center;
  font-size: 1.8rem;
  color: #2a9d8f;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9f9f9;
  transition: all 0.3s ease;
}

.form-group input:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.form-group input[type="file"] {
  padding: 8px;
}

.preview img {
  max-width: 100%;
  margin-top: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}

.modal-actions button {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
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
  width: 200px;
  height: 200px;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.cancel-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

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

.cancel-btn:hover::before {
  width: 200px;
  height: 200px;
}

.cancel-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
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
  .staff-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .profile-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
  .avatar {
    width: 120px;
    height: 120px;
  }
  .modal-content {
    width: 90%;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .profile-info p {
    font-size: 1rem;
  }
  .edit-btn, .save-btn, .cancel-btn {
    font-size: 1rem;
    padding: 10px 20px;
  }
  .form-group label {
    font-size: 1rem;
  }
  .form-group input {
    font-size: 0.95rem;
    padding: 10px;
  }
}
</style>