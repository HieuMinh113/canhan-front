<template>
  <div class="admin-dashboard">
    <h1 class="animate-pulse">📊 Thống kê Quản trị</h1>
    <p class="subtitle">Tổng quan về hoạt động của hệ thống và thống kê hoa hồng</p>

    <div class="stats">
      <div class="stat-card user" @click="$router.push('/userchart')">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <span class="stat-label">Người dùng</span>
          <span class="stat-value">{{ dashboard.totalUser }}</span>
        </div>
      </div>
      <div class="stat-card product" @click="$router.push('/productchart')">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <span class="stat-label">Sản phẩm</span>
          <span class="stat-value">{{ dashboard.totalProduct }}</span>
        </div>
      </div>
      <div class="stat-card pet" @click="$router.push('/petchart')">
        <div class="stat-icon">🐾</div>
        <div class="stat-info">
          <span class="stat-label">Thú cưng</span>
          <span class="stat-value">{{ dashboard.totalPet }}</span>
        </div>
      </div>
      <div class="stat-card hotel" @click="$router.push('/hotelchart')">
        <div class="stat-icon">🏨</div>
        <div class="stat-info">
          <span class="stat-label">Khách sạn</span>
          <span class="stat-value">{{ dashboard.totalHotel }}</span>
        </div>
      </div>
      <div class="stat-card contact">
        <div class="stat-icon">📧</div>
        <div class="stat-info">
          <span class="stat-label">Liên hệ</span>
          <span class="stat-value">{{ dashboard.totalContact }}</span>
        </div>
      </div>
      <div class="stat-card feedback">
        <div class="stat-icon">⭐</div>
        <div class="stat-info">
          <span class="stat-label">Phản hồi</span>
          <span class="stat-value">{{ dashboard.totalFeedback }}</span>
        </div>
      </div>
      <div class="stat-card booking">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <span class="stat-label">Đặt lịch</span>
          <span class="stat-value">{{ dashboard.totalBooking }}</span>
        </div>
      </div>
      <div class="stat-card appointment">
        <div class="stat-icon">🩺</div>
        <div class="stat-info">
          <span class="stat-label">Cuộc hẹn</span>
          <span class="stat-value">{{ dashboard.totalAppointment }}</span>
        </div>
      </div>
      <div class="stat-card bookinghotel">
        <div class="stat-icon">🛏️</div>
        <div class="stat-info">
          <span class="stat-label">Đặt phòng</span>
          <span class="stat-value">{{ dashboard.totalBookingHotel }}</span>
        </div>
      </div>
      <div class="stat-card service">
        <div class="stat-icon">⚙️</div>
        <div class="stat-info">
          <span class="stat-label">Dịch vụ</span>
          <span class="stat-value">{{ dashboard.totalService }}</span>
        </div>
      </div>
      <div class="stat-card bill" @click="$router.push('/billchart')">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <span class="stat-label">Hóa đơn</span>
          <span class="stat-value">{{ dashboard.totalBill }}</span>
        </div>
      </div> 
    </div>

    <div class="chart-container">
      <div id="curve_chart" style="width: 100%; height: 600px"></div>
    </div>

    <div class="commission-page">
      <h2 class="commission-title">💰 Hoa Hồng</h2>

      <div v-if="commissions.length > 0" class="commission-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Vai trò</th>
              <th>Tổng hoa hồng</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in commissions" :key="c.id" class="table-row">
              <td>{{ c.id }}</td>
              <td>{{ c.name }}</td>
              <td>{{ c.role }}</td>
              <td>{{ formatPrice(c.total_commission) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <p>⏳ Đang tải dữ liệu...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import apiClient from '@/service/axios'

const dashboard = reactive({
  totalUser: 0,
  totalOrder: 0,
  totalProduct: 0,
  totalBooking: 0,
  totalAppointment: 0,
  totalBookingHotel: 0,
  totalFeedback: 0,
  totalService: 0,
  totalBill: 0,
  totalPet: 0,
  totalHotel: 0,
  totalContact: 0,
})
const commissions = ref([]);

const drawChart = () => {
  window.google.charts.load('current', { packages: ['corechart'] })
  window.google.charts.setOnLoadCallback(fetchDataAndDraw)
}

const fetchDataAndDraw = async () => {
  try {
    const res = await fetch('http://localhost:8000/api/dashboard')
    const data1 = await res.json()
    const chartData = [
      ['Type', 'Total'],
      ['Users', data1.totalUser],
      ['Products', data1.totalProduct],
      ['Pets', data1.totalPet],
      ['Hotels', data1.totalHotel],
      ['Contacts', data1.totalContact],
      ['Feedbacks', data1.totalFeedback],
      ['Bookings', data1.totalBooking],
      ['Appointments', data1.totalAppointment],
      ['BookingHotels', data1.totalBookingHotel],
      ['Services', data1.totalService],
      ['Bills', data1.totalBill],
    ]
    const data = window.google.visualization.arrayToDataTable(chartData)
    const options = {
      title: 'Dashboard Statistics',
      curveType: 'function',
      legend: { position: 'bottom' },
      colors: ['#2a9d8f', '#4ab8a9', '#43a047', '#ff6b6b', '#d35400', '#3498db', '#e67e22', '#9b59b6', '#1abc9c', '#f39c12', '#e74c3c', '#34495e'],
      backgroundColor: 'transparent',
      titleTextStyle: { color: '#2a9d8f', fontSize: 18, fontName: 'Fredoka' },
      hAxis: { textStyle: { color: '#333', fontName: 'Fredoka' } },
      vAxis: { textStyle: { color: '#333', fontName: 'Fredoka' } },
      // legend: { textStyle: { color: '#333', fontName: 'Fredoka' } }
    }
    const chart = new window.google.visualization.ColumnChart(
      document.getElementById('curve_chart')
    )
    chart.draw(data, options)
  } catch (error) {
    console.error(error)
  }
}

const formatPrice = (value) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value);
}

