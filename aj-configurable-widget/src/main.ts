import { install as installViewUIPlus } from "view-ui-plus";
import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import { runtimeConfig } from "./config/runtime";
import "view-ui-plus/dist/styles/viewuiplus.css";
import "./styles/main.less";

const demoWindow = window as Window & { config?: { dsApiRoot?: string } };
demoWindow.config ??= {};
demoWindow.config.dsApiRoot ??= runtimeConfig.adminApiRoot;

const app = createApp(App);
const mockManagement = import.meta.env.DEV && import.meta.env.VITE_MOCK_LIST_MANAGEMENT === "true";

app.use({ install: installViewUIPlus });
app.use(createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/list" },
    { path: "/list", name: "list-management", component: () => import("./components/list/list.vue"), meta: { title: "列表管理" } },
    { path: "/form", name: "form-management", component: () => import("./components/form/list.vue"), meta: { title: "表单管理" } },
    {
      path: "/list-info",
      name: "list-info",
      component: () => import("./components/list/info.vue"),
      props: mockManagement ? { initialConfigId: 1 } : false,
      meta: { title: "列表配置" },
    },
    {
      path: "/form-info",
      alias: "/form-inf",
      name: "form-info",
      component: () => import("./components/form/info/info.vue"),
      props: mockManagement ? { initialConfigId: 101 } : false,
      meta: { title: "表单配置" },
    },
  ],
}));
app.mount("#app");
