<template>
  <div class="cart-page">
    <h1 class="animate-pulse">🛒 Giỏ hàng của bạn</h1>
    <div v-if="cartStore.error" class="error-message">
      {{ cartStore.error }}
    </div>
    <div v-else-if="items.length === 0" class="empty-cart">
      <p>Giỏ hàng hiện đang trống. Hãy thêm sản phẩm để tiếp tục mua sắm!</p>
    </div>

    <div v-else>
      <!-- Bảng giỏ hàng -->
      <table class="cart-table">
        <thead>
          <tr>
            <th>Hình ảnh</th>
            <th>Sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Tổng</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.product_id || item.pet_id">
            <td>
              <img :src="item.product?.image || item.pet?.image" alt="" class="cart-item-image" />
            </td>
            <td>{{ item.product?.name || item.pet?.name || null }}</td>
            <td>{{ formatPrice(item.product?.price || item.pet?.price || 0) }} </td>
            <td>
              <input
                type="number"
                v-model.number="item.quantity"
                min="1"
                @change="updateQuantity(item)"
              />
            </td>
            <td>{{ formatPrice((item.product?.price || item.pet?.price || item.price) * item.quantity) }}</td>
            <td>
              <button class="remove-btn" @click="removeItem(item.product_id, item.pet_id)">🗑 Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Tổng cộng -->
      <div class="cart-summary">
        <p><strong>Tổng tiền: {{ formatPrice(cartStore.totalAfterDiscount) }}</strong></p>
      </div>

      <!-- Form thanh toán -->
      <div class="checkout-section">
        <!-- Địa chỉ -->
        <div class="checkout-column">
          <h3 class="emoji-glow">1. Địa chỉ giao hàng</h3>
          <input v-model="checkoutForm.customer_name" placeholder="Họ và tên" />
          <input v-model="checkoutForm.customer_email" placeholder="E-mail" />
          <input v-model="checkoutForm.phone" placeholder="Số điện thoại" />

          <!-- Tỉnh/Thành phố -->
          <select v-model="checkoutForm.city">
            <option value="">Chọn Tỉnh/Thành phố</option>
            <option v-for="c in cities" :key="c.code" :value="c.code">
              {{ c.name }}
            </option>
          </select>

          <!-- Quận/Huyện -->
          <select v-model="checkoutForm.district" :disabled="!checkoutForm.city">
            <option value="">Chọn Quận/Huyện</option>
            <option v-for="d in filteredDistricts" :key="d.code" :value="d.code">
              {{ d.name }}
            </option>
          </select>

          <!-- Phường/Xã -->
          <select v-model="checkoutForm.ward" :disabled="!checkoutForm.district">
            <option value="">Chọn Phường/Xã</option>
            <option v-for="w in filteredWards" :key="w.code" :value="w.code">
              {{ w.name }}
            </option>
          </select>

          <textarea v-model="checkoutForm.description" placeholder="Số nhà chi tiết"></textarea>
        </div>

        <!-- Phương thức thanh toán -->
        <div class="checkout-column">
          <h3 class="emoji-glow">2. Phương thức thanh toán</h3>
          <label class="payment-option"><input type="radio" value="cod" v-model="checkoutForm.payment_method" /> 🏠 Thanh toán tại nhà (COD)</label>
          <label class="payment-option"><input type="radio" value="store" v-model="checkoutForm.payment_method" /> 🏪 Thanh toán tại cửa hàng</label>
          <label class="payment-option"><input type="radio" value="momo" v-model="checkoutForm.payment_method" /> 💳 Thanh toán qua MoMo</label>
          <label class="payment-option">
            <input type="radio" value="transfer" v-model="checkoutForm.payment_method" /> 🏦 Chuyển khoản qua ngân hàng
          </label>
          <div v-if="checkoutForm.payment_method === 'transfer'" class="bank-info">
            <p><strong>🏦 Ngân hàng:</strong> hehe</p>
            <p><strong>📍 Chi nhánh:</strong> Lil Hmm</p>
            <p><strong>👤 Chủ tài khoản:</strong> Công ty TNHH Hmm Pet Shop</p>
            <p><strong>💳 Số tài khoản:</strong> 14102003</p>
          </div>
          <p class="payment-info">Phương thức: {{ checkoutForm.payment_method || 'Chưa chọn' }}</p>
          <p class="payment-info">Loại thanh toán: {{ checkoutForm.payment_type || 'Chưa chọn' }}</p>
        </div>

        <!-- Hóa đơn -->
        <div class="checkout-column">
          <h3 class="emoji-glow">3. Hóa đơn mua hàng</h3>
          <div v-for="item in items" :key="item.product_id || item.pet_id" class="invoice-item">
            <p><strong>{{ item.product?.name || item.pet?.name || item.name }}</strong></p>
            <p>{{ item.quantity }} x {{ formatPrice(item.product?.price || item.pet?.price || item.price) }}</p>
          </div>
          <!-- Nhập mã giảm giá -->
          <div class="coupon-section">
            <input v-model="couponCode" placeholder="Nhập mã giảm giá" />
            <button @click="cartStore.applyCoupon(couponCode)" class="coupon-btn">🎟 Áp dụng</button>
            <button v-if="cartStore.coupon_id" @click="cartStore.removeCoupon" class="coupon-btn remove">❌ Xóa mã</button>

            <p v-if="cartStore.error" class="error">{{ cartStore.error }}</p>
            <!-- Hiển thị khi có coupon -->
            <p v-if="cartStore.coupon_id && cartStore.discount > 0" class="success">
              Mã <strong>{{ cartStore.coupon_code }}</strong> đã áp dụng!
              Giảm {{ formatPrice(cartStore.discount) }}
            </p>
          </div>
          <div class="cart-summary">
            <p><strong>Tổng tiền gốc:</strong> {{ formatPrice(cartStore.totalPrice) }}</p>
            <p v-if="loyaltyStore.discount > 0">
              🎖 Giảm giá thành viên ({{ loyaltyStore.rank }} - {{ loyaltyStore.discount }}%):
              -{{ formatPrice(Math.floor(cartStore.totalPrice * (loyaltyStore.discount / 100))) }}
            </p>
            <p v-if="cartStore.discount > 0">
              🎟 Giảm từ mã: -{{ formatPrice(cartStore.discount) }}
            </p>
            <h3>Tổng thanh toán: {{ formatPrice(cartStore.totalAfterDiscount) }}</h3>
          </div>
          <button class="place-order-btn" @click="checkout">🛒 ĐẶT HÀNG</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed, reactive, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useLoyaltyStore } from '@/stores/loyalty';
