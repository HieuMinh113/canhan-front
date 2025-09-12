
import { defineStore } from 'pinia'
import apiClient from '@/service/axios'

export const useLoyaltyStore = defineStore('loyalty', {
  state: () => ({
    point: 0,
    rank: null,
    discount: 0, 
    loading: false,
  }),

   actions: {
    async fetchLoyalty() {
      if (!localStorage.getItem('auth_token')) return;
      this.loading = true;
      try {
        const res = await apiClient.get('/api/loyalty');
        this.point = res.data.point;
        this.rank = res.data.rank;
        this.discount = res.data.discount;
      } finally {
        this.loading = false;
      }
    },
    async fetchByEmail(email) {
      if (!email) return this.reset();
      this.loading = true;
      try {
        const res = await apiClient.get('/api/loyalty-by-email', { params: { email } });
        this.point = res.data.point;
        this.rank = res.data.rank;
        this.discount = res.data.discount;
      } catch (error) {
        this.reset();
      } finally {
        this.loading = false;
      }
    },
    reset() {
      this.point = 0;
      this.rank = null;
      this.discount = 0;
    }
  }
})
