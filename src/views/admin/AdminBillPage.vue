<template>
  <div class="bill-page">
    <h1 class="animate-pulse">🧾 Quản lý Hóa Đơn</h1>
    <p class="subtitle">Tạo và quản lý các hóa đơn cho khách hàng</p>

    <!-- Tạo hóa đơn mới -->
    <div class="bill-form">
      <h2>Tạo Hóa Đơn Mới</h2>
      <form @submit.prevent="submitBill" class="form-container">
        <div class="form-row">
          <label for="customer_name">Tên khách hàng:</label>
          <input id="customer_name" v-model="form.customer_name" required type="text" placeholder="Nhập tên khách hàng" />
        </div>
        <div class="form-row">
          <label for="customer_email">Email khách hàng:</label>
          <input
            id="customer_email"
            v-model="form.customer_email"
            type="email"
            placeholder="Nhập email (nếu có)"
            @input="onEmailInput(form.customer_email)"
          />
        </div>
        <div class="form-row" v-if="loyaltyStore.rank">
          <label>Rank khách hàng:</label>
          <span>{{ loyaltyStore.rank }} - Giảm {{ loyaltyStore.discount }} %</span>
        </div>
        <div class="form-row">
          <label for="notes">Ghi chú:</label>
          <input id="notes" v-model="form.notes" type="text" placeholder="Nhập ghi chú (nếu có)" />
        </div>
        <div class="form-row">
          <label for="coupon">Mã giảm giá:</label>
          <select v-model="selectedCoupon" @change="updateTotal">
            <option disabled value="">Chọn mã giảm giá</option>
            <option v-for="coupon in coupons" :key="coupon.id" :value="coupon">
              {{ coupon.code }} - {{ coupon.percent }} %
            </option>
          </select>
        </div>
        <div class="form-row">
          <label>Dịch vụ:</label>
          <multiselect
            v-model="selectedServices"
            :options="services"
            :multiple="true"
            label="name"
            track-by="id"
            placeholder="Chọn dịch vụ"
            @input="updateTotal"
            class="multiselect"
            :append-to-body="true"
          />
        </div>
        <div v-if="selectedServices.length" class="form-row selected-table">
          <table>
            <thead>
              <tr>
                <th>Dịch Vụ</th>
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
          <label>Khách sạn:</label>
          <multiselect
            v-model="selectedHotels"
            :options="hotels"
            :multiple="true"
            label="name"
            track-by="id"
            placeholder="Chọn khách sạn"
            @input="updateTotal"
            class="multiselect"
            :append-to-body="true"
          />
        </div>
        <div v-if="selectedHotels.length" class="form-row selected-table">
          <table>
            <thead>
              <tr>
                <th>Khách sạn</th>
                <th>Loại</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="h in selectedHotels" :key="h.id">
                <td>{{ h.name }}</td>
                <td>{{ h.category }}</td>
                <td>{{ formatPrice(h.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="form-row">
          <label>Thú Cưng:</label>
          <multiselect
            v-model="selectedPets"
            :options="pets"
            :multiple="true"
            label="name"
            track-by="id"
            placeholder="Chọn Thú Cưng"
            @input="initPetQuantities"
            class="multiselect"
            :append-to-body="true"
          />
        </div>
        <div v-if="selectedPets.length" class="form-row selected-table">
          <table>
            <thead>
              <tr>
                <th>Thú Cưng</th>
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
          <label>Sản phẩm:</label>
          <multiselect
            v-model="selectedProducts"
            :options="products"
            :multiple="true"
            label="name"
            track-by="id"
            placeholder="Chọn sản phẩm"
            @input="initProductQuantities"
            class="multiselect"
            :append-to-body="true"
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
        <div class="form-row">
          <label for="type">Loại thanh toán:</label>
          <select v-model="form.payment_type" required>
            <option disabled value="">Chọn loại thanh toán</option>
            <option value="transfer">Chuyển khoản</option>
            <option value="cash">Tiền mặt</option>
          </select>
        </div>
        <div class="form-row total-row">
          <strong>Tổng tiền: {{ formatPrice(totalPrice) }}</strong>
        </div>
        <div class="form-row button-row">
          <button type="submit" class="save-btn">➕ Lưu hóa đơn</button>
        </div>
      </form>
    </div>

    <hr class="divider" />

    <!-- Danh sách hóa đơn -->
    <div class="bill-list">
      <h2>Danh sách hóa đơn</h2>
      <div class="search-box">
        <input
          type="text"
          v-model="searchQuery"
          @input="searchProducts"
          placeholder="Tìm kiếm hóa đơn..."
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tên khách hàng</th>
            <th>Email</th>
            <th>Ghi chú</th>
            <th>Dịch Vụ</th>
            <th>Khách sạn</th>
            <th>Thú Cưng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Người tạo</th>
            <th>Ngày tạo</th>
            <th>Hình thức thanh toán</th>
            <th>Loại Thanh toán</th>
            <th>Trạng thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(bill, index) in bills" :key="bill.id">
            <td>{{ index + 1 }}</td>
            <td>{{ bill.customer_name }}</td>
            <td>{{ bill.customer_email || 'N/A' }}</td>
            <td>{{ bill.notes || 'N/A' }}</td>
            <td>
              <span v-if="bill.services && bill.services.length">
                <ul v-for="s in bill.services" :key="s.id">
                  <li>{{ s.name }}</li>
                </ul>
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <span v-if="bill.hotels && bill.hotels.length">
                <ul v-for="h in bill.hotels" :key="h.id">
                  <li>{{ h.name }}</li>
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
            <td>{{ new Date(bill.created_at).toLocaleString() }}</td>
            <td>{{ bill.payment_method || 'N/A' }}</td>
            <td>{{ bill.payment_type || 'N/A' }}</td>
            <td>{{ bill.status }}</td>
            <td>
              <button class="detail-btn">
                <router-link :to="`/adminbilldetail/${bill.id}`">Chi tiết</router-link>
              </button>
              <button @click="Accept(index)" class="accept-btn">✅ Xác Nhận</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="bills.length === 0" class="empty-state">
        <p>Chưa có hóa đơn nào. Hãy tạo hóa đơn đầu tiên!</p>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from "@/service/axios";
import Multiselect from "vue-multiselect";
import { useLoyaltyStore } from '@/stores/loyalty';

export default {
  components: { Multiselect },
  data() {
    return {
      bills: [],
      form: {
        customer_name: "",
        customer_email: "",
        status: '',
        payment_type: '',
        notes: '',
      },
      services: [],
      pets: [],
      coupons: [],
      products: [],
      hotels: [],
      selectedHotels: [],
      selectedServices: [],
      selectedPets: [],
      selectedProducts: [],
      selectedCoupon: '',
      searchQuery: '',
      searchTimeout: null,
    };
  },
  setup() {
    const loyaltyStore = useLoyaltyStore();

    const onEmailInput = async (email) => {
      await loyaltyStore.fetchByEmail(email);
    };

    return { loyaltyStore, onEmailInput };
  },
  mounted() {
    this.fetchData();
    this.fetchBills();
  },
  computed: {
    subtotal() {
      let serviceTotal = this.selectedServices.reduce(
        (sum, s) => sum + ((s.price && !isNaN(s.price)) ? s.price : 0),
        0
      );
      let hotelTotal = this.selectedHotels.reduce(
        (sum, h) => sum + ((h.price && !isNaN(h.price)) ? h.price : 0),
        0
      );
      let petTotal = this.selectedPets.reduce(
        (sum, pe) => sum + ((pe.price && !isNaN(pe.price)) ? pe.price * (pe.quantity || 1) : 0),
        0
      );
      let productTotal = this.selectedProducts.reduce(
        (sum, p) => sum + ((p.price && !isNaN(p.price)) ? p.price * (p.quantity || 1) : 0),
        0
      );
      return serviceTotal + hotelTotal + petTotal + productTotal;
    },
    discountAmount() {
      let discount = 0;
      if (this.selectedCoupon && this.selectedCoupon.percent) {
        discount += this.subtotal * (this.selectedCoupon.percent / 100);
      }
      if (this.loyaltyStore && this.loyaltyStore.discount) {
        discount += this.subtotal * (this.loyaltyStore.discount / 100);
      }
      return discount;
    },
    totalPrice() {
      return Math.max(this.subtotal - this.discountAmount, 0);
    },
  },
  methods: {
    async fetchData() {
      try {
        const [serviceRes, petRes, productRes, hotelRes, couponRes] = await Promise.all([
          apiClient.get("/api/service"),
          apiClient.get("/api/pet"),
          apiClient.get("/api/products"),
          apiClient.get("/api/hotel"),
          apiClient.get("/api/coupon"),
        ]);
        this.services = serviceRes.data;
        this.pets = petRes.data;
        this.products = productRes.data;
        this.hotels = hotelRes.data;
        this.coupons = couponRes.data;
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    },
    async fetchBills() {
      try {
        const billRes = await apiClient.get("/api/bill");
        this.bills = billRes.data;
      } catch (error) {
        console.error('Lỗi khi tải danh sách hóa đơn:', error);
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
    formatPrice(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(value);
    },
    async searchProducts() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        try {
          const res = await apiClient.get('http://localhost:8000/api/bill-search', {
            params: { search: this.searchQuery },
          });
          this.bills = res.data;
        } catch (error) {
          console.error('Lỗi tìm kiếm:', error);
        }
      }, 500);
    },
    async submitBill() {
      try {
        const payload = {
          ...this.form,
          coupon_id: this.selectedCoupon ? this.selectedCoupon.id : null,
          discount: this.discountAmount,
          notes: this.form.notes,
          services: this.selectedServices.map((s) => ({
            id: s.id,
            price: s.price || 0,
          })),
          hotels: this.selectedHotels.map((h) => ({
            id: h.id,
            category: h.category,
            price: h.price || 0,
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
        this.fetchBills();
        this.resetForm();
      } catch (error) {
        console.error('Lỗi khi tạo hóa đơn:', error);
        alert("Lỗi khi tạo hóa đơn!");
      }
    },
    resetForm() {
      this.form = {
        customer_name: "",
        customer_email: "",
        status: "",
        payment_type: "",
        notes: "",
      };
      this.selectedServices = [];
      this.selectedHotels = [];
      this.selectedPets = [];
      this.selectedProducts = [];
      this.selectedCoupon = '';
    },
    async Accept(index) {
      if (!confirm('Bạn có chắc muốn xác nhận hóa đơn này?')) return;
      const bill = this.bills[index];
      try {
        await apiClient.put(`http://localhost:8000/api/bill/${bill.id}`, {
          status: 'handled',
        });
        this.bills[index].status = 'handled';
        alert("Xác nhận hóa đơn thành công!");
      } catch (error) {
        console.error('Xác nhận thất bại:', error);
        alert("Lỗi khi xác nhận hóa đơn!");
      }
    },
    updateTotal() {
      // Trigger computed properties to recalculate totalPrice
      this.$forceUpdate();
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
  position: relative;
  overflow: hidden;
  max-width: 1800px;
  margin: 0 auto;
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

.subtitle {
  text-align: center;
  color: #4a4a4a;
  font-size: 1.2rem;
  margin-bottom: 30px;
}

h2 {
  color: #2a9d8f;
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
}

.bill-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
}

.bill-form::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
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

.form-row input[type="text"],
.form-row input[type="email"],
.form-row input[type="number"],
.form-row select,
.multiselect {
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
.form-row select:focus,
.multiselect:focus-within {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.multiselect__content-wrapper {
  max-height: 250px;
  overflow-y: auto;
  z-index: 1050;
  position: absolute;
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.multiselect__option {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.multiselect__option--highlight {
  background-color: #e6f9ff;
  color: #2a9d8f;
}

.multiselect__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  max-width: 100%;
  overflow: hidden;
}

.selected-table {
  padding-left: 160px;
  max-height: 300px;
  overflow-y: auto;
}

.selected-table table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.selected-table th,
.selected-table td {
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.selected-table th {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  font-weight: 600;
}

.selected-table td {
  color: #333;
}

.selected-table tr:hover td {
  background: rgba(42, 157, 143, 0.1);
  transition: background 0.3s ease;
}

.quantity-input {
  width: 70px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 2px solid #ddd;
  text-align: center;
  font-size: 1rem;
  background: #f9f9f9;
  transition: border-color 0.3s;
}

.quantity-input:focus {
  border-color: #2a9d8f;
  background: #fff;
}

.total-row {
  justify-content: flex-end;
  font-size: 1.3rem;
  color: #d35400;
  font-weight: 600;
  margin-top: 10px;
}

.button-row {
  justify-content: flex-end;
}

.save-btn {
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
}

.save-btn::before {
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

.save-btn:hover::before {
  width: 300px;
  height: 300px;
}

.save-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.divider {
  height: 2px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  margin: 30px auto;
  width: 80%;
  border: none;
  border-radius: 2px;
}

.bill-list {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.search-box {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.search-box input {
  padding: 12px 18px;
  width: 300px;
  max-width: 90%;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.3s;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.search-box input:focus {
  border-color: #2a9d8f;
  background: #fff;
}

.bill-list table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.bill-list th,
.bill-list td {
  padding: 12px 16px;
  background: #f9f9f9;
  border-radius: 8px;
  text-align: center;
}

.bill-list th {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  font-weight: 600;
}

.bill-list td {
  color: #333;
}

.bill-list tr:hover td {
  background: rgba(42, 157, 143, 0.1);
  transition: background 0.3s ease;
}

.detail-btn,
.accept-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 10px 15px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
  margin: 6px 0;
  display: block;
}

.accept-btn {
  background: linear-gradient(90deg, #43a047, #8bc34a);
}

.detail-btn::before,
.accept-btn::before {
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

.detail-btn:hover::before,
.accept-btn:hover::before {
  width: 200px;
  height: 200px;
}

.detail-btn:hover,
.accept-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.accept-btn:hover {
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

@media (max-width: 900px) {
  .bill-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .bill-form,
  .bill-list {
    padding: 20px;
  }
  .form-row label,
  .selected-table {
    padding-left: 0;
    width: 100px;
  }
  .bill-list th,
  .bill-list td {
    padding: 8px;
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
  .form-row label {
    font-size: 1rem;
  }
  .form-row input,
  .form-row select,
  .multiselect {
    font-size: 0.9rem;
    padding: 10px;
  }
  .save-btn,
  .detail-btn,
  .accept-btn {
    font-size: 1rem;
    padding: 12px;
  }
}
</style>