<template>
  <div class="admin-pet-stock-page">
    <h1>📊 Quản lý Kho Sản phẩm</h1>

    <div class="summary-card">
      <h2>Tổng số lượng sản phẩm trong kho: <span class="total-stock">{{ totalStock }}</span></h2>
    </div>

    <div class="pet-stock-list">
      <div v-for="pet in pets" :key="pet.id" class="pet-stock-item">
        <div class="pet-info">
          <img :src="pet.image" alt="Ảnh sản phẩm" class="pet-image" />
          <div class="pet-details">
            <h3>{{ pet.name }}</h3>
            <p><strong>Mã sản phẩm:</strong> {{ pet.id }}</p>
            <p><strong>Loại:</strong> {{ getCategoryName(pet.category) }}</p>
            <p><strong>Giống thú cưng:</strong> {{ getTypeName(pet.type) }}</p>
          </div>
        </div>
        <div class="stock-info">
          <p class="current-stock">Số lượng hiện tại: <span>{{ pet.stock }}</span></p>
          <div class="stock-actions">
            <input
              type="number"
              v-model.number="pet.quantityToAdd"
              min="1"
              placeholder="Số lượng thêm"
            />
            <button @click="updateStock(pet.id, pet.stock + pet.quantityToAdd)">
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
    const pets = ref([]);
    const totalStock = ref(0);

    onMounted(async () => {
      const res = await apiClient.get('/api/countpet');
      pets.value = res.data.pets; 
      totalStock.value = res.data.total_stock; 
    });

    return { pets, totalStock };
  }
}
</script>