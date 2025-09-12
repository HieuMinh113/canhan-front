<template>
  <div class="admin-stock-product-page">
    <h1>📊 Quản lý Kho Sản phẩm</h1>

    <div class="summary-card">
      <h2>Tổng số lượng sản phẩm trong kho: <span class="total-stock">{{ totalStock }}</span></h2>
    </div>

    <div class="product-stock-list">
      <div v-for="product in products" :key="product.id" class="product-stock-item">
        <div class="product-info">
          <img :src="product.image" alt="Ảnh sản phẩm" class="product-image" />
          <div class="product-details">
            <h3>{{ product.name }}</h3>
            <p><strong>Mã sản phẩm:</strong> {{ product.id }}</p>
            <p><strong>Loại:</strong> {{ getCategoryName(product.category) }}</p>
            <p><strong>Giống thú cưng:</strong> {{ getTypeName(product.type) }}</p>
          </div>
        </div>
        <div class="stock-info">
          <p class="current-stock">Số lượng hiện tại: <span>{{ product.stock }}</span></p>
          <div class="stock-actions">
            <input
              type="number"
              v-model.number="product.quantityToAdd"
              min="1"
              placeholder="Số lượng thêm"
            />
            <button @click="updateStock(product.id, product.stock + product.quantityToAdd)">
              Cập nhật
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted } from 'vue';
import apiClient from '@/service/axios';


export default {
  setup() {
    const products = ref([]);
    const totalStock = ref(0);

    onMounted(async () => {
      const res = await apiClient.get('/api/countproduct');
      products.value = res.data.products; 
      totalStock.value = res.data.total_stock; 
    });

    return { products, totalStock };
  }
}
</script>