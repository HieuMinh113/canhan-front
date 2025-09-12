<template>
  <div class="invoice-page">
    <h1 class="animate-pulse">📄 Chi tiết hóa đơn</h1>
    <p class="subtitle">Thông tin chi tiết về hóa đơn của bạn</p>

    <div class="invoice" ref="invoiceContent">
      <div v-if="bill">
        <div class="invoice-info">
          <p><span class="label">Khách hàng:</span> {{ bill.customer_name }}</p>
          <p><span class="label">Email:</span> {{ bill.customer_email }}</p>
          <p><span class="label">Số Điện thoại:</span> {{ bill.phone || 'Không có' }}</p>
          <p><span class="label">Người tạo:</span> {{ bill.creator?.name || 'Không có' }}</p>
          <p><span class="label">Địa chỉ:</span> {{ bill.city || 'Không có' }}</p>
          <p><span class="label">Đường:</span> {{ bill.district || 'Không có' }}</p>
          <p><span class="label">Huyện:</span> {{ bill.ward || 'Không có' }}</p>
          <p><span class="label">Số nhà chi tiết:</span> {{ bill.description || 'Không có' }}</p>
          <p><span class="label">Mã giảm giá:</span> {{ bill.coupon?.code || 'Không có' }}</p>
          <p v-if="discountLoyalty > 0">
            <span class="label">Giảm giá thành viên ({{ rank }}):</span> {{ discountLoyalty }} %
          </p>
        </div>

        <hr class="divider" />

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

        <h3 class="section-title">Thú cưng</h3>
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
          <strong>Tổng tiền:</strong>
          <span>{{ (bill.total_price - discountLoyalty) || bill.total_price }} VNĐ</span>
        </div>

        <button @click="downloadPDF" class="print-btn">📄 Tải PDF</button>
      </div>
      <div v-else class="empty-state">Đang tải...</div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';
import html2pdf from 'html2pdf.js';

export default {
  data() {
    return {
      bill: null,
      rank: null,
      discountLoyalty: 0,
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const res = await apiClient.get(`/api/bills/${id}`);
      this.bill = res.data.bill;
      this.rank = res.data.rank;
      this.discountLoyalty = res.data.discountLoyalty;
    } catch (err) {
      console.error(err);
    }
  },
  methods: {
    downloadPDF() {
      const element = this.$refs.invoiceContent;
      const printBtn = element.querySelector('.print-btn');

      if (printBtn) printBtn.style.display = 'none';

      const opt = {
        margin: [10, 10, 10, 10],
        filename: `hoa-don-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      };

      html2pdf()
        .set(opt)
        .from(element)
        .save()
        .then(() => {
          if (printBtn) printBtn.style.display = 'inline-block';
        });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=fredoka');

.invoice-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.invoice-page::before {
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

.invoice {
  background: rgba(255, 255, 255, 0.95);
  padding: 32px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  margin: 0 auto;
  animation: slideUp 0.8s ease forwards;
  position: relative;
  overflow: hidden;
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

.invoice-info {
  margin-bottom: 24px;
}

.label {
  font-weight: 600;
  color: #2a9d8f;
  min-width: 120px;
  display: inline-block;
  font-size: 1.1rem;
}

.section-title {
  margin-top: 24px;
  margin-bottom: 12px;
  color: #2a9d8f;
  font-size: 1.3rem;
  font-weight: 600;
}

.invoice-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 10px;
  overflow: hidden;
}

.invoice-table th,
.invoice-table td {
  border: 1px solid #dfe6e9;
  padding: 12px 16px;
  text-align: left;
  font-size: 1rem;
}

.invoice-table th {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  font-weight: 600;
}

.invoice-table td {
  background: #f9f9f9;
  color: #333;
}

.invoice-table tr:hover td {
  background: rgba(42, 157, 143, 0.1);
  transition: background 0.3s ease;
}

.invoice-total {
  text-align: right;
  font-size: 1.3rem;
  margin-top: 20px;
  color: #d35400;
  font-weight: 600;
}

.print-btn {
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
  width: 100%;
  margin-top: 20px;
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

@media print {
  .print-btn {
    display: none !important;
  }
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  margin: 30px auto;
  width: 80%;
  border: none;
  border-radius: 2px;
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
  .invoice-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .invoice {
    padding: 20px;
  }
  .invoice-table th,
  .invoice-table td {
    padding: 8px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .invoice-info .label {
    font-size: 1rem;
  }
  .section-title {
    font-size: 1.1rem;
  }
  .print-btn {
    font-size: 1rem;
    padding: 12px;
  }
}
</style>