import { storeToRefs } from 'pinia';
import citiesMap from 'hanhchinhvn/dist/tinh_tp.json'
import districtsMap from 'hanhchinhvn/dist/quan_huyen.json'
import wardsMap from 'hanhchinhvn/dist/xa_phuong.json'

const cartStore = useCartStore();
const loyaltyStore = useLoyaltyStore();
const { items } = storeToRefs(cartStore);
const cities = Object.values(citiesMap)
const couponCode = reactive({ value: '' })

const checkoutForm = reactive({
  customer_name: '',
  customer_email: '',
  phone: '',
  city: '',
  district: '',
  ward: '',
  description: '',
  payment_method: '',  
  payment_type: '',
});

const filteredDistricts = computed(() => {
  if (!checkoutForm.city) return []
  return Object.values(districtsMap).filter(d => d.parent_code === checkoutForm.city)
})

const filteredWards = computed(() => {
  if (!checkoutForm.district) return []
  return Object.values(wardsMap).filter(w => w.parent_code === checkoutForm.district)
})

watch(() => checkoutForm.city, () => { checkoutForm.district = ''; checkoutForm.ward = '' })
watch(() => checkoutForm.district, () => { checkoutForm.ward = '' })
watch(() => checkoutForm.payment_method, (newVal) => {
  if (newVal === 'transfer' || newVal === 'momo' || newVal === 'cod' ) {
    checkoutForm.payment_type = 'transfer'
  } else if (newVal === 'store') {
    checkoutForm.payment_type = 'cash'
  } else {
    checkoutForm.payment_type = ''
  }
})

onMounted(() => {
  cartStore.fetchCart();
  loyaltyStore.fetchLoyalty();
});

const totalPrice = computed(() => {
  return items.value.reduce((sum, item) => {
    const price = item.product?.price || item.pet?.price || item.price;
    return sum + price * item.quantity;
  }, 0);
});

function formatPrice(price) {
  if (typeof price !== "number") return "0 ₫";
  return price.toLocaleString("vi-VN") + " ₫";
}

