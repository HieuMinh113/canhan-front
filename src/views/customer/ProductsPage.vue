<template>
  <div class="products-page">
    <h1 class="animate-pulse">🛍️ Sản Phẩm Dành Cho Thú Cưng</h1>
    <p class="subtitle">Trang phục, đồ chơi, và nhiều món dễ thương khác!</p>
    <div class="filter-box">
      <label for="type">Loại thú cưng:
        <select v-model="filter.type">
          <option value="">Tất cả</option>
          <option value="dog">Chó</option>
          <option value="cat">Mèo</option>
        </select>
      </label>
      <label for="category">Danh mục:
        <select v-model="filter.category">
          <option value="">Tất cả</option>
          <option value="medicine">Thuốc</option>
          <option value="utensils">Đồ dùng</option>
          <option value="food">Đồ ăn</option>
          <option value="toy">Đồ chơi</option>
          <option value="fashion">Thời trang</option>
        </select>
      </label>
      <button class="search-button" @click="applyFilter">Tìm kiếm</button>
      <button class="search-button" @click="cancelFilter">Reset</button>
    </div>
    <div class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
      >
        <img :src="product.image" :alt="product.name" class="product-image" />
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-type"><strong>Loại: </strong>{{ product.type }}</p>
        <p class="product-category"><strong>Danh mục: </strong>{{ product.category }}</p>
        <p class="product-tag"><strong>Tag:</strong>{{ product.tag }}</p>
        <p class="price">{{ product.price.toLocaleString() }}đ</p>
        <router-link
          :to="`/product/${product.id}`"
          class="buy-button"
        >Xem chi tiết</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';
export default {
  name: "ProductList",
  data() {
    return {
      products: [],
      filter: {
        type: '',
        category: '',
      }
    };
  },
  async created() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const params = {
          ...this.filter,
        };
        if (this.filter.type) {
          params.type = this.filter.type;
        }
        if (this.filter.category) {
          params.category = this.filter.category;
        }
        const res = await apiClient.get('http://localhost:8000/api/products', {
          params
        });
        this.products = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    applyFilter() {
      this.fetchProducts();
    },
    cancelFilter() {
      this.filter.type = '';
      this.filter.category = '';
      this.fetchProducts();
    },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.products-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 40px 20px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  text-align: center;
}

.products-page::before {
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
  margin-bottom: 15px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: pulse 2s ease infinite;
}

.subtitle {
  font-size: 1.2rem;
  color: #4a4a4a;
  margin-bottom: 30px;
  line-height: 1.8;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 1s ease-in-out;
}

.filter-box {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 20px 0 40px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  animation: slideUp 0.8s ease forwards;
}

.filter-box label {
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-box select {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 1rem;
  color: #333;
  transition: border-color 0.3s ease;
}

.filter-box select:focus {
  border-color: #2a9d8f;
  outline: none;
  box-shadow: 0 0 5px rgba(42, 157, 143, 0.5);
}

.search-button {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.search-button::before {
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

.search-button:hover::before {
  width: 200px;
  height: 200px;
}

.search-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(42, 157, 143, 0.4);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
  max-width: 1100px;
  margin: 0 auto;
}

.product-card {
  background: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.product-card:hover {
  transform: translateY(-8px);
  background: linear-gradient(145deg, #f9f9f9, #e8f0ff);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.08);
}

.product-name {
  font-size: 1.3rem;
  color: #2a9d8f;
  font-weight: 600;
  margin: 10px 0;
}

.product-type, .product-category, .product-tag {
  font-size: 1.1rem;
  color: #333;
  margin: 8px 0;
}

.product-type strong, .product-category strong {
  color: #f28c38;
}

.price {
  font-size: 1.2rem;
  color: #f28c38;
  font-weight: 600;
  margin: 10px 0;
}

.buy-button {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 10px;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.buy-button::before {
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

.buy-button:hover::before {
  width: 200px;
  height: 200px;
}

.buy-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(42, 157, 143, 0.4);
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
  h1 { font-size: 2.2rem; }
  .subtitle { font-size: 1.1rem; max-width: 600px; }
  .product-grid { grid-template-columns: 1fr; }
  .product-image { height: 150px; }
  .filter-box { flex-direction: column; gap: 15px; }
}

@media (max-width: 480px) {
  h1 { font-size: 1.8rem; }
  .subtitle { font-size: 1rem; }
  .product-image { height: 130px; }
  .filter-box { padding: 15px; }
  .search-button, .buy-button { padding: 8px 16px; font-size: 0.9rem; }
}
</style>