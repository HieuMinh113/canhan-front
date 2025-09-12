<template>
  <div class="bill-page">
    <h1 class="animate-pulse">🧾 Quản lý Hóa Đơn</h1>
    <p class="intro-text">Tạo và quản lý hóa đơn cho khách hàng</p>

    <!-- Tạo hóa đơn mới -->
    <div class="bill-form">
      <h2>Tạo Hóa Đơn Mới</h2>
      <form @submit.prevent="submitBill" class="form-container">
        <div class="form-row">
          <label for="customer_name">Tên khách hàng:</label>
          <input id="customer_name" v-model="form.customer_name" required placeholder="Nhập tên khách hàng" />
        </div>
        <div class="form-row">
          <label for="customer_email">Email khách hàng:</label>
          <input id="customer_email" v-model="form.customer_email" type="email" placeholder="Nhập email (nếu có)" />
        </div>
        <div class="form-row">
          <label for="services">Dịch vụ:</label>
          <multiselect
            id="services"
            v-model="selectedServices"
            :options="services"
            :multiple="true"
            label="name"
            track-by="id"
            placeholder="Chọn dịch vụ"
            @input="updateTotal"
            class="multiselect"
          />
        </div>
        <div v-if="selectedServices.length" class="form-row selected-table">
          <table>
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in selectedServices" :key="s.id">
                <td>{{ s.name }}</td>
                <td>{{ formatPrice(s.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-row">
          <label for="pets">Thú cưng:</label>
          <multiselect
            id="pets"
            v-model="selectedPets"
            :options="pets"
            :multiple="true"
            label="name"
            track-by="id"
            placeholder="Chọn thú cưng"
            @input="initPetQuantities"
            class="multiselect"
          />
        </div>
        <div v-if="selectedPets.length" class="form-row selected-table">
          <table>
            <thead>
              <tr>
                <th>Thú cưng</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pe in selectedPets" :key="pe.id">
                <td>{{ pe.name }}</td>
                <td>{{ formatPrice(pe.price) }}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    v-model.number="pe.quantity"
                    @input="updateTotal"
                    class="quantity-input"
                  />
                </td>
                <td>{{ formatPrice(pe.price * pe.quantity) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-row">
          <label for="products">Sản phẩm:</label>
          <multiselect
            id="products"
            v-model="selectedProducts"
            :options="products"
            :multiple="true"
            label="name"
            track-by="id"
            placeholder="Chọn sản phẩm"
            @input="initProductQuantities"
            class="multiselect"
          />
        </div>
        <div v-if="selectedProducts.length" class="form-row selected-table">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in selectedProducts" :key="p.id">
                <td>{{ p.name }}</td>
                <td>{{ formatPrice(p.price) }}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    v-model.number="p.quantity"
                    @input="updateTotal"
                    class="quantity-input"
                  />
                </td>
                <td>{{ formatPrice(p.price * p.quantity) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-row total-row">
          <strong>Tổng tiền: {{ formatPrice(totalPrice) }}</strong>
        </div>
        <div class="form-row button-row">
          <button type="submit" class="submit-btn">💾 Lưu hóa đơn</button>
        </div>
      </form>
    </div>

    <!-- Danh sách hóa đơn -->
    <div class="bill-list">
      <h2>Danh sách hóa đơn</h2>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên khách hàng</th>
            <th>Email</th>
            <th>Dịch vụ</th>
            <th>Thú cưng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Người tạo</th>
            <th>Ngày tạo</th>
            <th>Hình thức thanh toán</th>
            <th>Loại thanh toán</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bill, index) in bills" :key="bill.id">
            <td>{{ index + 1 }}</td>
            <td>{{ bill.customer_name }}</td>
            <td>{{ bill.customer_email || 'N/A' }}</td>
            <td>
              <span v-if="bill.services && bill.services.length">
                <ul v-for="s in bill.services" :key="s.id">
                  <li>{{ s.name }}</li>
                </ul>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="bill.pets && bill.pets.length">
                <ul v-for="pe in bill.pets" :key="pe.id">
                  <li>{{ pe.name }}</li>
                </ul>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="bill.products && bill.products.length">
                <ul v-for="p in bill.products" :key="p.id">
                  <li>{{ p.name }}</li>
                </ul>
              </span>
              <span v-else>-</span>
            </td>
            <td>{{ formatPrice(bill.total_price) }}</td>
            <td>{{ bill.creator?.name || 'N/A' }}</td>
            <td>{{ formatDate(bill.created_at) }}</td>
            <td>{{ bill.payment_method || 'N/A' }}</td>
            <td>{{ bill.payment_type || 'N/A' }}</td>
            <td>{{ bill.status || 'N/A' }}</td>
            <td>
              <button class="detail-btn">
                <router-link :to="`/staffbilldetail/${bill.id}`">Chi tiết</router-link>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import apiClient from "@/service/axios";
import Multiselect from "vue-multiselect";

export default {
  components: { Multiselect },
  data() {
    return {
      bills: [],
      form: {
        customer_name: "",
        customer_email: "",
        status: "",
      },
      services: [],
      pets: [],
      products: [],
      selectedServices: [],
      selectedPets: [],
      selectedProducts: [],
      totalPrice: 0,
    };
  },
  mounted() {
    this.fetchData();
    this.fetchBills();
  },
  methods: {
    async fetchData() {
      try {
        const [serviceRes, petRes, productRes] = await Promise.all([
          apiClient.get("/api/service"),
          apiClient.get("/api/pet"),
          apiClient.get("/api/products"),
        ]);
        this.services = serviceRes.data;
        this.pets = petRes.data;
        this.products = productRes.data;
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
        alert('Không thể tải dữ liệu dịch vụ, thú cưng hoặc sản phẩm!');
      }
    },
    async fetchBills() {
      try {
        const billRes = await apiClient.get("/api/bill");
        this.bills = billRes.data;
      } catch (error) {
        console.error('Lỗi khi tải danh sách hóa đơn:', error);
        alert('Không thể tải danh sách hóa đơn!');
      }
    },
    initProductQuantities() {
      this.selectedProducts.forEach((p) => {
        if (!p.quantity) p.quantity = 1;
      });
      this.updateTotal();
    },
    initPetQuantities() {
      this.selectedPets.forEach((pe) => {
        if (!pe.quantity) pe.quantity = 1;
      });
      this.updateTotal();
    },
    updateTotal() {
      let serviceTotal = this.selectedServices.reduce(
        (sum, s) => sum + (s.price && !isNaN(s.price) ? s.price : 0),
        0
      );
      let petTotal = this.selectedPets.reduce(
        (sum, pe) => sum + (pe.price && !isNaN(pe.price) ? pe.price : 0) * (pe.quantity || 1),
        0
      );
      let productTotal = this.selectedProducts.reduce(
        (sum, p) => sum + (p.price && !isNaN(p.price) ? p.price : 0) * (p.quantity || 1),
        0
      );
      this.totalPrice = serviceTotal + petTotal + productTotal;
    },
    formatPrice(value) {
      if (!value) return '0 đ';
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    async submitBill() {
      try {
        const payload = {
          ...this.form,
          services: this.selectedServices.map((s) => ({
            id: s.id,
            price: s.price || 0,
          })),
          pets: this.selectedPets.map((pe) => ({
            id: pe.id,
            price: pe.price,
            quantity: pe.quantity || 1,
          })),
          products: this.selectedProducts.map((p) => ({
            id: p.id,
            price: p.price,
            quantity: p.quantity || 1,
          })),
          total_price: this.totalPrice,
        };
        await apiClient.post("/api/bill", payload);
        alert("Tạo hóa đơn thành công!");
        this.form = { customer_name: "", customer_email: "", status: "" };
        this.selectedServices = [];
        this.selectedPets = [];
        this.selectedProducts = [];
        this.totalPrice = 0;
        this.fetchBills();
      } catch (error) {
        console.error('Lỗi khi tạo hóa đơn:', error);
        alert('Tạo hóa đơn thất bại!');
      }
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.bill-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.bill-page::before {
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

.intro-text {
  text-align: center;
  color: #4a4a4a;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.bill-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

h2 {
  font-size: 1.8rem;
  color: #2a9d8f;
  text-align: center;
  margin-bottom: 20px;
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
  width: 150px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.form-row input,
.form-row .multiselect {
  flex: 1;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1rem;
  background: #f9f9f9;
  transition: all 0.3s ease;
}

.form-row input:focus,
.form-row .multiselect:focus-within {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.selected-table {
  padding-left: 150px;
}

.selected-table table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
  font-size: 1rem;
}

.selected-table th,
.selected-table td {
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.selected-table th {
  background: rgba(42, 157, 143, 0.1);
  color: #2a9d8f;
  font-weight: 600;
}

.quantity-input {
  width: 80px;
  padding: 8px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  background: #f9f9f9;
  text-align: center;
  transition: all 0.3s ease;
}

.quantity-input:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
}

.total-row {
  justify-content: flex-end;
  font-size: 1.3rem;
  color: #2a9d8f;
  font-weight: 600;
}

.button-row {
  justify-content: flex-end;
}

.submit-btn {
  padding: 12px 25px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.submit-btn::before {
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

.submit-btn:hover::before {
  width: 200px;
  height: 200px;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.bill-list {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.bill-list h2 {
  font-size: 1.8rem;
  color: #2a9d8f;
  margin-bottom: 20px;
  text-align: center;
}

.bill-list table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.bill-list th,
.bill-list td {
  padding: 12px;
  text-align: center;
  background: #f8fafc;
  border-radius: 8px;
}

.bill-list th {
  background: rgba(42, 157, 143, 0.1);
  color: #2a9d8f;
  font-weight: 600;
}

.bill-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bill-list ul li {
  margin: 5px 0;
}

.detail-btn {
  background: linear-gradient(90deg, #f28c38, #ff8c42);
  color: #fff;
  border: none;
  padding: 8px 15px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(242, 140, 56, 0.3);
}

.detail-btn::before {
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

.detail-btn:hover::before {
  width: 200px;
  height: 200px;
}

.detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 140, 56, 0.4);
}

.detail-btn a {
  color: #fff;
  text-decoration: none;
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 900px) {
  .bill-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .intro-text {
    font-size: 1rem;
  }
  .form-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .form-row label {
    width: 100%;
  }
  .selected-table {
    padding-left: 0;
  }
  .bill-list table {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  h2 {
    font-size: 1.5rem;
  }
  .form-row input,
  .form-row .multiselect {
    font-size: 0.95rem;
    padding: 10px;
  }
  .submit-btn, .detail-btn {
    font-size: 1rem;
    padding: 10px 20px;
  }
  .bill-list th,
  .bill-list td {
    padding: 8px;
  }
}
</style>