function updateQuantity(item) {
  cartStore.updateCart(item.product_id , item.pet_id, item.quantity );
}

function removeItem(product_id, pet_id) {
  cartStore.removeFromCart(product_id, pet_id);
}

async function checkout() {
  const cityName = cities.find(c => c.code === checkoutForm.city)?.name || ''
  const districtName = filteredDistricts.value.find(d => d.code === checkoutForm.district)?.name || ''
  const wardName = filteredWards.value.find(w => w.code === checkoutForm.ward)?.name || ''

  const payload = {
    customer_email: checkoutForm.customer_email,
    customer_name: checkoutForm.customer_name,
    services: [], 
    products: items.value
      .filter(item => item.product)
      .map(item => ({
        id: item.product.id,
        price: item.product?.price || item.price,
        quantity: item.quantity
      })),
    pets: items.value
      .filter(item => item.pet)
      .map(item => ({
        id: item.pet.id,
        price: item.pet?.price || item.price,
        quantity: item.quantity
      })),
    total_price: totalPrice.value,
    payment_method: checkoutForm.payment_method,
    payment_type: checkoutForm.payment_type,
    description: checkoutForm.description,
    phone: checkoutForm.phone,
    city: cityName,
    district: districtName,
    ward: wardName,
    coupon: cartStore.coupon,
    discount: cartStore.discount,
  }

  if (!checkoutForm.customer_name || !checkoutForm.customer_email || !checkoutForm.phone ||
      !checkoutForm.city || !checkoutForm.district || !checkoutForm.ward || !checkoutForm.payment_method) {
    alert('Vui lòng nhập đầy đủ thông tin!')
    return;
  }

  try {
    if (checkoutForm.payment_method === 'momo') {
      const res = await fetch("/api/momo-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_email: checkoutForm.customer_email,
          customer_name: checkoutForm.customer_name,
          services: [], 
          products: items.value.filter(i => i.product).map(i => ({
            id: i.product.id,
            price: i.product.price, 
            quantity: i.quantity
          })),
          pets: items.value.filter(i => i.pet).map(i => ({
            id: i.pet.id,
            price: i.pet.price,
            quantity: i.quantity
          })),
          amount: cartStore.totalAfterDiscount,
          payment_method: checkoutForm.payment_method,
          payment_type: checkoutForm.payment_type,
          description: checkoutForm.description,
          phone: checkoutForm.phone,
          city: cityName,
          district: districtName,
          ward: wardName,
          coupon_code: cartStore.coupon_code,
          coupon_id: cartStore.coupon_id,
          discount: cartStore.discount,
        })
      });
      const data = await res.json();
      await cartStore.clearCart()
      cartStore.fetchCart()
      if (data.payUrl) {
        window.location.href = data.payUrl;
        return; 
      } else {
        alert('Không tạo được link thanh toán MoMo');
        return;
      }
    }
    await cartStore.checkout(payload)
    alert('Đặt hàng thành công!')
    await cartStore.clearCart()
    cartStore.fetchCart()
  } catch (err) {
    console.error('Lỗi khi tạo hóa đơn:', err)
    alert('Có lỗi xảy ra khi đặt hàng')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.cart-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 40px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.cart-page::before {
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
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.error-message {
  text-align: center;
  color: #ff6b6b;
  font-size: 1.2rem;
  margin-bottom: 20px;
  background: rgba(255, 107, 107, 0.1);
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #ff6b6b;
  animation: fadeIn 0.5s ease;
}

.empty-cart {
  text-align: center;
  font-size: 1.3rem;
  color: #4a4a4a;
  padding: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
  animation: slideUp 0.8s ease forwards;
}

/* Bảng giỏ hàng */
.cart-table {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
  animation: slideUp 0.8s ease forwards;
}

.cart-table th {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 15px;
  font-weight: 600;
  text-align: center;
  border: none;
}

.cart-table td {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #e8f0ff;
  vertical-align: middle;
  transition: background-color 0.3s ease;
}

.cart-table tr:hover {
  background: rgba(42, 157, 143, 0.05);
}

.cart-item-image {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e8f0ff;
  transition: transform 0.3s ease;
}

.cart-table tr:hover .cart-item-image {
  transform: scale(1.05);
}

input[type="number"] {
  width: 80px;
  padding: 8px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fff;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

input[type="number"]:focus {
  border-color: #2a9d8f;
  outline: none;
  box-shadow: 0 0 5px rgba(42, 157, 143, 0.3);
}

.remove-btn {
  background: transparent;
  border: none;
  color: #ff6b6b;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 5px 10px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: rgba(255, 107, 107, 0.1);
  transform: scale(1.1);
  color: #ff8787;
}

/* Tổng tiền */
.cart-summary {
  text-align: right;
  font-size: 1.4rem;
  margin: 20px 0;
  font-weight: 600;
  color: #2a9d8f;
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

/* Checkout section */
.checkout-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  margin-top: 40px;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.checkout-column {
  background: rgba(255, 255, 255, 0.95);
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.8s ease forwards;
}

.checkout-column:nth-child(1) { animation-delay: 0.1s; }
.checkout-column:nth-child(2) { animation-delay: 0.2s; }
.checkout-column:nth-child(3) { animation-delay: 0.3s; }

.checkout-column h3 {
  margin-bottom: 20px;
  font-size: 1.4rem;
  color: #f28c38;
  text-align: center;
  position: relative;
}

.emoji-glow:hover {
  transform: scale(1.15);
  text-shadow: 0 0 10px rgba(242, 140, 56, 0.5);
  transition: all 0.3s ease;
}

.checkout-column input,
.checkout-column textarea,
.checkout-column select {
  width: 100%;
  margin-bottom: 15px;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #f9f9f9;
  font-size: 1rem;
  color: #333;
  transition: all 0.3s ease;
}

.checkout-column input:focus,
.checkout-column textarea:focus,
.checkout-column select:focus {
  border-color: #2a9d8f;
  background: #fff;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.payment-option {
  display: block;
  margin-bottom: 12px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.payment-option:hover {
  background: rgba(42, 157, 143, 0.1);
}

.payment-option input[type="radio"] {
  margin-right: 8px;
  transform: scale(1.2);
}

.bank-info {
  font-size: 1rem;
  background: linear-gradient(135deg, #e8f5e8, #f0f9f1);
  padding: 15px;
  border-radius: 10px;
  margin-top: 15px;
  border-left: 4px solid #2a9d8f;
}

.bank-info p {
  margin: 5px 0;
  color: #333;
}

.payment-info {
  font-size: 1rem;
  color: #4a4a4a;
  margin-top: 10px;
  padding: 8px;
  background: rgba(42, 157, 143, 0.05);
  border-radius: 6px;
}

.invoice-item {
  margin-bottom: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
}

.invoice-item p {
  margin: 2px 0;
  color: #333;
}

.invoice-item p:first-child {
  font-weight: 600;
  color: #2a9d8f;
}

/* Coupon */
.coupon-section {
  margin: 20px 0;
  padding: 15px;
  background: linear-gradient(135deg, #fff3e0, #ffe6e6);
  border-radius: 10px;
  border: 2px dashed #f28c38;
}

.coupon-section input {
  width: calc(100% - 120px);
  display: inline-block;
  margin-right: 8px;
  padding: 10px;
  border: 1px solid #f28c38;
  border-radius: 8px;
}

.coupon-btn {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.coupon-btn {
  background: linear-gradient(90deg, #f28c38, #ff8c42);
  color: #fff;
  margin-right: 5px;
}

.coupon-btn.remove {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
}

.coupon-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(242, 140, 56, 0.4);
}

.coupon-section .error {
  color: #ff6b6b;
  margin-top: 8px;
  font-weight: 500;
}

.coupon-section .success {
  color: #2a9d8f;
  margin-top: 8px;
  font-weight: 600;
  background: rgba(42, 157, 143, 0.1);
  padding: 8px;
  border-radius: 6px;
}

/* Nút đặt hàng */
.place-order-btn {
  margin-top: 25px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 15px 25px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: 600;
  display: block;
  width: 100%;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.place-order-btn::before {
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

.place-order-btn:hover::before {
  width: 300px;
  height: 300px;
}

.place-order-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
  .cart-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .checkout-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .cart-table {
    font-size: 0.9rem;
  }
  .cart-table td, .cart-table th {
    padding: 10px;
  }
  .cart-item-image {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .checkout-column {
    padding: 15px;
  }
  .coupon-section input {
    width: 100%;
    margin-bottom: 10px;
  }
  .coupon-btn {
    width: 100%;
    margin: 5px 0;
  }
}
</style>