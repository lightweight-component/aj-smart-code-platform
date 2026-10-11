import { createRouter, createWebHashHistory } from "vue-router";

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/list" },
    { path: "/list", name: "list-management", component: () => import("../components/list/list.vue"), meta: { title: "列表管理" } },
    { path: "/form", name: "form-management", component: () => import("../components/form/list.vue"), meta: { title: "表单管理" } },
  ],
});
