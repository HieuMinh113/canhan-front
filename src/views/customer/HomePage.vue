<template>
  <section class="home">
    <div class="hero-section">
      <h2 class="animate-pulse">🐾 Chào mừng đến với Hmm PetStore</h2>
      <p class="intro">
        Tại Hmm PetStore, chúng tôi luôn đặt sức khỏe và hạnh phúc của thú cưng lên hàng đầu. 
        Với nhiều năm kinh nghiệm, đội ngũ nhân viên nhiệt tình và dịch vụ đa dạng, 
        bạn sẽ tìm thấy mọi thứ thú cưng của bạn cần ngay tại đây.
      </p>
      <swiper
        :modules="[Autoplay]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 3000, disableOnInteraction: false }"
        class="banner-slider"
      >
        <swiper-slide v-for="banner in banners" :key="banner.id">
          <a :href="banner.link" target="_blank">
            <img :src="banner.image" class="banner-image" />
          </a>
        </swiper-slide>
      </swiper>
    </div>
    
    <div v-if="weather && weather.location && weather.current" class="weather-section">
      <h3>🌤️ Thời tiết tại {{ weather.location.name }}</h3>
      <p>🌡️ {{ weather.current.temp_c }}°C</p>
      <p>💧 Độ ẩm: {{ weather.current.humidity }}%</p>
      <p>☁️ {{ weather.current.condition.text }}</p>
    </div>
    <div v-if="suggestedProducts && suggestedProducts.length" class="suggestion-section">
  <h3>🎯 Gợi ý sản phẩm cho thú cưng theo thời tiết</h3>
    <div class="product-list">
      <div v-for="p in suggestedProducts" :key="p.id" class="product">
        <img :src="p.image" :alt="p.name" class="product-img"/>
        <p><strong>Tên sản phẩm: </strong>{{ p.name }}</p>
        <p><strong>Giá: </strong>{{ p.price }}đ</p>
        <p><strong>Thể loại: </strong>{{ p.category }}đ</p>        
        <router-link :to="`/product/${p.id}`" class="buy-button">
          <button class="btn-detail">Xem chi tiết</button>
        </router-link>
      </div>
    </div>
  </div>
    <!-- Sản phẩm -->
    <section class="products">
      <h3 class="emoji-glow">🛒 Sản phẩm bán chạy</h3>
      <div class="product-list">
        <div v-for="product in products" :key="product.id" class="product">
          <img :src="product.image" :alt="product.name" class="product-img"/>
          <p><strong>Tên sản phẩm: </strong>{{ product.name }}</p>
          <p><strong>Giá: </strong>{{ product.price }}đ</p>
          <p><strong>Thể loại: </strong>{{ product.category }}</p>
          <p>{{ product.description }}</p>
          <router-link
            :to="`/product/${product.id}`"
            class="buy-button"
          ><button class="btn-detail">Xem chi tiết</button></router-link>
        </div>
      </div>
    </section>

    <!-- Thú cưng -->
    <section class="products">
      <h3 class="emoji-glow">🐶 Thú cưng được ưa thích</h3>
      <div class="product-list">
        <div v-for="pet in pets" :key="pet.id" class="pet">
          <img :src="pet.image" :alt="pet.name" class="product-img"/>
          <p><strong>Tên thú cưng: </strong>{{ pet.name }}</p>
          <p><strong>Loài: </strong>{{ pet.type }}</p>
          <p>{{ pet.description }}</p>
          <router-link
            :to="`/pets/${pet.id}`"
            class="buy-button"
          ><button class="btn-detail">Xem chi tiết</button></router-link>
        </div>
      </div>
    </section>

    <!-- Khách sạn -->
    <section class="hotel">
      <h3 class="emoji-glow">🏨 Khách sạn thú cưng</h3>
      <div class="hotel-list">
        <div v-for="hotel in hotels" :key="hotel.id" class="hotel-item">
          <img :src="hotel.image" :alt="hotel.name" class="hotel-img"/>
          <p><strong>{{ hotel.name }}</strong></p>
          <p>{{ hotel.description }}</p>
          <router-link
            :to="`/hotel/${hotel.id}`"
            class="buy-button"
          ><button class="btn-detail">Xem chi tiết</button></router-link>
        </div>
      </div>
      <p class="hotel-note">
        🎒 Bạn đi công tác hay du lịch? Hãy để chúng tôi chăm sóc "người bạn nhỏ" của bạn thật chu đáo!
      </p>
    </section>

    <!-- Tin tức -->
    <section class="news">
      <h3 class="emoji-glow">📰 Tin tức mới nhất</h3>
      <div class="news-list">
        <div v-for="news in newsList" :key="news.id" class="news-item">
          <h1>{{ news.title }}</h1>
          <router-link
            :to="`/news/${news.id}`"
            class="buy-button"
          ><button class="btn-detail">Xem chi tiết</button></router-link>
        </div>
      </div>
    </section>

    <!-- Liên hệ -->
    <footer class="contact-info">
      <h3 class="emoji-glow">📞 Thông tin liên hệ</h3>
      <p>Email: <a href="mailto:hieuminh@petshop.com">hieuminh@petshop.com</a></p>
      <p>Điện thoại: <a href="tel:+8439209831">+84 392 098 31</a></p>
      <p>Địa chỉ: 123 Đường Mid, Quận 1, TP.HCM</p>
      <p>Giờ làm việc: 8h - 20h từ Thứ 2 đến Chủ Nhật</p>
      <div class="map-container">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.9543420445766!2d106.67525717316876!3d10.738002459905097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f62a90e5dbd%3A0x674d5126513db295!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBDw7RuZyBuZ2jhu4cgU8OgaSBHw7Ju!5e0!3m2!1svi!2s!4v1752221443357!5m2!1svi!2s"
          width="100%"
          height="300"
          style="border:0; border-radius: 12px;"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </footer>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

