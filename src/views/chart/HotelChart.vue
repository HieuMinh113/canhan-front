<template>
  <div class="hotel-chart">
    <h1 class="animate-pulse">🏨 Thống kê Khách sạn</h1>
    <p class="subtitle">Thống kê tỷ lệ các loại phòng khách sạn</p>
    <div class="chart-container">
      <div id="hotel_pie_chart" style="width: 100%; height: 600px"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import apiClient from '@/service/axios'

const fetchcategoryChart = async () => {
  try {
    const res = await apiClient.get('/api/counthotel')
    const categories = res.data

    const chartData = [['category', 'Total']]
    categories.forEach(c => {
      chartData.push([c.category, c.total])
    })

    const data = window.google.visualization.arrayToDataTable(chartData)
    const options = {
      title: 'Tỷ lệ các loại phòng khách sạn',
      is3D: true,
      pieSliceText: 'percentage',
      backgroundColor: 'transparent',
      colors: ['#2a9d8f', '#f28c38', '#ff6b6b', '#42a5f5', '#66bb6a'],
      legend: { textStyle: { color: '#333', fontName: 'Fredoka', fontSize: 14 } },
      titleTextStyle: { color: '#2a9d8f', fontSize: 18, fontName: 'Fredoka', bold: true },
      chartArea: { width: '90%', height: '85%' }
    }

    const chart = new window.google.visualization.PieChart(
      document.getElementById('hotel_pie_chart')
    )
    chart.draw(data, options)
  } catch (err) {
    console.error('Lỗi khi load dữ liệu thống kê thú cưng:', err)
  }
}

onMounted(() => {
  const script = document.createElement('script')
  script.src = 'https://www.gstatic.com/charts/loader.js'
  script.onload = () => {
    window.google.charts.load('current', { packages: ['corechart'] })
    window.google.charts.setOnLoadCallback(fetchcategoryChart)
  }
  document.head.appendChild(script)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.hotel-chart {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.hotel-chart::before {
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

.chart-container {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 0 auto;
  max-width: 1000px;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.8s ease forwards;
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

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  h1 { font-size: 2.2rem; }
  .subtitle { font-size: 1rem; }
  .hotel-chart { padding: 20px; }
  .chart-container { padding: 10px; }
}
</style>
