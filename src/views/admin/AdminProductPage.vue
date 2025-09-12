<template>
  <div class="admin-product-page">
    <h1 class="animate-pulse">🛒 Quản lý Sản phẩm</h1>
    <p class="subtitle">Quản lý danh sách các sản phẩm có sẵn cho khách hàng</p>
    <button class="add-button" @click="openModal">➕ Thêm Sản phẩm</button>
    <div class="search-box"> 
      <input type="text"
      v-model="searchQuery"
      @input="searchProducts"
      placeholder="Tìm kiếm sản phẩm..."
      >
    </div>
    <div class="product-list">
      <div class="product-card" v-for="(product, index) in products" :key="index">
        <img :src="product.image" alt="Ảnh sản phẩm" class="product-image" />
        <h3>{{ product.name }}</h3>
        <p><strong>Số Lượng:</strong> {{ product.stock }}</p>
        <p><strong>Loại:</strong> {{ getCategoryName(product.category) }}</p>
        <p><strong>Dành cho:</strong> {{ getTypeName(product.type) }}</p>
        <p><strong>Tag:</strong> {{ getTagName(product.tag) }}</p>
        <p><strong>Giá:</strong> {{ formatPrice(product.price) }}</p>
        <p class="description">{{ product.description }}</p>
        <div class="actions">
          <button @click="editProduct(index)" class="edit-btn">✏️ Sửa</button>
          <button @click="deleteProduct(index)" class="delete-btn">🗑️ Xóa</button>
        </div>
      </div>
    </div>

    <!-- Modal thêm/sửa -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ isEdit ? 'Sửa Sản phẩm' : 'Thêm Sản phẩm Mới' }}</h3>
        <input v-model="form.name" placeholder="Tên sản phẩm" />
        <input v-model.number="form.stock" type="number" placeholder="Số lượng sản phẩm" min="0" required />
        <label for="category">Loại sản phẩm:</label>
        <select v-model="form.category" required>
        <option value="">--Chọn--</option>
        <option value="fashion">Thời trang cho thú cưng</option>
        <option value="food">Đồ ăn cho thú cưng</option>
        <option value="toy">Đồ chơi cho thú cưng</option>
        <option value="utensils">Đồ dùng cho thú cưng</option>
        <option value="medicine">Thuốc cho thú cưng</option>
        </select>
        <label for="tag">Loại sản phẩm:</label>
        <select v-model="form.tag" required>
        <option value="">--Chọn--</option>
        <option value="hot">nong</option>
        <option value="cold">lanh</option>
        <option value="rainy">mua </option>
        <option value="sunny">nang</option>
        </select>
        <label for="type">Dành cho thú cưng:</label>
        <select v-model="form.type" required >
        <option value="">--Chọn--</option>
        <option value="dog">Chó</option>
        <option value="cat">Mèo</option>
        <option value="all">Tất cả</option>
        </select>
        <!-- </label> -->
        <input type="number" v-model="form.price" placeholder="Giá (VNĐ)" />
        <textarea v-model="form.description" placeholder="Mô tả sản phẩm"></textarea>
        <input type="file" @change="handleImageUpload" accept="image/*" />

        <div v-if="form.previewImage" class="preview">
          <img :src="form.previewImage" alt="Xem trước" />
        </div>

        <div class="modal-actions">
          <button @click="saveProduct" class="save-btn">💾 Lưu</button>
          <button @click="closeModal" class="cancel-btn">❌ Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/service/axios';