import apiClient from '@/service/axios'

const banners = ref([])
const products = ref([])
const hotels = ref([])
const newsList = ref([])
const pets = ref([])
const weather = ref(null);
const suggestedProducts = ref([]);


onMounted(async () => {
  const { data: bannerData } = await apiClient.get('/api/banners')
  banners.value = bannerData

  const { data: productData } = await apiClient.get('/api/bestseller-product')
  products.value = productData

  const { data: petData } = await apiClient.get('/api/bestseller-pet')
  pets.value = petData

  const { data: hotelData } = await apiClient.get('/api/hotel')
  hotels.value = hotelData

  const { data: newsData } = await apiClient.get('/api/news')
  newsList.value = newsData

 if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    const resWeather = await apiClient.get(`/api/weather?lat=${lat}&lon=${lon}`);
    weather.value = resWeather.data;

    const resSuggest = await apiClient.get(`/api/weather-suggest?lat=${lat}&lon=${lon}`);
    suggestedProducts.value = resSuggest.data.products || [];
  }, (error) => {
    console.log(error);
  }); 
}

})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.home {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  padding: 60px 20px;
  /* padding: 60%; */
  color: #2c2c2c;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.home::before {
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

.hero-section {
  text-align: center;
  margin-bottom: 50px;
}

h2 {
  font-size: 2.8rem;
  font-weight: 600;
  color: #ff4d8d;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.intro {
  font-size: 1.2rem;
  color: #4a4a4a;
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.8;
  animation: fadeIn 1s ease-in-out;
}

.banner-slider {
  width: 100%;
  max-width: 1200px;
  height: 450px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.banner-image:hover {
  transform: scale(1.05);
}

section {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  margin-bottom: 50px;
  border-radius: 20px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  animation: slideUp 0.8s ease forwards;
}

h3 {
  font-size: 2rem;
  color: #d81b60;
  margin-bottom: 25px;
  text-align: center;
  position: relative;
}

h1 {
  font-size: 1.5rem;
  color: #2a9d8f;
  margin-bottom: 20px;
  text-align: center;
}

.emoji-glow:hover {
  transform: scale(1.15);
  text-shadow: 0 0 10px rgba(216, 27, 96, 0.5);
  transition: all 0.3s ease;
}

.product-list, .hotel-list, .news-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 25px;
}

.product, .pet, .hotel-item, .news-item {
  background: #fff;
  border-radius: 15px;
  padding: 20px;
  text-align: center;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.product:hover, .pet:hover, .hotel-item:hover, .news-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  background: linear-gradient(145deg, #f9f9f9, #e8f0ff);
}

.product-img, .hotel-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 15px;
  transition: transform 0.4s ease;
}

.product:hover .product-img, .pet:hover .product-img, .hotel-item:hover .hotel-img {
  transform: scale(1.08);
}

.product p, .pet p, .hotel-item p, .news-item p {
  font-size: 1.1rem;
  color: #333;
  margin: 8px 0;
}

.product p:first-child, .pet p:first-child, .hotel-item p:first-child {
  font-weight: 600;
  color: #d81b60;
}

.btn-detail {
  background: linear-gradient(90deg, #ff6b6b, #ff8a8a);
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-detail::before {
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

.btn-detail:hover::before {
  width: 200px;
  height: 200px;
}

.btn-detail:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
}

.hotel-note {
  text-align: center;
  font-size: 1.2rem;
  color: #4a4a4a;
  margin-top: 20px;
  font-style: italic;
}

.contact-info {
  background: linear-gradient(145deg, #fff3e0, #ffe6e6);
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  max-width: 1100px;
  margin: 0 auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.contact-info h3 {
  font-size: 2rem;
  color: #f28c38;
  margin-bottom: 20px;
}

.contact-info p {
  font-size: 1.1rem;
  color: #333;
  margin: 8px 0;
}

.contact-info a {
  color: #ff6b6b;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-info a:hover {
  color: #d81b60;
  text-decoration: underline;
}

.map-container {
  margin-top: 25px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.map-container:hover {
  transform: scale(1.02);
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

.animate-pulse {
  animation: pulse 2s ease infinite;
}

.products { animation-delay: 0.2s; }
.hotel { animation-delay: 0.3s; }
.news { animation-delay: 0.4s; }
.contact-info { animation-delay: 0.5s; }

@media (max-width: 768px) {
  h2 { font-size: 2.2rem; }
  .intro { font-size: 1.1rem; max-width: 600px; }
  .banner-slider { height: 300px; }
  .product-list, .hotel-list, .news-list { grid-template-columns: 1fr; }
  .product-img, .hotel-img { height: 120px; }
}

@media (max-width: 480px) {
  h2 { font-size: 1.8rem; }
  h3 { font-size: 1.6rem; }
  h1 { font-size: 1.3rem; }
  section, .contact-info { padding: 20px; }
  .banner-slider { height: 250px; }
}
/* Weather Section Styling */
.weather-section {
  background: linear-gradient(145deg, #e6f9ff, #f9e6ff);
  padding: 25px;
  margin-bottom: 50px;
  border-radius: 15px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: slideUp 0.8s ease forwards;
  animation-delay: 0.1s;
  position: relative;
  overflow: hidden;
}

.weather-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://www.transparenttextures.com/patterns/paws.png') repeat;
  opacity: 0.1;
  animation: slidePaws 25s linear infinite;
}

.weather-section h3 {
  font-size: 1.8rem;
  color: #0288d1;
  margin-bottom: 15px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, text-shadow 0.3s ease;
}

.weather-section h3:hover {
  transform: scale(1.1);
  text-shadow: 0 0 8px rgba(2, 136, 209, 0.5);
}

.weather-section p {
  font-size: 1.2rem;
  color: #333;
  margin: 10px 0;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.weather-section p:hover {
  color: #0288d1;
}

.weather-section p::before {
  font-size: 1.4rem;
  transition: transform 0.3s ease;
}

.weather-section p:hover::before {
  transform: scale(1.2);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .weather-section {
    padding: 20px;
  }
  .weather-section h3 {
    font-size: 1.6rem;
  }
  .weather-section p {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .weather-section {
    padding: 15px;
  }
  .weather-section h3 {
    font-size: 1.4rem;
  }
  .weather-section p {
    font-size: 1rem;
  }
  /* Product Suggestions Section Styling */
.suggestion-section {
  background: linear-gradient(145deg, #e6f9ff, #f9e6ff);
  padding: 25px;
  margin-bottom: 50px;
  border-radius: 15px;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: slideUp 0.8s ease forwards;
  animation-delay: 0.15s;
  position: relative;
  overflow: hidden;
}

.suggestion-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('https://www.transparenttextures.com/patterns/paws.png') repeat;
  opacity: 0.1;
  animation: slidePaws 25s linear infinite;
}

.suggestion-section h3 {
  font-size: 1.8rem;
  color: #0288d1;
  margin-bottom: 20px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, text-shadow 0.3s ease;
}

.suggestion-section h3:hover {
  transform: scale(1.1);
  text-shadow: 0 0 8px rgba(2, 136, 209, 0.5);
}

.suggestion-section ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  justify-items: center;
}

.suggestion-section li {
  background: #fff;
  border-radius: 12px;
  padding: 15px;
  font-size: 1.1rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 300px;
}

.suggestion-section li:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  background: linear-gradient(145deg, #f9f9f9, #e8f0ff);
}

.suggestion-section li::before {
  font-size: 1.3rem;
  transition: transform 0.3s ease;
}

.suggestion-section li:hover::before {
  transform: scale(1.2);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .suggestion-section {
    padding: 20px;
  }
  .suggestion-section h3 {
    font-size: 1.6rem;
  }
  .suggestion-section li {
    font-size: 1rem;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .suggestion-section {
    padding: 15px;
  }
  .suggestion-section h3 {
    font-size: 1.4rem;
  }
  .suggestion-section li {
    font-size: 0.9rem;
    padding: 10px;
  }
}
}
</style>