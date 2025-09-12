<template>
  <div class="coupon-management-page">
    <h1 class="animate-pulse">🎟️ Quản lý Mã Giảm Giá</h1>
    <p class="subtitle">Tạo, chỉnh sửa và quản lý các mã giảm giá cho khách hàng</p>

    <!-- Form thêm/ sửa mã giảm giá -->
    <div class="coupon-form">
      <h2>{{ isEditing ? 'Chỉnh sửa mã giảm giá' : 'Thêm mã giảm giá mới' }}</h2>
      <form @submit.prevent="submitForm" class="form-container">
        <div class="form-row">
          <label for="code">Mã giảm giá:</label>
          <input id="code" v-model="form.code" required type="text" placeholder="Nhập mã giảm giá" />
        </div>
        <div class="form-row">
          <label for="percent">Phần trăm giảm giá (%):</label>
          <input id="percent" type="number" v-model.number="form.percent" min="1" max="100" required placeholder="1 - 100" />
        </div>
        <div class="form-row">
          <label for="usage_limit">Lượt sử dụng tối đa:</label>
          <input id="usage_limit" type="number" v-model.number="form.usage_limit" min="1" required placeholder="Nhập số lượt tối đa" />
        </div>
        <div class="form-row button-row">
          <button type="submit" class="save-btn">{{ isEditing ? '✏️ Cập nhật' : '➕ Thêm mới' }}</button>
          <button v-if="isEditing" type="button" @click="resetForm" class="reset-btn">❌ Hủy</button>
        </div>
      </form>
    </div>

    <hr class="divider" />

    <!-- Danh sách mã giảm giá -->
    <div class="coupon-list">
      <h2>Danh sách mã giảm giá</h2>
      <table class="coupon-table">
        <thead>
          <tr>
            <th>Mã giảm giá</th>
            <th>% Giảm</th>
            <th>Lượt sử dụng tối đa</th>
            <th>Lượt đã sử dụng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="coupon in coupons" :key="coupon.id" class="table-row">
            <td>{{ coupon.code }}</td>
            <td>{{ coupon.percent }}%</td>
            <td>{{ coupon.usage_limit }}</td>
            <td>{{ coupon.used || 0 }}</td>
            <td>
              <button @click="editCoupon(coupon)" class="edit-btn">✏️ Sửa</button>
              <button @click="deleteCoupon(coupon.id)" class="delete-btn">🗑️ Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="coupons.length === 0" class="empty-state">
        <p>Chưa có mã giảm giá nào. Hãy thêm mã giảm giá đầu tiên!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const coupons = ref([]);
const form = ref({ id: null, code: '', percent: 0, usage_limit: 0 });
const isEditing = ref(false);

const API_BASE = '/api/coupon';

// Lấy danh sách mã giảm giá
async function fetchCoupon() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Lỗi khi tải danh sách');
    const data = await res.json();
    coupons.value = data;
  } catch (error) {
    console.error('Lỗi khi tải danh sách mã giảm giá:', error);
    alert('Lỗi khi tải danh sách mã giảm giá');
  }
}

// Thêm hoặc sửa mã giảm giá
async function submitForm() {
  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value ? `${API_BASE}/${form.value.id}` : API_BASE;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        code: form.value.code, 
        percent: form.value.percent, 
        usage_limit: form.value.usage_limit 
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi khi lưu mã giảm giá');
    }

    alert(isEditing.value ? 'Cập nhật mã giảm giá thành công!' : 'Thêm mã giảm giá thành công!');
    resetForm();
    await fetchCoupon();
  } catch (error) {
    console.error('Lỗi khi lưu mã giảm giá:', error);
    alert(error.message);
  }
}

// Sửa mã giảm giá
function editCoupon(coupon) {
  form.value = { ...coupon };
  isEditing.value = true;
}

// Hủy sửa, reset form
function resetForm() {
  form.value = { id: null, code: '', percent: 0, usage_limit: 0 };
  isEditing.value = false;
}

// Xóa mã giảm giá
async function deleteCoupon(id) {
  if (!confirm('Bạn có chắc muốn xóa mã giảm giá này?')) return;

  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi khi xóa mã giảm giá');
    }
    alert('Xóa mã giảm giá thành công!');
    await fetchCoupon();
  } catch (error) {
    console.error('Xóa thất bại:', error);
    alert(error.message);
  }
}

onMounted(() => {
  fetchCoupon();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.coupon-management-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
}

.coupon-management-page::before {
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

.coupon-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.coupon-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.coupon-form h2 {
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
  width: 160px;
  font-weight: 600;
  color: #2a9d8f;
  font-size: 1.1rem;
}

.form-row input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9f9f9;
  color: #333;
  transition: all 0.3s ease;
}

.form-row input:focus {
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

.coupon-list {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.coupon-list h2 {
  color: #2a9d8f;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.coupon-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.coupon-table th,
.coupon-table td {
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: left;
}

.coupon-table th {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  font-weight: 600;
}

.coupon-table .table-row:hover td {
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
  .coupon-management-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .coupon-form,
  .coupon-list {
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
  .coupon-table th,
  .coupon-table td {
    padding: 8px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .coupon-form h2,
  .coupon-list h2 {
    font-size: 1.5rem;
  }
  .form-row input {
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