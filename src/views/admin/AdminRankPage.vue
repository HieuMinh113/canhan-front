<template>
  <div class="admin-rank-page">
    <h1 class="animate-pulse">⭐ Quản lý Rank User</h1>
    <p class="subtitle">Danh sách người dùng và thông tin rank thành viên của họ</p>

    <div class="table-container">
      <table class="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Điểm</th>
            <th>Rank</th>
            <th>Giảm giá</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="table-row">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.point }}</td>
            <td>{{ user.rank }}</td>
            <td>{{ user.discount }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="users.length === 0" class="empty-state">
      <p>Chưa có dữ liệu rank user. Đang tải...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import apiClient from "@/service/axios";

const users = ref([]);

onMounted(async () => {
  try {
    const res = await apiClient.get("/api/loyaltyy");
    users.value = res.data;
  } catch (err) {
    console.error(err);
    alert('Không thể tải dữ liệu rank user. Vui lòng thử lại!');
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-rank-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.admin-rank-page::before {
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

.table-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  overflow-x: auto;
  position: relative;
  overflow: hidden;
}

.table-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-table th,
.user-table td {
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
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

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@media (max-width: 768px) {
  .admin-rank-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .table-container {
    padding: 15px;
  }
  .user-table th,
  .user-table td {
    padding: 8px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .user-table th,
  .user-table td {
    font-size: 0.85rem;
    padding: 6px;
  }
}
</style>