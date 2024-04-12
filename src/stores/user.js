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
        img: "https://picsum.photos/id/1015/200/200",
        title: "Beautiful Property 1",
        subtitle: "Lorem ipsum dolor sit amet",
      },
      {
        img: "https://picsum.photos/id/1016/200/200",
        title: "Stunning Property 2",
        subtitle: "Sed ut perspiciatis unde",
      },
      {
        img: "https://picsum.photos/id/1018/200/200",
        title: "Modern Property 3",
        subtitle: "Neque porro quisquam est",
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
  },
});
