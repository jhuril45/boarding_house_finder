import axios from "axios";
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
        img: "/images/bhouse1.jpg",
        business_permit_img: "images/bpermit.jpg",
        other_images: [
          "/images/bhouse1-1.jpg",
          "/images/bhouse1-2.jpg",
          "/images/bhouse1-3.jpg",
        ],
        title: "Beautiful Property 1",
        description: "Lorem ipsum dolor sit amet",
        location: {
          // latitude: Math.random() * 180 - 90,
          // longitude: Math.random() * 360 - 180,
          latitude: 8.9538327,
          longitude: 125.529305,
        },
        price: 100,
        user: "test@gmail.com",
        contact_number: "09123456789",
      },
      {
        id: 2,
        img: "images/bhouse2.jpg",
        business_permit_img: "images/bpermit.jpg",
        other_images: [
          "/images/bhouse2-1.jpg",
          "/images/bhouse2-2.jpg",
          "/images/bhouse2-3.jpg",
        ],
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
        img: "images/bhouse3.jpg",
        business_permit_img: "images/bpermit.jpg",
        other_images: [
          "/images/bhouse3-1.jpg",
          "/images/bhouse3-2.jpg",
          "/images/bhouse3-3.jpg",
        ],
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
    bookings: [
      // {
      //   listing_id: 1,
      //   date: "2024/04/17",
      //   time: "05:25",
      //   id: 1,
      //   user: "test@gmail.com",
      //   status: "declined",
      // },
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
    getMyListings(state) {
      return state.listings.filter((x) => x.user === state.user?.email);
    },
    getMyBookings(state) {
      return state.bookings.filter((x) => x.user === state.user?.email);
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
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          // await axios
          //   .post("api/listing", data)
          //   .then(function (response) {
          //     resolve(response.data);
          //   })
          //   .catch(function (error) {
          //     reject(error);
          //   });
          this.listings.unshift({
            ...data,
            id: this.listings.length + 1,
            user: this.user.email,
          });
          resolve(this.listings);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async removeListing(data) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("removeListing", data);
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          // await axios
          //   .post("api/listing", data)
          //   .then(function (response) {
          //     resolve(response.data);
          //   })
          //   .catch(function (error) {
          //     reject(error);
          //   });
          const index = this.listings.findIndex((x) => x.id === data.id);
          this.listings.splice(index, 1);
          const arr = [];
          this.bookings.map((x, index) => {
            if (x.listing_id !== data.id) {
              arr.push(x);
            }
          });

          this.bookings = arr;
          resolve(this.listings);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async submitBooking(data) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("submitBooking", data);
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          // await axios
          //   .post("api/listing", data)
          //   .then(function (response) {
          //     resolve(response.data);
          //   })
          //   .catch(function (error) {
          //     reject(error);
          //   });
          this.bookings.unshift({
            ...data,
            id: this.bookings.length + 1,
            user: this.user.email,
          });
          resolve(this.bookings);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async removeBooking(data) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("submitBooking", data);
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          // await axios
          //   .post("api/listing", data)
          //   .then(function (response) {
          //     resolve(response.data);
          //   })
          //   .catch(function (error) {
          //     reject(error);
          //   });
          const index = this.bookings.findIndex((x) => x.id === data.id);
          this.bookings.splice(index, 1);
          resolve(this.bookings);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async approveBooking(data) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("approveBooking", data);
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          // await axios
          //   .post("api/listing", data)
          //   .then(function (response) {
          //     resolve(response.data);
          //   })
          //   .catch(function (error) {
          //     reject(error);
          //   });
          const index = this.bookings.findIndex((x) => x.id === data.id);
          this.bookings.splice(index, 1, {
            ...this.bookings[index],
            status: "approved",
          });
          resolve(this.bookings);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async declineBooking(data) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("declineBooking", data);
          const formData = new FormData();
          Object.keys(data).forEach((key) => {
            formData.append(key, data[key]);
          });
          // await axios
          //   .post("api/listing", data)
          //   .then(function (response) {
          //     resolve(response.data);
          //   })
          //   .catch(function (error) {
          //     reject(error);
          //   });
          const index = this.bookings.findIndex((x) => x.id === data.id);
          this.bookings.splice(index, 1, {
            ...this.bookings[index],
            status: "declined",
          });
          resolve(this.bookings);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
  },
});
