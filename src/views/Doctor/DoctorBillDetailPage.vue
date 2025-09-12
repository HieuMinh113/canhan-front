<template>
  <div class="invoice-container">
    <div class="invoice" ref="invoiceContent">
      <h1 class="invoice-title animate-pulse">📋 Chi tiết hóa đơn</h1>
      <div v-if="bill">
        <div class="invoice-info">
          <p><span class="label">Khách hàng:</span> {{ bill.customer_name }}</p>
          <p><span class="label">Email:</span> {{ bill.customer_email }}</p>
          <p><span class="label">Số Điện thoại:</span> {{ bill.phone || 'Không có' }}</p>
          <p><span class="label">Người tạo:</span> {{ bill.creator?.name }}</p>
          <p><span class="label">Địa chỉ:</span> {{ bill.city || 'Không có' }}</p>
          <p><span class="label">Đường:</span> {{ bill.district || 'Không có' }}</p>
          <p><span class="label">Huyện:</span> {{ bill.ward || 'Không có' }}</p>
          <p><span class="label">Số nhà chi tiết:</span> {{ bill.description || 'Không có' }}</p>
        </div>

        <h3 class="section-title">Dịch vụ</h3>
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Tên dịch vụ</th>
              <th>Giá (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in bill.services" :key="s.id">
              <td>{{ s.name }}</td>
              <td>{{ s.price }}</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">Thú Cưng</h3>
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Tên Thú cưng</th>
              <th>Số lượng</th>
              <th>Giá (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="pe in bill.pets" :key="pe.id">
              <td>{{ pe.name }}</td>
              <td>{{ pe.pivot.quantity }}</td>
              <td>{{ pe.price }}</td>
            </tr>
          </tbody>
        </table>

        <h3 class="section-title">Sản phẩm</h3>
        <table class="invoice-table">
          <thead>
            <tr>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá (VNĐ)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in bill.products" :key="p.id">
              <td>{{ p.name }}</td>
              <td>{{ p.pivot.quantity }}</td>
              <td>{{ p.price }}</td>
            </tr>
          </tbody>
        </table>

        <div class="invoice-total">
          <strong>Tổng tiền:</strong> <span>{{ bill.total_price }} VNĐ</span>
        </div>
        <button @click="downloadPDF" class="print-btn">📄 Tải PDF</button>
      </div>
      <div v-else class="loading-state">⏳ Đang tải...</div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';
import html2pdf from "html2pdf.js";

export default {
  data() {
    return {
      quantity: '',
      bill: [],
      products: [],
      services: [],
      pets: []
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const res = await apiClient.get(`/api/bills/${id}`);
      this.bill = res.data;
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    downloadPDF() {
      const element = this.$refs.invoiceContent;
      const printBtn = element.querySelector(".print-btn");

      if (printBtn) printBtn.style.display = "none";

      const opt = {
        margin: [5, 5, 5, 5],
        filename: `hoa-don-${Date.now()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          if (printBtn) printBtn.style.display = "inline-block";
        });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=flat');

.invoice-container {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.invoice-container::before {
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

.invoice {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 700px;
  width: 100%;
  position: relative;
  animation: slideUp 0.8s ease forwards;
}

.invoice::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.invoice-title {
  text-align: center;
  font-size: 2.8rem;
  font-weight: 600;
  color: #2a9d8f;
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.invoice-info {
  margin-bottom: 30px;
  padding: 20px;
  background: rgba(42, 157, 143, 0.05);
  border-radius: 12px;
  border-left: 4px solid #2a9d8f;
}

.invoice-info p {
  font-size: 1.1rem;
  color: #333;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(42, 157, 143, 0.1);
  padding-bottom: 8px;
}

.label {
  font-weight: 600;
  color: #f28c38;
  min-width: 150px;
}

.section-title {
  font-size: 1.6rem;
  font-weight: 600;
  color: #2a9d8f;
  margin: 30px 0 15px;
  border-bottom: 2px solid #2a9d8f;
  padding-bottom: 5px;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.invoice-table th, .invoice-table td {
  padding: 12px 15px;
  text-align: left;
  font-size: 1rem;
  color: #333;
}

.invoice-table th {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  font-weight: 600;
  text-transform: uppercase;
}

.invoice-table td {
  border-bottom: 1px solid rgba(42, 157, 143, 0.1);
}

.invoice-table tr:last-child td {
  border-bottom: none;
}

.invoice-table tr:hover {
  background: rgba(42, 157, 143, 0.05);
}

.invoice-total {
  text-align: right;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f28c38;
  margin-top: 20px;
  padding: 15px;
  background: rgba(242, 140, 56, 0.1);
  border-radius: 10px;
}

.invoice-total span {
  color: #2a9d8f;
}

.print-btn {
  display: block;
  margin: 30px auto 0;
  padding: 15px 30px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.print-btn::before {
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

.print-btn:hover::before {
  width: 300px;
  height: 300px;
}

.print-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.loading-state {
  text-align: center;
  font-size: 1.2rem;
  color: #4a4a4a;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease;
}

@media print {
  .print-btn {
    display: none !important;
  }
  .invoice-container {
    background: #fff;
    padding: 0;
  }
  .invoice {
    box-shadow: none;
    border-radius: 0;
    padding: 20px;
    max-width: 100%;
  }
  .invoice::before {
    display: none;
  }
  .invoice-title {
    animation: none;
  }
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
  .invoice-container {
    padding: 20px;
  }
  .invoice {
    padding: 20px;
    max-width: 90%;
  }
  .invoice-title {
    font-size: 2.2rem;
  }
  .invoice-info p {
    font-size: 1rem;
    flex-direction: column;
    text-align: left;
  }
  .label {
    min-width: 100px;
  }
  .invoice-table th, .invoice-table td {
    font-size: 0.95rem;
    padding: 10px;
  }
}

@media (max-width: 480px) {
  .invoice-title {
    font-size: 1.8rem;
  }
  .invoice-info p {
    font-size: 0.9rem;
  }
  .section-title {
    font-size: 1.4rem;
  }
  .invoice-table th, .invoice-table td {
    font-size: 0.85rem;
    padding: 8px;
  }
  .invoice-total {
    font-size: 1.2rem;
  }
  .print-btn {
    font-size: 1rem;
    padding: 12px 20px;
  }
}
</style>