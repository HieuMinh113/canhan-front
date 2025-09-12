<template>
  <div class="pet-detail-page" v-if="pet">
    <div class="pet-detail-card">
      <img :src="pet.image ? pet.image : '/default-pet.png'" alt="Thú cưng" class="pet-detail-image" />

      <div class="pet-info">
        <h1 class="pet-name">{{ pet.name }}</h1>
        <p><strong>Loại:</strong> {{ pet.type }}</p>
        <p><strong>Giới tính:</strong> {{ pet.gender }}</p>
        <p><strong>Tuổi:</strong> {{ pet.age }} tháng</p>
        <p><strong>Màu sắc:</strong> {{ pet.color }}</p>
        <p class="price">{{ Number(pet.price).toLocaleString() }}đ</p>
        <p class="desc">{{ pet.description }}</p>

        <!-- Bộ chọn số lượng -->
        <div class="quantity-selector">
          <button @click="decreaseQuantity" class="quantity-btn">-</button>
          <input type="number" v-model.number="quantity" min="1" />
          <button @click="increaseQuantity" class="quantity-btn">+</button>
        </div>

        <button class="add-to-cart" @click="add">🛒 Thêm vào giỏ hàng</button>
        <router-link to="/pets" class="back-button">⬅ Quay lại danh sách</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios'
import { useCartStore } from '@/stores/cart'
export default {
  name: "PetDetail",
  data() {
    return {
      pet: null,
      quantity: 1, 
    }
  },
  created() {
    const id = this.$route.params.id
    apiClient.get(`http://localhost:8000/api/pet/${id}`)
      .then(res => this.pet = res.data)
      .catch(err => console.error(err))
  },
  methods:{
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) this.quantity--;
    },
    add() {
      const cartStore = useCartStore();
      cartStore.addToCart(null, this.pet, this.quantity).then(() => {
        alert("✅ Đã thêm vào giỏ hàng!");
      }).catch(err => {
        console.error("Lỗi thêm giỏ hàng:", err);
        alert("❌ Thêm giỏ hàng thất bại!");
      });
    },
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.pet-detail-page {
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

.pet-detail-page::before {
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

.pet-detail-card {
  display: flex;
  flex-direction: row;
  gap: 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.8s ease forwards;
  position: relative;
  overflow: hidden;
}

.pet-detail-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.pet-detail-image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.4s ease;
  flex-shrink: 0;
}

.pet-detail-image:hover {
  transform: scale(1.02);
}

.pet-info {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.pet-name {
  font-size: 2.5rem;
  color: #2a9d8f;
  margin-bottom: 20px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  line-height: 1.3;
}

.pet-info p {
  font-size: 1.2rem;
  color: #333;
  margin: 12px 0;
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(42, 157, 143, 0.1);
}

.pet-info p:last-child {
  border-bottom: none;
}

.pet-info p strong {
  color: #f28c38;
}

.price {
  font-size: 2rem;
  color: #f28c38;
  margin: 20px 0;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.desc {
  font-size: 1.2rem;
  color: #444;
  margin: 20px 0;
  line-height: 1.7;
  text-align: justify;
  background: rgba(42, 157, 143, 0.05);
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #2a9d8f;
}

/* Bộ chọn số lượng */
.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 25px 0;
}

.quantity-btn {
  width: 45px;
  height: 45px;
  border: 2px solid #2a9d8f;
  background: #fff;
  color: #2a9d8f;
  border-radius: 50%;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.quantity-btn:hover {
  background: #2a9d8f;
  color: #fff;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(42, 157, 143, 0.3);
}

.quantity-selector input {
  width: 70px;
  padding: 10px;
  text-align: center;
  border: 2px solid #ddd;
  border-radius: 10px;
  font-size: 1.2rem;
  transition: border-color 0.3s ease;
  background: #f9f9f9;
}

.quantity-selector input:focus {
  border-color: #2a9d8f;
  outline: none;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
  background: #fff;
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
  margin-top: 10px;
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

@keyframes slideUp {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@media (max-width: 768px) {
  .pet-detail-page {
    padding: 30px 15px;
  }
  .pet-detail-card {
    flex-direction: column;
    gap: 25px;
    padding: 20px;
  }
  .pet-detail-image {
    width: 100%;
    height: 300px;
  }
  .pet-info {
    text-align: center;
  }
  .pet-name {
    font-size: 2rem;
  }
  .pet-info p {
    justify-content: center;
    text-align: center;
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
  .pet-name {
    font-size: 1.8rem;
  }
  .price {
    font-size: 1.6rem;
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