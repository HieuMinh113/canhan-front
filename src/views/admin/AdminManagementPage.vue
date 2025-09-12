<template>
  <div class="admin-management-page">
    <h1 class="animate-pulse">👥 Quản lý Người dùng</h1>
    <p class="subtitle">Quản lý thông tin và vai trò của người dùng hệ thống</p>

    <!-- Nút thêm người dùng -->
    <button class="add-button" @click="showAddModal = true">➕ Thêm Người dùng</button>
    
    <!-- Bộ lọc -->
    <div class="filter-box">
      <div class="form-row">
        <label for="role">Vai trò:</label>
        <select id="role" v-model="filter.role">
          <option value="">Tất cả</option>
          <option value="staff">Nhân viên</option>
          <option value="doctor">Bác sĩ</option>
          <option value="user">Khách hàng</option>
        </select>
      </div>
      <div class="form-row button-row">
        <button @click="applyFilter" class="filter-btn">🔍 Tìm kiếm</button>
        <button @click="cancelFilter" class="reset-btn">🔄 Reset</button>
      </div>
    </div>

    <!-- Bảng danh sách -->
    <table class="user-table">
      <thead>
        <tr>
          <th>Họ tên</th>
          <th>Email</th>
          <th>Vai trò</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="user.id" class="table-row">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button @click="editUser(index)" class="edit-btn">✏️ Sửa</button>
            <button @click="deleteUser(index)" class="delete-btn">🗑️ Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="users.length === 0" class="empty-state">
      <p>Chưa có người dùng nào. Hãy thêm người dùng đầu tiên!</p>
    </div>

    <!-- Modal Thêm / Sửa -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEdit ? 'Sửa Người dùng' : 'Thêm Người dùng Mới' }}</h3>
        <input v-model="form.name" placeholder="Họ tên" required />
        <input v-model="form.email" type="email" placeholder="Email" required />
        <input v-model="form.password" type="password" placeholder="Mật khẩu (chỉ nhập khi tạo mới hoặc thay đổi)" />
        <select v-model="form.role" required>
          <option disabled value="">Chọn vai trò</option>
          <option value="staff">Nhân viên</option>
          <option value="doctor">Bác sĩ</option>
          <option value="user">Khách hàng</option>
        </select>
        <div class="modal-actions">
          <button @click="saveUser" class="save-btn">💾 Lưu</button>
          <button @click="cancel" class="cancel-btn">❌ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: 'AdminUserManagement',
  data() {
    return {
      users: [],
      showAddModal: false,
      isEdit: false,
      editIndex: -1,
      form: {
        id: null,
        name: '',
        email: '',
        password: '',
        role: '',
      },
      filter: {
        role: '',
      }
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const params = {};
        if (this.filter.role) {
          params.role = this.filter.role;
        }
        const res = await apiClient.get('http://localhost:8000/api/users', {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        this.users = res.data;
      } catch (err) {
        console.error('Lỗi khi tải danh sách người dùng:', err);
        alert('Lỗi khi tải danh sách người dùng');
      }
    },
    async saveUser() {
      if (!this.form.name || !this.form.email || !this.form.role || (!this.isEdit && !this.form.password)) {
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        };

        if (this.isEdit) {
          const updateData = { ...this.form };
          if (!updateData.password) {
            delete updateData.password; 
          }
          await apiClient.put(`http://localhost:8000/api/users/${this.form.id}`, updateData, { headers });
          alert('Cập nhật thành công');
        } else {
          await apiClient.post('http://localhost:8000/api/users', this.form, { headers });
          alert('Thêm mới thành công');
        }

        this.cancel();
        this.fetchUsers();
      } catch (err) {
        console.error('Lỗi khi lưu người dùng:', err);
        alert('Lỗi khi lưu người dùng');
      }
    },
    editUser(index) {
      const selectedUser = this.users[index];
      this.form = {
        id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        password: '', 
        role: selectedUser.role,
      };
      this.isEdit = true;
      this.editIndex = index;
      this.showAddModal = true;
    },
    async deleteUser(index) {
      const user = this.users[index];
      if (!confirm(`Xác nhận xóa người dùng "${user.name}"?`)) return;

      try {
        await apiClient.delete(`http://localhost:8000/api/users/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        });
        alert('Xóa thành công');
        this.fetchUsers();
      } catch (err) {
        console.error('Xóa thất bại:', err);
        alert('Lỗi khi xóa người dùng');
      }
    },
    cancel() {
      this.form = {
        id: null,
        name: '',
        email: '',
        password: '',
        role: '',
      };
      this.showAddModal = false;
      this.isEdit = false;
      this.editIndex = -1;
    },
    applyFilter() {
      this.fetchUsers();
    },
    cancelFilter() {
      this.filter.role = '';
      this.fetchUsers();
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-management-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.admin-management-page::before {
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

.filter-box {
  max-width: 600px;
  margin: 0 auto 30px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.filter-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.form-row {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.form-row label {
  font-weight: 600;
  color: #2a9d8f;
  font-size: 1.1rem;
  min-width: 100px;
}

.form-row select {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
}

.form-row select:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.button-row {
  justify-content: flex-end;
}

.filter-btn,
.reset-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
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
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
  margin-left: 10px;
}

.reset-btn {
  background: linear-gradient(90deg, #9ca3af, #6b7280);
}

.filter-btn::before,
.reset-btn::before {
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

.filter-btn:hover::before,
.reset-btn:hover::before {
  width: 200px;
  height: 200px;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.reset-btn:hover {
  background: linear-gradient(90deg, #6b7280, #4b5563);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(107, 114, 128, 0.4);
}

.user-table {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.user-table::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.user-table th,
.user-table td {
  padding: 12px 16px;
  background: #f9f9f9;
  text-align: left;
}

.user-table th {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  font-weight: 600;
}

.table-row:hover td {
  background: rgba(42, 157, 143, 0.1);
  transition: background 0.3s ease;
}

.edit-btn,
.delete-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(42, 157, 143, 0.3);
  margin-right: 8px;
}

.delete-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
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
.delete-btn:hover::before {
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

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  width: 90%;
  max-width: 450px;
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
  margin-bottom: 20px;
  color: #2a9d8f;
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  margin-bottom: 14px;
  border: 2px solid #ddd;
  border-radius: 10px;
  outline: none;
  background: #f9f9f9;
  transition: border-color 0.3s ease;
}

.modal-content input:focus,
.modal-content select:focus {
  border-color: #2a9d8f;
  background: #fff;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
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

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .admin-management-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .filter-box {
    flex-direction: column;
    gap: 10px;
  }
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .form-row label {
    min-width: auto;
  }
  .button-row {
    justify-content: center;
  }
  .filter-btn,
  .reset-btn {
    width: 100%;
    margin-left: 0;
  }
  .user-table th,
  .user-table td {
    padding: 8px;
    font-size: 0.9rem;
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