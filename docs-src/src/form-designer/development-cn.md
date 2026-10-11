---
title: 表单设计器开发与集成指南
description: 将生成的 Vue 表单集成到项目中，并扩展 aj-form-designer。
tags:
  - 表单设计器
  - Vue
layout: layouts/docs-cn.njk
---

# 开发与集成指南

本文面向将生成组件接入业务工程的开发者，以及需要修改设计器源码的维护者。

## 在宿主 Vue 工程中使用生成组件

设计器通过 **生成 SFC** 查看代码，并下载为 `GeneratedForm.vue`。生成组件使用 Vue 3 `<script setup lang="ts">` 和 View UI Plus 的 `Form`、`FormItem`、字段控件与 `Row/Col`。

### 注册 View UI Plus

生成文件不会导入或注册 View UI Plus。宿主应用需全局注册 `view-ui-plus`，或按需注册生成文件中实际使用的组件。按需注册时，通常还要包含 `Form` 与 `FormItem`；选择字段会使用 `Option`、`Radio` 或 `Checkbox`，栅格使用 `Row`、`Col`。

示例全局注册：

```ts
import { createApp } from "vue";
import ViewUIPlus from "view-ui-plus";
import "view-ui-plus/dist/styles/viewuiplus.css";
import App from "./App.vue";

createApp(App).use(ViewUIPlus).mount("#app");
```

将文件放进宿主工程后，可像普通 Vue 组件一样引入。Button 若配置为事件动作，宿主监听对应事件：

```vue
<GeneratedForm @save="saveForm" />
```

生成组件的事件处理器会传出当前 `formData` 的 JSON 副本。接口请求、路由、权限和业务状态由宿主负责。

### 生成代码包含和不包含的内容

生成器根据 Schema 输出表单模型绑定、控件 props、选项控件和两列布局。它只生成画布中设计的 Button，不会自动增加提交、重置或校验按钮。

设计器预览会为 `required` 字段建立必填规则；当前生成器只把 `required` 传给 `FormItem` 作为必填标记，不会输出相同的校验规则，也不会自动实现表单提交。宿主需要自行补充规则和操作流程。

配置为 `code` 的 Button 动作会原样进入生成组件，代码可用 `formData`、`emit` 和 `event`。它不会在设计器预览中执行。只生成和运行可信代码；有业务副作用的逻辑优先放到宿主事件处理器。

## 旧版设计数据迁移

本地文件导入和 Schema 对话框导入都先判断是否为新版 `version: 1` Schema；否则尝试读取旧版通用设计器树中的 `Form` 节点。

迁移器会保留可明确转换的表单配置：

- `Form` 的 `labelPosition`、`labelWidth`；
- `FormItem` 中首个受支持的字段；
- 直接位于 `Form` 子级的 `Row` 与其中的 `Col`；
- 支持的字段类型、字段 props、标签、必填状态和字段名。

当前受支持的字段列表见[控件配置参考](/form-designer/widgets-cn/)。无法识别或不能安全转换的节点会跳过并生成警告。如果旧行有超过两列，只迁移前两列；只有一列时会补一个空列；没有 `Col` 时跳过该行。若没有可迁移字段，导入会报错，不会替换当前设计。

迁移字段名优先取旧 `FormItem.props.prop`，然后取字段 `props.name`，最后使用控件类型；名称会规范化为英文字母、数字、下划线和 `$`，重复名称会自动加序号。Button 标签优先取旧节点文本，没有文本时使用“提交”。

## 源码结构

| 路径 | 职责 |
| --- | --- |
| `src/core/form-schema.ts` | Schema 类型、新建节点、导入规范化和结构校验。 |
| `src/core/form-options.ts` | 选项编辑文本与结构化选项之间的转换。 |
| `src/core/form-data.ts` | 展平字段列表、同步预览表单数据。 |
| `src/core/legacy-migration.ts` | 旧版通用组件树迁移到 `FormSchema`。 |
| `src/core/vue-sfc-generator.ts` | 将 Schema 生成 Vue 单文件组件。 |
| `src/registry/form-widgets.ts` | 控件面板分组、图标、默认属性和默认选项。 |
| `src/stores/designer.ts` | Pinia 编辑状态、选择、复制删除和撤销/重做历史。 |
| `src/components/designer/` | 设计器界面、组件面板、画布、属性面板和预览。 |
| `src/demo/form-schema.ts` | 应用启动时载入的示例表单。 |

## 扩展控件的基本步骤

1. 在 `src/core/form-schema.ts` 的 `FieldType` 中加入类型，并更新 Schema 类型检查。
2. 在 `src/registry/form-widgets.ts` 增加面板定义、默认 props 和选项（如适用）。
3. 在 `FormFieldNode.vue` 增加预览渲染方式；涉及容器结构的控件还需明确画布拖放规则。
4. 如有专属设置，在 `PropertyPanel.vue` 加入编辑控件与读写逻辑；可复用选项解析时更新相应条件。
5. 在 `vue-sfc-generator.ts` 加入生成模板，并确保控件 props、`v-model` 和选项与预览行为一致。
6. 扩展 Schema 校验与迁移逻辑，并为规范化、预览、迁移和生成分别补充测试。

只新增 View UI Plus props 而不改变控件类型时，通常可直接使用属性面板的高级 JSON 属性，无须改动控件注册表。

## 本地开发与验证

在 `aj-form-designer` 项目目录运行：

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
```

`npm run dev` 启动 Vite 开发服务器；`typecheck` 执行 `vue-tsc --noEmit`；`test` 使用 Vitest；`build` 先进行类型检查，再生成生产构建文件。

## 常见问题

- **导入提示字段名重复**：表单数据以字段名作为对象键，修改重复字段名后再导入。
- **提示控件类型不支持**：Schema 的 `widget.type` 只能使用[控件配置参考](/form-designer/widgets-cn/)列出的类型。
- **两列栅格无法导入**：检查 `columns` 是否恰好两项、`span` 是否在 1–24 之间且总和为 24；列内只能放字段。
- **选项文本无效**：使用每行 `标签=值` 格式。数值和布尔值分别使用 `number:`、`boolean:` 前缀。
- **高级属性没有生效**：高级属性必须是 JSON 对象，且属性名和值需符合当前 View UI Plus 组件版本。
- **生成组件显示未知组件**：确认宿主已经全局注册或按需注册生成 SFC 所引用的 View UI Plus 组件。
- **旧版导入后部分内容消失**：迁移器仅转换可识别的表单结构。查看导入提示；无法安全转换的展示节点会被跳过。
