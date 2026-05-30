import { create } from 'zustand';

const useRestaurantStore = create((set) => ({
  restaurant: null,
  token: localStorage.getItem('restaurantToken') || '',
  orders: [],
  setRestaurant: (v) => set({ restaurant: v }),
  setToken: (v) => { localStorage.setItem('restaurantToken', v); set({ token: v }); },
  setOrders: (v) => set({ orders: v }),
}));

export default useRestaurantStore;
