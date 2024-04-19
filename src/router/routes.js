const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("pages/HomePage.vue"),
      },
      {
        path: "property/:property_id",
        component: () => import("pages/PropertyPage.vue"),
      },
      {
        path: "post-listing",
        component: () => import("pages/PostListingPage.vue"),
      },
    ],
  },
  {
    path: "/auth/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "Landing",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "register",
        name: "Register",
        component: () => import("pages/RegistrationPage.vue"),
      },
      {
        path: "login",
        name: "Login",
        component: () => import("pages/LoginPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
