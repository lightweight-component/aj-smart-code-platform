# AJ 可配置组件库

`@ajax-js/configurable-widget` 是一套基于 Vue 3 和 iView UI（View UI Plus）的可配置组件，主要用于快速搭建后台管理页面中的数据列表和表单。定义好列表列、表单字段和数据接口后，就可以用同一套组件渲染不同的业务页面，减少重复编写表格、分页和表单的工作。

## 组件

| 组件 | 用途 |
| --- | --- |
| `ListLoader` | 按配置加载并渲染数据列表。可配置显示列、列格式、分页数据接口，以及新建和编辑入口。 |
| `FormLoader` | 按配置渲染表单。可配置字段标签、控件类型、布局，以及用于读取详情和保存数据的接口。 |
| `ListMgr` | 查看和预览列表配置，提供新建和编辑入口。 |
| `FormMgr` | 查看和预览表单配置，提供新建和编辑入口。 |
| `ListInfo` | 新建或编辑列表配置。 |
| `FormInfo` | 新建或编辑表单配置。 |

例如，搭建一个商品管理页面时，可以为列表配置商品名称、价格和状态列，并绑定分页接口。表单复用同一业务数据，按字段配置文本框、数字输入框和下拉框，并绑定商品详情和保存接口。

## 在项目中使用

在本库根目录执行 `npm install` 和 `npm pack`，再到接入项目中安装生成的包：

```sh
npm install /path/to/ajax-js-configurable-widget-1.0.0.tgz
```

在接入应用中注册 View UI Plus 和 Vue Router，并引入 View UI Plus 和组件库各自的样式。已在后端保存列表和表单配置后，将配置 ID 传给对应组件：

```vue
<script setup lang="ts">
import { ListLoader, FormLoader } from "@ajax-js/configurable-widget";
import "view-ui-plus/dist/styles/viewuiplus.css";
import "@ajax-js/configurable-widget/style.css";
</script>

<template>
  <ListLoader :id="101" />
  <FormLoader :id="201" />
</template>
```

这里的 `101` 和 `201` 分别是列表和表单的**配置 ID**。在应用加载前设置 `window.config.dsApiRoot` 作为配置和数据接口的根路径，并设置 `window.__AJ_DATASERVICE_CONFIG__.adminApiRoot` 供管理列表使用。若接口配置使用了 `{iam_prefix}`，还需设置 `window.config.iamApi`。

使用管理页的新建和编辑入口时，在宿主应用中注册配置编辑路由：

```ts
import { ListInfo, FormInfo } from "@ajax-js/configurable-widget";

const routes = [
  { path: "/list-info", component: ListInfo },
  { path: "/form-info", component: FormInfo },
];
```

Vue、Vue Router 和 View UI Plus 由接入应用提供，并在包中声明为 `peerDependencies`。组件库构建将第三方依赖保留为外部引用。

## 本地开发与构建

```sh
npm install
npm run dev
```

开发网站提供列表和表单管理页面，便于联调和预览。开发环境默认将 `/api` 请求代理到 `http://localhost:8080`，代理设置见 `.env.development`，运行时接口地址仍需按上文设置。

| 命令 | 用途 |
| --- | --- |
| `npm run build` | 检查类型并构建网站。 |
| `npm run build:lib` | 生成 ESM、CSS 和 TypeScript 声明，输出到 `target/npm`。 |
| `npm pack` | 自动构建组件库并生成可本地安装的 `.tgz`。 |