export default {
  name: 'AdminProductPage',
  data() {
    return {
      products: [],
      searchTimeout: null,
      searchQuery: '',
      form: {
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        previewImage: '',
        type:'',
        stock:'',
      },
      showModal: false,
      isEdit: false,
      editIndex: -1,
    };
  },
 mounted(){
  this.fetchproducts();
 },
 methods:{
  openModal() {
    this.resetForm();        
    this.showModal = true;   
  },
  closeModal() {
    this.resetForm();
    this.showModal = false;
  },
  resetForm(){
    this.form={
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        previewImage: '',
        type:'',
        stock:'',
        tag:'',
    }
    this.isEdit=false;
    this.editIndex=-1;
  },
  async handleImageUpload(event) {
  const fileList = event?.target?.files;
  if (!fileList || fileList.length === 0) {
    console.warn("Không có file nào được chọn");
    return;
  }

  const selectedFile = fileList[0];
  const formData = new FormData();
  formData.append('image', selectedFile);

  try {
    const response = await apiClient.post('/api/uploadImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    this.form.previewImage = response.data.url;
  } catch (error) {
    console.error('Lỗi khi upload ảnh:', error);
    alert('Upload ảnh thất bại');
  }
},
  formatPrice(value) {
  return value.toLocaleString('vi-VN') + '₫';
  },
  async fetchproducts(){
    try {
      const response = await apiClient.get('/api/products');
      this.products=response.data;
    } catch (error) {
      console.error('loi khi tai san pham',error);
    }
  },
  searchProducts(){
    clearTimeout(this.searchTimeout);
    this.searchTimeout=setTimeout(async()=>{
      try {
        const res = await apiClient.get('/api/products',{
          params:{
            search:this.searchQuery,
          }
        });
        this.products=res.data;
      } catch (error) {
        console.log('loi tim kiem',error);
      }
    })
  },
  async saveProduct(){
    if(!this.form.name||!this.form.price||!this.form.category||!this.form.previewImage||!this.form.type||!this.form.stock){
      alert('vui long nhap day du ten , loai ,gia , hinh anh ')
      return; 
    }
    const newProduct={
      name:this.form.name,
      category:this.form.category,
      price:Number(this.form.price),
      description:this.form.description,
      image:this.form.previewImage,
      type:this.form.type,
      tag:this.form.tag,
      stock:Number(this.form.stock),
    };
    try {
      if(this.isEdit){
        const id = this.products[this.editIndex].id;
        const res = await apiClient.put(`/api/products/${id}`, newProduct);
        this.products[this.editIndex]=res.data;
      }else{
        const res = await apiClient.post('/api/products',newProduct);
        this.products.push(res.data);
      }
      this.closeModal();
    } catch (error) {
      console.error('loi khi luu san pham',error);
      alert('luu san pham that bai');
    }
  },
  editProduct(index){
    const product = this.products[index];
    this.form={
      name:product.name,
      category:product.category,
      price:product.price,
      description:product.description,
      image:product.image,
      previewImage:product.image,
      type:product.type,
      stock:product.stock,
    }
    this.isEdit=true;
    this.editIndex=index;
    this.showModal=true;
  },
  async deleteProduct(index) {
    if (!confirm('Bạn có chắc muốn xoá sản phẩm này?')) return;
    const product = this.products[index];
    try {
      await apiClient.delete(`/api/products/${product.id}`);
      this.products.splice(index, 1);
    } catch (error) {
      console.error('Xoá thất bại:', error);
    }
  },
  getCategoryName(code) {
      switch (code) {
        case "fashion":
          return "Thời trang cho thú cưng";
        case "food":
          return "Đồ ăn cho thú cưng";
        case "toy":
          return "Đồ chơi cho thú cưng";
        case "utensils":
          return "Đồ dùng cho thú cưng";
        case "medicine":
          return "thuốc cho thú cưng";
        default:
          return code;
      }
    },
    getTypeName(code) {
      switch (code) {
        case "dog":
          return "Chó";
        case "cat":
          return "Mèo";
        case "all":
          return "Tất cả";
        default:
          return code;
      }
    },
    getTagName(code) {
      switch (code) {
        case "hot":
          return "nong";
        case "clod":
          return "Lanh";
        case "rainy":
          return "Mua";
        case "sunny":
          return "Nang";
        default:
          return code;
      }
    },
 }
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&display=swap');

.admin-product-page {
  font-family: 'Fredoka', sans-serif;
  background: linear-gradient(135deg, #f9e6ff 0%, #e6f9ff 100%);
  min-height: 100vh;
  padding: 40px 20px;
  position: relative;
  overflow: hidden;
}

.admin-product-page::before {
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

.add-button {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: white;
  padding: 15px 30px;
  font-size: 1.2rem;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
  display: block;
  margin: 0 auto 30px;
}

.add-button::before {
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

.add-button:hover::before {
  width: 300px;
  height: 300px;
}

.add-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.search-box {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.search-box input {
  padding: 12px 18px;
  width: 100%;
  max-width: 400px;
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

.product-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 10px;
}

.product-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  animation: slideUp 0.5s ease forwards;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  background: #f3f4f6;
}

.product-card h3 {
  margin: 12px 0 6px;
  color: #2a9d8f;
  font-size: 1.15rem;
  line-height: 1.2;
}

.product-card p {
  margin: 4px 0;
  color: #333;
  font-size: 0.96rem;
}

.description {
  margin-top: 6px;
  font-size: 0.92rem;
  color: #6b7280;
  min-height: 48px;
}

.actions {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  padding: 9px 14px;
  font-size: 0.92rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.12s ease, opacity 0.15s ease, box-shadow 0.2s ease;
  box-shadow: 0 2px 8px rgba(42, 157, 143, 0.3);
  position: relative;
  overflow: hidden;
  font-weight: 600;
}

.edit-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
}

.delete-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.edit-btn::before,
.delete-btn::before {
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

.edit-btn:hover::before,
.delete-btn:hover::before {
  width: 200px;
  height: 200px;
}

.edit-btn:hover,
.delete-btn:hover { 
  transform: translateY(-1px);
}

.delete-btn:hover {
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
  background: linear-gradient(90deg, #ee5a52, #ff6b6b);
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.55);
  display: grid;
  place-items: center;
  z-index: 1500;
  padding: 18px;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: rgba(255, 255, 255, 0.95);
  width: 50%;
  max-width: 520px;
  padding: 26px;
  border-radius: 18px;
  box-shadow: 0 24px 48px rgba(2, 6, 23, 0.25);
  animation: modalIn 0.22s ease;
  position: relative;
  overflow: hidden;
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
}

.modal-content h3 {
  margin-bottom: 18px;
  color: #2a9d8f;
  text-align: center;
  font-size: 1.4rem;
  font-weight: 600;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  width: 100%;
  padding: 12px 14px;
  font-size: 1rem;
  margin-bottom: 14px;
  border: 2px solid #ddd;
  border-radius: 10px;
  outline: none;
  background: #f9f9f9;
  transition: border-color .2s, box-shadow .2s, background .2s;
}

.modal-content input:focus,
.modal-content textarea:focus,
.modal-content select:focus {
  border-color: #2a9d8f;
  background: #fff;
  box-shadow: 0 0 8px rgba(42, 157, 143, 0.3);
}

.modal-content textarea {
  min-height: 96px;
  resize: vertical;
}

.preview img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
  border-radius: 10px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.save-btn,
.cancel-btn {
  padding: 12px 20px;
  font-size: 1rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: transform .12s ease, box-shadow .2s ease;
  font-weight: 600;
  position: relative;
  overflow: hidden;
}

.save-btn {
  background: linear-gradient(90deg, #2a9d8f, #4ab8a9);
  color: #fff;
  box-shadow: 0 4px 15px rgba(42, 157, 143, 0.3);
}

.cancel-btn {
  background: linear-gradient(90deg, #ff6b6b, #ff8787);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
}

.save-btn::before,
.cancel-btn::before {
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

.save-btn:hover::before,
.cancel-btn:hover::before {
  width: 200px;
  height: 200px;
}

.save-btn:hover,
.cancel-btn:hover { 
  transform: translateY(-2px);
}

.save-btn:hover {
  box-shadow: 0 6px 20px rgba(42, 157, 143, 0.4);
}

.cancel-btn:hover {
  box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
  background: linear-gradient(90deg, #ee5a52, #ff6b6b);
}

label { 
  font-weight: 600; 
  color: #2a9d8f; 
  display: block; 
  margin: 6px 0; 
  font-size: 1.1rem;
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

@keyframes modalIn {
  from { transform: translateY(10px) scale(.98); opacity: 0; }
  to   { transform: translateY(0) scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .admin-product-page {
    padding: 20px;
  }
  h1 {
    font-size: 2.2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
  .product-list {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  .search-box input {
    max-width: 100%;
  }
  .modal-content {
    width: 95%;
    padding: 20px;
  }
  .modal-actions {
    flex-direction: column;
  }
  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8rem;
  }
  .add-button {
    font-size: 1rem;
    padding: 12px 20px;
    width: 100%;
  }
  .product-card h3 {
    font-size: 1.1rem;
  }
  .product-card p {
    font-size: 0.9rem;
  }
  .edit-btn,
  .delete-btn {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}
</style>