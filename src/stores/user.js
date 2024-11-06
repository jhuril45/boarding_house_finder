import axios from "axios";
import { defineStore } from "pinia";
import useParse from "src/util/parseDb.js";
const { ParseDB, ParseObj, handleParseError } = useParse();

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
      // {
      //   id: 1,
      //   img: "/images/bhouse1.jpg",
      //   business_permit_img: "images/bpermit.jpg",
      //   other_images: [
      //     "/images/bhouse1-1.jpg",
      //     "/images/bhouse1-2.jpg",
      //     "/images/bhouse1-3.jpg",
      //   ],
      //   title: "Beautiful Property 1",
      //   description: "Lorem ipsum dolor sit amet",
      //   location: {
      //     // latitude: Math.random() * 180 - 90,
      //     // longitude: Math.random() * 360 - 180,
      //     latitude: 8.9538327,
      //     longitude: 125.529305,
      //   },
      //   price: 100,
      //   user: "test@gmail.com",
      //   contact_number: "09123456789",
      //   person_per_room: 2,
      //   status: "available",
      // },
      // {
      //   id: 2,
      //   img: "images/bhouse2.jpg",
      //   business_permit_img: "images/bpermit.jpg",
      //   other_images: [
      //     "/images/bhouse2-1.jpg",
      //     "/images/bhouse2-2.jpg",
      //     "/images/bhouse2-3.jpg",
      //   ],
      //   title: "Stunning Property 2",
      //   description: "Sed ut perspiciatis unde",
      //   location: {
      //     // latitude: Math.random() * 180 - 90,
      //     // longitude: Math.random() * 360 - 180,
      //     latitude: 8.944733,
      //     longitude: 125.5347149,
      //   },
      //   price: 100,
      //   user: "test@example.com",
      //   contact_number: "09123456789",
      //   person_per_room: 2,
      //   status: "available",
      // },
      // {
      //   id: 3,
      //   img: "images/bhouse3.jpg",
      //   business_permit_img: "images/bpermit.jpg",
      //   other_images: [
      //     "/images/bhouse3-1.jpg",
      //     "/images/bhouse3-2.jpg",
      //     "/images/bhouse3-3.jpg",
      //   ],
      //   title: "Modern Property 3",
      //   description: "Neque porro quisquam est",
      //   location: {
      //     // latitude: Math.random() * 180 - 90,
      //     // longitude: Math.random() * 360 - 180,
      //     latitude: 8.943271,
      //     longitude: 125.5274679,
      //   },
      //   price: 100,
      //   user: "test@example.com",
      //   contact_number: "09123456789",
      //   person_per_room: 2,
      //   status: "available",
      // },
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
      return state.listings.filter((x) => x.user === state.user?.get("email"));
    },
    getMyBookings(state) {
      return state.bookings.filter((x) => x.user === state.user?.get("email"));
    },
  },

  actions: {
    async checkAuth() {
      return new Promise(async (resolve, reject) => {
        try {
          const user = ParseObj.User.current();
          if (user) {
            await ParseObj.User.current().fetch();
            this.user = user;
          }
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
    async register(payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const user = new ParseObj.User();
          user.set("username", payload.email);
          user.set("password", payload.password);
          user.set("email", payload.email);
          user.set("contact_number", payload.contact_number);
          user.set("user_type", payload.user_type);
          user.set("name", payload.name);
          await user.signUp();

          this.user = ParseObj.User.current();
        } catch (error) {
          console.log("login error", error.message);
          reject(error.message);
        }
      });
    },
    async login(payload) {
      return new Promise(async (resolve, reject) => {
        try {
          await ParseDB.logOutUser();
          const user = await ParseObj.User.logIn(
            payload.email,
            payload.password
          );
          this.user = user;
          resolve(this.user);
        } catch (error) {
          console.log("login error", error.message);
          reject(error.message);
        }
      });
    },
    async logout(user) {
      return new Promise(async (resolve, reject) => {
        try {
          await ParseDB.logOutUser();
          this.user = null;
          resolve(this.user);
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    pushListing(val) {
      const other_images = [];
      val.get("other_images").map((x) => {
        other_images.push(x.url());
      });

      const obj = {
        id: val.id,
        img: val.get("img").url(),
        business_permit_img: val.get("business_permit_img").url(),
        business_permit_img: "images/bpermit.jpg",
        other_images: other_images,
        title: val.get("title"),
        description: val.get("description"),
        location: val.get("location"),
        price: val.get("price"),
        user: val.get("user").get("email"),
        contact_number: val.get("contact_number"),
        person_per_room: val.get("person_per_room"),
        status: val.get("status"),
        object: val,
      };
      const index = this.listings.find((x) => x.id == obj.id);
      if (index >= 0) {
        this.listings.splice(1, index, obj);
      } else {
        this.listings.push(obj);
      }

      return obj;
    },
    async submitListing(data) {
      return new Promise(async (resolve, reject) => {
        try {
          const obj = {
            // img: null,
            // business_permit_img: null,
            // other_images: [],
            title: "",
            description: "",
            location: null,
            price: null,
            person_per_room: null,
            contact_number: null,
          };
          const ListingClass = ParseDB.parseClass("Listing");
          const listing = new ListingClass();
          listing.set("user", this.user);
          listing.set("status", "available");

          Object.keys(obj).forEach((key) => {
            listing.set(key, data[key]);
          });

          const img = new ParseObj.File("img.jpg", { base64: data.img });
          const business_permit_img = new ParseObj.File(
            "business_permit_img.jpg",
            {
              base64: data.business_permit_img,
            }
          );
          const arr = [];
          listing.set("img", img);
          listing.set("business_permit_img", business_permit_img);

          data.other_images.forEach((val) => {
            const other_img = new ParseObj.File("other_image.jpg", {
              base64: val,
            });
            arr.push(other_img);
          });
          listing.set("other_images", arr);
          await listing.save();
          this.pushListing(listing);
          resolve();
        } catch (error) {
          console.log("login error", error);
          resolve();
        }
      });
    },
    async fetchListings(payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const parseQuery = ParseDB.parseQuery("Listing");
          parseQuery.include("user");
          // parseQuery.include("business_permit_img.file");
          parseQuery.descending("createdAt");
          const listings = await parseQuery.find();
          console.log("fetchListings", listings);
          this.listings = [];
          listings.forEach((val) => {
            this.pushListing(val);
          });
          resolve(this.listings);
        } catch (error) {
          console.log("login error", error.message);
          reject(error.message);
        }
      });
    },
    async getListingData(payload) {
      return new Promise(async (resolve, reject) => {
        try {
          const parseQuery = ParseDB.parseQuery("Listing");
          parseQuery.include("user");
          parseQuery.equalTo("id", payload.id);

          const data = await parseQuery.first();
          const listing = this.pushListing(data);
          resolve(listing);
        } catch (error) {
          console.log("login error", error.message);
          reject(error.message);
        }
      });
    },
    async removeListing(data) {
      return new Promise(async (resolve, reject) => {
        try {
          await data.object.destroy();
          await this.fetchListings();

          resolve();
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
          const booking_check = this.bookings.find(
            (x) =>
              x.date == data.date &&
              x.time == data.time &&
              x.listing_id == data.listing_id
          );
          console.log("booking_check", booking_check);
          if (booking_check) {
            reject({
              error: "Date already have scheduled Booking",
            });
          } else {
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
          }
        } catch (error) {
          console.log("login error", error);
          reject(error);
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
    async setFullListing(data) {
      return new Promise(async (resolve, reject) => {
        try {
          console.log("setFullListing", data);
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
          this.listings.splice(index, 1, {
            ...this.listings[index],
            status: "full",
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
