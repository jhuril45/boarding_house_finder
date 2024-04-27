import { storeToRefs } from "pinia";
import { useUserStore } from "stores/user";

export default async ({ app, store, router, axios }) => {
  window.RawFile = File;

  const userStore = useUserStore();

  const { getUser } = storeToRefs(userStore);

  await userStore.checkAuth();
  /**
   * Before each route update
   */
  router.beforeEach((to, from, next) => {
    console.log("to:", to);
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!getUser.value) {
        next({
          name: "Landing",
        });
      } else {
        next();
      }
    } else if (to.matched.some((record) => record.path.includes("auth"))) {
      if (getUser.value) {
        next({
          name: "Home",
        });
      } else {
        next();
      }
    } else {
      next(); // make sure to always call next()!
    }
  });
};
