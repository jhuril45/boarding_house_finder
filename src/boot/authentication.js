import { storeToRefs } from "pinia";
import { useUserStore } from "stores/user";

export default async ({ app, store, router, axios }) => {
  const userStore = useUserStore();

  const { getUser } = storeToRefs(userStore);

  await userStore.checkAuth();
  /**
   * Before each route update
   */
  router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
      if (!getUser.value) {
        next({
          name: "Landing",
        });
      } else {
        next();
      }
    } else if (to.matched.some((record) => record.name === "Login")) {
      if (getUser.value) {
        next({
          name: "Landing",
        });
      } else {
        next();
      }
    } else {
      next(); // make sure to always call next()!
    }
  });
};
