import { defineStore } from 'pinia'
import apiClient from '@/service/axios'
import { useLoyaltyStore } from './loyalty'


export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    coupon: null,
    discount:0,
    error: null,
    notes:null,
  }),

  getters: {
    isLoggedIn: () => !!localStorage.getItem('auth_token'),
    totalPrice: (state) =>
      state.items.reduce(
        (sum, item) =>
          sum + item.quantity * (item.product?.price || item.pet?.price || item.price),
        0
      ),
    totalAfterDiscount() {
      const loyaltyStore = useLoyaltyStore()

      const loyaltyDiscountAmount = this.isLoggedIn
      ?Math.floor(this.totalPrice * (loyaltyStore.discount / 100))
      :0;
    const couponDiscountAmount = this.discount 

    const totalDiscount = loyaltyDiscountAmount + couponDiscountAmount

      return this.totalPrice > totalDiscount
        ? this.totalPrice - totalDiscount
        : 0
    }
  },

  actions: {
    async fetchCart() {
      try {
        const url = this.isLoggedIn
          ? 'api/cart/getDB'
          : '/cart/getsession'
        // await apiClient.get('http://localhost:8000/sanctum/csrf-cookie')
        const response = await apiClient.get(url)
        this.items = this.isLoggedIn ? response.data : Object.values(response.data)
      } catch (error) {
        console.error('🛑 Lỗi khi tải giỏ hàng:', error)
      }
    },
    async addToCart( product, pet, quantity = 1 ) {
      const productId = product ? product.id : null
      const petId = pet ? pet.id : null

      const index = this.items.findIndex(
        item =>
          (productId && item.product_id == productId) ||
          (petId && item.pet_id == petId)
      )
      const maxStock = product ? product?.stock : pet?.stock
      const newQuantity = index !== -1 ? this.items[index].quantity + quantity : quantity

      if (newQuantity > maxStock) {
        alert(`❌ Số lượng vượt quá tồn kho. Tối đa: ${maxStock}`)
        return
      }
      if (index !== -1) {
        this.items[index].quantity = newQuantity
      } else {
        this.items.push({
          product_id: productId,
          pet_id: petId,
          name: product ? product.name : pet?.name,
          price: product ? product.price : pet?.price,
          quantity,
          image: product ? product.image : pet?.image,
        })
      }
      const url = this.isLoggedIn ? 'api/cart/addDB' : '/cart/addsession'
      try {
        await apiClient.get('http://localhost:8000/sanctum/csrf-cookie')
        await apiClient.post(url, {
          product_id: productId,
          pet_id: petId,
          quantity,
          image: product ? product.image : pet?.image,
        })
      } catch (error) {
        console.error('❌ Lỗi gửi lên server:', error)
        if (error.response) {
          console.log('📥 Server trả về lỗi:', error.response.data)
        } else {
          console.log('📡 Không kết nối được với server')
        }
        throw error
      }
    },
    async updateCart( product_id , pet_id , quantity ) {
      const index = this.items.findIndex(
    item =>
      (product_id && item.product_id == product_id) ||
      (pet_id && item.pet_id == pet_id)
      )
      if (index === -1) {
        alert("❌ Không tìm thấy sản phẩm/thú cưng trong giỏ hàng")
        return
      }
      const item = this.items[index]
      const maxStock = item.product_id ? item.stock : item.stock 
      if (quantity > maxStock) {
        alert(`❌ Số lượng vượt quá tồn kho. Tối đa: ${maxStock}`)
        return
      }
      this.items[index].quantity = quantity
      const url = this.isLoggedIn
        ? 'api/cart/updateDB'
        : '/cart/updatesession'
      await apiClient.get('http://localhost:8000/sanctum/csrf-cookie')
      await apiClient.put(url, { product_id, pet_id, quantity })
      await this.fetchCart()
    },
    async removeFromCart(product_id , pet_id ) {
      const url = this.isLoggedIn
        ? 'api/cart/deleteDB'
        : '/cart/deletesession'
      // await apiClient.get('http://localhost:8000/sanctum/csrf-cookie')
      await apiClient.delete(url, { data: { product_id,pet_id } })
      await this.fetchCart()
    },
    async checkout(formData) {
    try {
    if (!this.isLoggedIn) {
      alert('Bạn cần đăng nhập để thanh toán');
      return;
    }
    const payload = {
      customer_name: formData.customer_name,
      customer_email: formData.customer_email || null,
      notes: formData.notes || '',
      phone: formData.phone || null,
      city: formData.city || null,
      district: formData.district || null,
      ward: formData.ward || null,
      description: formData.description || '',
      payment_method: formData.payment_method || 'cod',
      payment_type: formData.payment_type,
      total_price: this.totalAfterDiscount,
      coupon_id: this.coupon_id,
      coupon_code: this.coupon_code,
      discount: formData.discount,
      products: formData.products.filter(item => item.id).map(item => ({
        id: item.id,
        price: item.price,  
        quantity: item.quantity
      })),
      pets: formData.pets.filter(item => item.id).map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity
      }))
    };
    
    const res = await apiClient.post('/api/bill-add', payload);
    console.log('Thanh toán thành công', res.data);
    this.items = [];
      } catch (error) {
        console.error('Lỗi khi thanh toán', error.response?.data || error);
        throw error;
      }
    },

    async clearCart() {
      const url = this.isLoggedIn
        ? 'api/cart/DB/clear'
        : '/cart/session/clear'
      // await apiClient.get('http://localhost:8000/sanctum/csrf-cookie')
      await apiClient.delete(url)
      this.items = []
    },
    async applyCoupon(code){
      try {
        this.error = null
        const res = await apiClient.post('/api/apply-coupon',{
        code,
        total: this.totalPrice 
        })
        this.coupon_id = res.data.coupon_id
        this.coupon_code = res.data.coupon_code
        this.discount = res.data.discount
      } catch (error) {
        this.coupon_id=null;
        this.coupon_code=null;
        this.discount=0;
        this.error = error.response.data.message;
      }
    }
  },
})
