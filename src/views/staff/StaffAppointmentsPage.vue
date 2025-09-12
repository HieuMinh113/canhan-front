<template>
  <div class="staff-appointments-page">
    <h1 class="animate-pulse">📅 Lịch hẹn của bạn</h1>
    <p class="subtitle">Dưới đây là các lịch hẹn đã được phân công cho bạn.</p>

    <!-- Tổng số -->
    <div class="summary-box">
      <p><strong>Tổng số lịch hẹn:</strong> {{ appointments.length }}</p>
    </div>

    <!-- Danh sách lịch hẹn -->
    <div class="appointment-list">
      <div class="appointment-card" v-for="(appointment, index) in appointments" :key="index">
        <h3><strong>Khách hàng:</strong> {{ appointment.owner }}</h3>
        <p><strong>Email:</strong> {{ appointment.email }}</p>
        <p><strong>Tên thú cưng:</strong> {{ appointment.name }}</p>
        <p><strong>Dịch vụ:</strong> {{ appointment.service.name }}</p>
        <p class="date"><strong>Ngày hẹn:</strong> {{ appointment.date }} lúc {{ appointment.time }}</p>
        <p><strong>Nhân viên phục vụ:</strong> {{ staff.name }}</p>
        <p><strong>Trạng thái:</strong> 
            <span :style="{ color: appointment.handled ? '#43a047' : '#ff6b6b' }">
                {{ appointment.handled ? '✅ Đã xử lý' : '❌ Chưa xử lý'  }}
            </span>
        </p>
        <button @click="Accept(index)">Xác nhận phan hoi</button>
      </div>
    </div>
    <div v-if="appointments.length === 0" class="empty-state">
      <p>Hiện tại chưa có lịch hẹn nào.</p>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';


export default {
  name: "StaffAppointmentsPage",
  data() {
    return {
      appointments: [],
      appointment: {
        name: "",
        date: "", 
        time: "",
        service: "",
        staff: "",
        email:"",
        owner:"", 
        handled:"",
      },
      staff: {},
    };
  },
  async created(){
  const id = this.$route.params.id;
  try {
    const staffRes = await apiClient.get(`/api/staff/${id}`);
    this.staff = staffRes.data;

    const appointmentsRes = await apiClient.get(`/api/staff/${id}/appointment`);
    this.appointments = appointmentsRes.data;

  } catch (err) {
    console.log(err);
    alert("Lỗi tải dữ liệu");
  }
},
methods:{
  async Accept(index) {
      if (!confirm('Bạn có chắc muốn xac nhan tin này?')) return;
      const appointment = this.appointments[index];
      try {
        await apiClient.put(`/api/appointment/${appointment.id}`,{
          handled:true
        });
        this.appointments[index].handled = true;
        alert('Xác nhận lịch hẹn thành công!');
      } catch (error) {
        console.error('xác nhận thất bại:', error);
      }
    }
}
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.staff-appointments-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
}

.staff-appointments-page::before {
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

.summary-box {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  color: #2a9d8f;
  font-weight: 600;
  font-size: 1.2rem;
  position: relative;
  overflow: hidden;
}

.summary-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.appointment-list {
  max-width: 850px;
  margin: 20px auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.appointment-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: slideUp 0.5s ease forwards;
}

.appointment-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.appointment-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.appointment-card h3 {
  margin-bottom: 12px;
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
}

.appointment-card p {
  margin: 8px 0;
  color: #333;
  line-height: 1.5;
  font-size: 1rem;
}

.appointment-card .date {
  font-style: italic;
  color: #888;
  font-size: 0.95rem;
}

button {
  background: linear-gradient(90deg, #43a047, #8bc34a);
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
  box-shadow: 0 4px 15px rgba(67, 160, 71, 0.3);
  margin-top: 12px;
}

button::before {
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

button:hover::before {
  width: 200px;
  height: 200px;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 160, 71, 0.4);
  background: linear-gradient(90deg, #388e3c, #cddc39);
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
</style>