onMounted(async () => {
  const script = document.createElement('script')
  script.src = 'https://www.gstatic.com/charts/loader.js'
  script.onload = drawChart
  document.head.appendChild(script)
  try {
    const { data } = await apiClient.get('/api/dashboard')
    const res = await apiClient.get('/api/commission')
    commissions.value = res.data
    Object.assign(dashboard, data)
  } catch (err) {
    console.error('Lỗi lấy dữ liệu dashboard:', err);
    console.error("Lỗi load commissions:", err);
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-dashboard {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.admin-dashboard::before {
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
  margin-bottom: 15px;
  font-weight: 600;
  color: #2a9d8f;
  text-align: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.subtitle {
  text-align: center;
  color: #4a4a4a;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2rem;
  margin-right: 15px;
  opacity: 0.8;
}

.stat-info {
  flex: 1;
  text-align: left;
}

.stat-label {
  display: block;
  font-size: 1rem;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-weight: bold;
  font-size: 1.8rem;
  color: #2a9d8f;
}

.stat-card.user {
  border-left: 5px solid #42a5f5;
}

.stat-card.pet {
  border-left: 5px solid #66bb6a;
}

.stat-card.product {
  border-left: 5px solid #ffa726;
}

.stat-card.feedback {
  border-left: 5px solid #ab47bc;
}

.stat-card.booking {
  border-left: 5px solid #26c6da;
}

.stat-card.appointment {
  border-left: 5px solid #ef5350;
}

.stat-card.hotel {
  border-left: 5px solid #8d6e63;
}

.stat-card.bookinghotel {
  border-left: 5px solid #b3289e;
}

.stat-card.service {
  border-left: 5px solid #aad24d;
}

.stat-card.bill {
  border-left: 5px solid #24799d;
}

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.chart-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.commission-page {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  position: relative;
  overflow: hidden;
}

.commission-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.commission-title {
  font-size: 2rem;
  color: #2a9d8f;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
}

.commission-table table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.commission-table th,
.commission-table td {
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: left;
}

.commission-table th {
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
  color: #4a4a4a;
  font-size: 1.2rem;
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
  .admin-dashboard {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .stats {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  .stat-card {
    padding: 15px;
  }
  .stat-value {
    font-size: 1.5rem;
  }
  .chart-container {
    padding: 15px;
  }
  .commission-page {
    padding: 20px;
  }
  .commission-table th,
  .commission-table td {
    padding: 8px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .stats {
    grid-template-columns: 1fr;
  }
  .stat-icon {
    font-size: 1.5rem;
    margin-right: 10px;
  }
  .stat-info {
    font-size: 0.9rem;
  }
  .stat-value {
    font-size: 1.3rem;
  }
}
</style>