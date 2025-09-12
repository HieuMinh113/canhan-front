<template>
  <div class="service-management-page">
    <h1 class="animate-pulse">⚙️ Quản lý Dịch vụ</h1>
    <p class="subtitle">Quản lý các dịch vụ dành cho thú cưng và khách hàng</p>

    <!-- Form thêm/sửa dịch vụ -->
    <div class="service-form">
      <h2>{{ isEditing ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới' }}</h2>
      <form @submit.prevent="submitForm" class="form-container">
        <div class="form-row">
          <label for="name">Tên dịch vụ:</label>
          <input id="name" v-model="form.name" required type="text" placeholder="Nhập tên dịch vụ" />
        </div>
        <div class="form-row">
          <label for="type">Loại dịch vụ:</label>
          <select id="type" v-model="form.type" required>
            <option disabled value="">-- Chọn loại --</option>
            <option value="staff">Nhân viên</option>
            <option value="doctor">Bác sĩ</option>
          </select>
        </div>
        <div class="form-row">
          <label for="price">Giá (VNĐ):</label>
          <input id="price" type="number" v-model.number="form.price" min="0" required placeholder="Nhập giá dịch vụ" />
        </div>
        <div class="form-row button-row">
          <button type="submit" class="save-btn">{{ isEditing ? '✏️ Cập nhật' : '➕ Thêm mới' }}</button>
          <button v-if="isEditing" type="button" @click="resetForm" class="reset-btn">❌ Hủy</button>
        </div>
      </form>
    </div>

    <hr class="divider" />

    <!-- Danh sách dịch vụ -->
    <div class="service-list">
      <h2>Danh sách dịch vụ</h2>
      <table class="service-table">
        <thead>
          <tr>
            <th>Tên dịch vụ</th>
            <th>Loại</th>
            <th>Giá (VNĐ)</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.id" class="table-row">
            <td>{{ service.name }}</td>
            <td>{{ getTypeName(service.type) }}</td>
            <td>{{ formatPrice(service.price) }}</td>
            <td>
              <button @click="editService(service)" class="edit-btn">✏️ Sửa</button>
              <button @click="deleteService(service.id)" class="delete-btn">🗑️ Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="services.length === 0" class="empty-state">
        <p>Chưa có dịch vụ nào. Hãy thêm dịch vụ đầu tiên!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const services = ref([]);
const form = ref({ id: null, name: '', price: 0, type: '' });
const isEditing = ref(false);

const API_BASE = 'http://localhost:8000/api/service';

// Format tiền VNĐ
function formatPrice(value) {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

// Lấy tên loại dịch vụ
function getTypeName(type) {
  switch (type) {
    case 'staff':
      return 'Nhân viên';
    case 'doctor':
      return 'Bác sĩ';
    default:
      return type;
  }
}

// Lấy danh sách dịch vụ
async function fetchServices() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Lỗi khi tải danh sách');
    const data = await res.json();
    services.value = data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách dịch vụ:', error);
    alert('Lỗi khi tải danh sách dịch vụ');
  }
}

// Thêm hoặc sửa dịch vụ
async function submitForm() {
  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value ? `${API_BASE}/${form.value.id}` : API_BASE;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.value.name, price: form.value.price, type: form.value.type }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi khi lưu dịch vụ');
    }

    alert(isEditing.value ? 'Cập nhật dịch vụ thành công!' : 'Thêm dịch vụ thành công!');
    resetForm();
    await fetchServices();
  } catch (error) {
    console.error('Lỗi khi lưu dịch vụ:', error);
    alert(error.message);
  }
}

// Sửa dịch vụ
function editService(service) {
  form.value = { ...service };
  isEditing.value = true;
}

// Hủy sửa, reset form
function resetForm() {
  form.value = { id: null, name: '', price: 0, type: '' };
  isEditing.value = false;
}

// Xóa dịch vụ
async function deleteService(id) {
  if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi khi xóa dịch vụ');
    }
    alert('Xóa dịch vụ thành công!');
    await fetchServices();
  } catch (error) {
    console.error('Xóa thất bại:', error);
    alert(error.message);
  }
}

onMounted(() => {
  fetchServices();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.service-management-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
}

.service-management-page::before {
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

.service-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.service-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.service-form h2 {
  color: #2a9d8f;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.form-row label {
  width: 140px;
  font-weight: 600;
  color: #2a9d8f;
  font-size: 1.1rem;
}

.form-row input,
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

.form-row input:focus,
.form-row select:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.button-row {
  justify-content: flex-end;
}

.save-btn,
.reset-btn {
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
  margin-left: 10px;
}

.reset-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
}

.save-btn::before,
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

.save-btn:hover::before,
.reset-btn:hover::before {
  width: 300px;
  height: 300px;
}

.save-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.reset-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  background: linear-gradient(90deg, #ee5a52, #ff6b6b);
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  margin: 30px auto;
  width: 80%;
  border: none;
  border-radius: 2px;
}

.service-list {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.service-list h2 {
  color: #2a9d8f;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.service-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.service-table th,
.service-table td {
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: left;
}

.service-table th {
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
  .service-management-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .service-form,
  .service-list {
    padding: 20px;
  }
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .form-row label {
    width: auto;
  }
  .save-btn,
  .reset-btn {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
  }
  .service-table th,
  .service-table td {
    padding: 8px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .service-form h2,
  .service-list h2 {
    font-size: 1.5rem;
  }
  .form-row input,
  .form-row select {
    font-size: 0.9rem;
    padding: 10px;
  }
  .save-btn,
  .reset-btn,
  .edit-btn,
  .delete-btn {
    font-size: 1rem;
    padding: 10px;
  }
}
</style>