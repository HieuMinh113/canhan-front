<template>
  <div class="products-detail-page">
    <h1 class="animate-pulse">📦 Chi tiết sản phẩm</h1>

    <div v-if="product" class="product-info">
      <img :src="product.image" alt="Ảnh sản phẩm" class="product-image" />

      <div class="product-details">
        <h2>{{ product.name }}</h2>
        <p class="type">Loại: {{ product.type }}</p>
        <p class="category">Danh mục: {{ product.category }}</p>
        <p class="description">{{ product.description }}</p>
        <p class="tag">{{ product.tag}}</p>
        <p class="price">Giá: {{ formatPrice(product.price) }}</p>

        <div class="quantity-selector">
          <button @click="decreaseQuantity" class="quantity-btn">-</button>
          <input type="number" v-model.number="quantity" min="1" />
          <button @click="increaseQuantity" class="quantity-btn">+</button>
        </div>

        <button class="add-to-cart" @click="add">🛒 Thêm vào giỏ hàng</button>
        <router-link to="/products" class="back-button">⬅ Quay lại danh sách</router-link>
      </div>
    </div>

    <div v-else class="loading">Đang tải dữ liệu sản phẩm...</div>
  </div>
</template>

<script>
import apiClient from "@/service/axios";
import { useCartStore } from '@/stores/cart';

export default {
  name: "ProductsDetailPage",
  props: ['id'],
  data() {
    return {
      product: null,
      quantity: 1,
    };
  },
  created() {
    const id = this.$route.params.id;
    
    apiClient.get(`api/products/${id}`)
      .then(res => {
        this.product = res.data;
      })
      .catch(err => {
        console.error('Lỗi khi tải sản phẩm:', err);
        if (err.response?.status === 404) {
          alert("Không tìm thấy sản phẩm!");
          this.$router.push("/products");
        } else {
          alert("Lỗi server, vui lòng thử lại sau!");
        }
      });
  },
  methods: {
    formatPrice(value) {
      return Number(value).toLocaleString("vi-VN") + "₫";
    },
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
    },
    add() {
      const cartStore = useCartStore();
      cartStore.addToCart(this.product, null, this.quantity).then(() => {
        alert("✅ Đã thêm vào giỏ hàng!");
      }).catch(err => {
        console.error("Lỗi thêm giỏ hàng:", err);
        alert("❌ Thêm giỏ hàng thất bại!");
      });
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.products-detail-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 60px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
  max-width: 1100px;
  margin: 0 auto;
}

.products-detail-page::before {
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
  margin-bottom: 30px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.product-info {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.8s ease forwards;
  position: relative;
  overflow: hidden;
}

.product-info::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.product-image {
  flex: 1;
  max-width: 450px;
  width: 100%;
  border-radius: 15px;
  object-fit: cover;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s ease;
}

.product-image:hover {
  transform: scale(1.02);
}

.product-details {
  flex: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
}

.product-details h2 {
  font-size: 2rem;
  color: #2a9d8f;
  margin-bottom: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.type, .category, .tag {
  font-size: 1.1rem;
  color: #f28c38;
  margin: 8px 0;
  font-weight: 500;
}

.description {
  font-size: 1.2rem;
  color: #333;
  line-height: 1.7;
  margin: 20px 0;
  text-align: justify;
}

.price {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f28c38;
  margin: 20px 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #2a9d8f;
  background: #fff;
  color: #2a9d8f;
  border-radius: 50%;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover {
  background: #2a9d8f;
  color: #fff;
  transform: scale(1.1);
}

.quantity-selector input {
  width: 60px;
  padding: 8px;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: border-color 0.3s ease;
}

.quantity-selector input:focus {
  border-color: #2a9d8f;
  outline: none;
  box-shadow: 0 0 5px rgba(42, 157, 143, 0.3);
}

.add-to-cart {
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
  margin: 20px 0;
}

.add-to-cart::before {
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

.add-to-cart:hover::before {
  width: 300px;
  height: 300px;
}

.add-to-cart:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.back-button {
  display: inline-block;
  background: linear-gradient(90deg, #f28c38, #ff8c42);
  color: #fff;
  padding: 12px 25px;
  text-decoration: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(242, 140, 56, 0.3);
}

.back-button::before {
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

.back-button:hover::before {
  width: 200px;
  height: 200px;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(242, 140, 56, 0.4);
}

.loading {
  text-align: center;
  font-size: 1.3rem;
  color: #4a4a4a;
  margin-top: 60px;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  animation: fadeIn 1s ease-in-out;
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
  .products-detail-page {
    padding: 30px 15px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .product-info {
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 25px;
  }
  .product-details {
    text-align: center;
  }
  .product-image {
    max-width: 100%;
  }
  .quantity-selector {
    justify-content: center;
  }
  .add-to-cart, .back-button {
    font-size: 1rem;
    padding: 12px 20px;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .product-details h2 {
    font-size: 1.6rem;
  }
  .price {
    font-size: 1.5rem;
  }
  .quantity-btn {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  .quantity-selector input {
    width: 50px;
    font-size: 1rem;
  }
}
</style>