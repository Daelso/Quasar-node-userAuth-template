const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        name: "home",
        path: "",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        name: "register",
        path: "/register",
        component: () => import("pages/registry/registerPage.vue"),
      },
      {
        name: "login",
        path: "/login",
        component: () => import("pages/registry/loginPage.vue"),
      },
      {
        name: "passwordForgot",
        path: "passwordForgot",
        component: () => import("pages/registry/passwordForgot.vue"),
      },
      {
        name: "passwordReset",
        path: "passwordReset/:user",
        component: () => import("pages/registry/passwordReset.vue"),
      },
      {
        name: "activateAccount",
        path: "activateAccount",
        component: () => import("pages/registry/activateAccount.vue"),
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
