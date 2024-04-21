import { defineStore } from "pinia";

export const useUserStore = defineStore("counter", {
  state: () => ({
    user: null,
    location: {
      latitude: 8.9538327,
      longitude: 125.529305,
      // latitude: 0,
      // longtitude: 0,
    },
    listings: [
      {
        id: 1,
        img: "https://picsum.photos/id/1015/200/200",
        title: "Beautiful Property 1",
        description: "Lorem ipsum dolor sit amet",
        location: {
          // latitude: Math.random() * 180 - 90,
          // longitude: Math.random() * 360 - 180,
          latitude: 8.9538327,
          longitude: 125.529305,
        },
        price: 100,
        user: "test@example.com",
        contact_number: "09123456789",
      },
      {
        id: 2,
        img: "https://picsum.photos/id/1016/200/200",
        title: "Stunning Property 2",
        description: "Sed ut perspiciatis unde",
        location: {
          // latitude: Math.random() * 180 - 90,
          // longitude: Math.random() * 360 - 180,
          latitude: 8.944733,
          longitude: 125.5347149,
        },
        price: 100,
        user: "test@example.com",
        contact_number: "09123456789",
      },
      {
        id: 3,
        img: "https://picsum.photos/id/1018/200/200",
        title: "Modern Property 3",
        description: "Neque porro quisquam est",
        location: {
          // latitude: Math.random() * 180 - 90,
          // longitude: Math.random() * 360 - 180,
          latitude: 8.943271,
          longitude: 125.5274679,
        },
        price: 100,
        user: "test@example.com",
        contact_number: "09123456789",
      },
    ],
  }),

  getters: {
    getUser(state) {
      return state.user;
    },
    getListings(state) {
      return state.listings;
    },
    getUserLocation(state) {
      return state.location;
    },
  },

  actions: {
    async checkAuth() {
      return new Promise(async (resolve, reject) => {
        try {
          // const response = await api.get("user");
          // this.user = response.data;
          const user = localStorage.getItem("user_info");
          this.user = user ? JSON.parse(user) : null;
          console.log("this.user", this.user);
          resolve();
        } catch (error) {
          console.log("checkAuth error", error);
        } finally {
          resolve();
        }
      });
    },
    setLocation(location) {
      this.location = location;
    },
    getCurrentLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("this.location", this.location);
          this.location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log(this.location);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    },
    async register(user) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("register", user);
          this.user = user;
          localStorage.setItem("user_info", JSON.stringify(user));
          resolve(this.user);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async login(user) {
      return new Promise(async (resolve, reject) => {
        try {
          this.user = user;
          localStorage.setItem("user_info", JSON.stringify(user));
          resolve(this.user);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async logout(user) {
      return new Promise(async (resolve, reject) => {
        try {
          this.user = null;
          localStorage.removeItem("user_info");
          resolve(this.user);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async submitListing(data) {
      return new Promise(async (resolve, reject) => {
        try {
          this.listings.unshift({
            ...data,
            id: this.listings.length + 1,
            user: "test@example.com",
          });
          resolve(this.listings);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
  },
});
