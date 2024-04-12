import { defineStore } from "pinia";

export const useUserStore = defineStore("counter", {
  state: () => ({
    user: null,
    location: {
      latitude: 0,
      longtitude: 0,
    },
    listings: [
      {
        id: 1,
        img: "https://picsum.photos/id/1015/200/200",
        title: "Beautiful Property 1",
        description: "Lorem ipsum dolor sit amet",
        price: 100,
        user: "test@example.com",
        contact_number: "09123456789",
      },
      {
        id: 2,
        img: "https://picsum.photos/id/1016/200/200",
        title: "Stunning Property 2",
        description: "Sed ut perspiciatis unde",
        price: 100,
        user: "test@example.com",
        contact_number: "09123456789",
      },
      {
        id: 3,
        img: "https://picsum.photos/id/1018/200/200",
        title: "Modern Property 3",
        description: "Neque porro quisquam est",
        price: 100,
        user: "test@example.com",
        contact_number: "09123456789",
      },
    ],
  }),

  getters: {
    doubleCount(state) {
      return state.counter * 2;
    },
  },

  actions: {
    setLocation(location) {
      this.location = location;
    },
    getCurrentLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
    async login(user) {
      return new Promise(async (resolve, reject) => {
        try {
          this.user = user;
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
