import { defineConfig, loadEnv, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue";

const widgetConfigPath = "/api/common_api/ds_widget_config";
const mockListConfigs = [
  ["商品管理", "商品编辑表单", "/api/product/page_no"],
  ["订单管理", "订单编辑表单", "/api/order/page_no"],
  ["库存管理", "库存编辑表单", "/api/inventory/page_no"],
  ["供应商管理", "供应商编辑表单", "/api/supplier/page_no"],
  ["客户管理", "客户编辑表单", "/api/customer/page_no"],
  ["员工管理", "员工编辑表单", "/api/staff/page_no"],
  ["合同管理", "合同编辑表单", "/api/contract/page_no"],
  ["采购申请", "采购申请表单", "/api/purchase/page_no"],
  ["仓库管理", "仓库编辑表单", "/api/warehouse/page_no"],
  ["退款记录", "退款处理表单", "/api/refund/page_no"],
].map(([name, bindingFormName, url], index) => ({
  id: (index + 1),
  name,
  type: "LIST",
  stat: 0,
  createDate: "2026-01-05T09:00:00",
  updateDate: "2026-01-08T15:30:00",
  config: {
    page: 2,
    bindingFormId: 101 + index,
    bindingFormName,
    dataBinding: { url, httpMethod: "GET" },
    fields: [
      { key: "id", title: "编号", width: 90, isShow: true, render: "raw" },
      { key: "name", title: "名称", isShow: true, render: "raw" },
      { key: "status", title: "状态", width: 120, isShow: true, render: "raw" },
    ],
  },
}));

const mockFormConfigs = mockListConfigs.map(({ id, stat, createDate, updateDate, config }) => {
  const tableName = config.dataBinding.url.split("/")[2];
  return {
    id: 100 + id,
    name: config.bindingFormName,
    type: "FORM",
    stat,
    createDate,
    updateDate,
    datasourceName: "演示数据库",
    tableName,
    config: {
      infoApi: `/api/${tableName}`,
      labelWidth: 100,
      dataBinding: { url: `/api/${tableName}`, httpMethod: "GET" },
      updateApi: { url: `/api/${tableName}`, httpMethod: "PUT" },
      isShowBtns: true,
      fields: [
        { name: "name", label: "名称", isShow: true, uiType: 1, uiLayout: 1, jsonType: "string", isNull: false },
        { name: "description", label: "说明", isShow: true, uiType: 1, uiLayout: 1, jsonType: "string", isNull: true },
      ],
    },
  };
});

function mockWidgetManagement(): Plugin {
  return {
    name: "mock-widget-management",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = new URL(req.url ?? "/", "http://localhost");
        const type = url.searchParams.get("q_type");
        const configs = type === "LIST" ? mockListConfigs : type === "FORM" ? mockFormConfigs : undefined;
        if (req.method === "GET" && url.pathname === `${widgetConfigPath}/page_no` && configs) {
          const pageNo = Math.max(1, Number.parseInt(url.searchParams.get("pageNo") ?? "", 10) || 1);
          const pageSize = Math.max(1, Number.parseInt(url.searchParams.get("pageSize") ?? "", 10) || 9);
          const start = (pageNo - 1) * pageSize;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({
            status: true,
            data: { list: configs.slice(start, start + pageSize), totalCount: configs.length },
          }));
          return;
        }

        const config = [...mockListConfigs, ...mockFormConfigs].find(({ id }) => url.pathname === `${widgetConfigPath}/${id}`);
        if (config && req.method === "GET") {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ status: true, data: config }));
          return;
        }

        if (config || (url.pathname === widgetConfigPath && (req.method === "POST" || req.method === "PUT"))) {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ status: false, data: null, message: "模拟配置数据为只读" }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_DEV_PROXY_TARGET;

  return {
    base: "./",
    plugins: [vue(), env.VITE_MOCK_LIST_MANAGEMENT === "true" && mockWidgetManagement()],
    server: target
      ? {
          proxy: {
            "/api": {
              target,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""),
            },
          },
        }
      : undefined,
  };
});
