<template>
  <div class="admin-work-page">
    <h1 class="animate-pulse">📋 Lịch Làm Việc Theo Nhân Viên</h1>
    <p class="subtitle">Danh sách lịch làm việc được phân theo từng nhân viên</p>

    <div v-if="loading" class="loading-state">
      <p>⏳ Đang tải dữ liệu...</p>
    </div>

    <div v-if="!loading && groupedSchedules.length === 0" class="empty-state">
      <p>Không có lịch làm việc nào. Hãy thêm lịch làm việc đầu tiên!</p>
    </div>

    <div class="staff-schedule" v-for="(staff, index) in groupedSchedules" :key="index">
      <div class="staff-header">
        <h2>{{ staff.name }}</h2>
        <p>👤 Vai trò: {{ staff.role }}</p>
      </div>

      <ul class="shift-list">
        <li v-for="(shift, idx) in staff.shifts" :key="idx">
          📅 {{ formatDate(shift.date) }} - {{ getStatusName(shift.status) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';

export default {
  name: "AdminWorkPage",
  data() {
    return {
      workSchedules: [],
      loading: true,
    };
  },
  computed: {
    groupedSchedules() {
      const map = new Map();
      this.workSchedules.forEach((item) => {
        if (!item.user) return; 

        const key = item.user.name;
        if (!map.has(key)) {
          map.set(key, {
            name: item.user.name,
            role: item.user.role,
            shifts: [],
          });
        }
        map.get(key).shifts.push({
          date: item.date,
          status: item.status,
        });
      });

      return Array.from(map.values());
    },
  },
  methods: {
    async fetchWorkSchedules() {
      try {
        const response = await apiClient.get('/api/work-schedule');
        this.workSchedules = response.data;
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        alert('Không thể tải dữ liệu lịch làm việc. Vui lòng thử lại!');
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return 'N/A';
      return new Date(dateStr).toLocaleDateString('vi-VN');
    },
    getStatusName(status) {
      switch (status) {
        case 'active':
          return 'Hoạt động';
        case 'inactive':
          return 'Không hoạt động';
        default:
          return status;
      }
    },
  },
  created() {
    this.fetchWorkSchedules();
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-work-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}

.admin-work-page::before {
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

.staff-schedule {
  background: rgba(255, 255, 255, 0.95);
  border-left: 6px solid #42a5f5;
  margin-bottom: 24px;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
}

.staff-schedule::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.staff-schedule:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.staff-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #007acc;
  font-weight: 600;
}

.staff-header p {
  margin-top: 4px;
  color: #555;
  font-style: italic;
  font-size: 1rem;
}

.shift-list {
  margin-top: 12px;
  padding-left: 20px;
  list-style: none;
}

.shift-list li {
  margin-bottom: 6px;
  color: #333;
  position: relative;
  padding-left: 24px;
  transition: color 0.2s;
  font-size: 1rem;
}

.shift-list li:hover {
  color: #007acc;
}

.shift-list li::before {
  content: '📌';
  position: absolute;
  left: 0;
  top: 0;
}

.empty-state {
  text-align: center;
  color: #4a4a4a;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
  position: relative;
  overflow: hidden;
}

.empty-state::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.loading-state {
  text-align: center;
  color: #555;
  font-style: italic;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
  position: relative;
  overflow: hidden;
}

.loading-state::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
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
  .admin-work-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .staff-schedule {
    padding: 16px;
  }
  .staff-header h2 {
    font-size: 1.3rem;
  }
  .shift-list li {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .staff-schedule {
    padding: 12px;
  }
  .staff-header h2 {
    font-size: 1.2rem;
  }
  .shift-list li {
    font-size: 0.9rem;
    padding-left: 20px;
  }
}
</style>