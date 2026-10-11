---
title: AJ 表单设计器
description: aj-form-designer 使用 Vue 3 和 View UI Plus 可视化设计表单，并生成稳定的 FormSchema 与 Vue SFC。
tags:
  - 表单设计器
  - Vue
layout: layouts/docs-cn.njk
---

# AJ 表单设计器

`aj-form-designer` 是面向 View UI Plus 表单的 Vue 3 可视化设计器。它聚焦于明确的表单字段、两列栅格和数据 Schema，不试图覆盖所有页面布局或 View UI Plus 组件。

## 工作流程

1. 从控件面板拖入字段或两列栅格，在画布中组织布局。
2. 在属性面板配置字段名、标签、必填状态和控件属性。
3. 使用预览填写表单并检查必填项。
4. 导出 `FormSchema` JSON 以便后续编辑，或生成 Vue 单文件组件供业务工程使用。

## 文档

- [使用教程](/form-designer/guide-cn/)
- [控件配置参考](/form-designer/widgets-cn/)
- [FormSchema 参考](/form-designer/schema-cn/)
- [开发与集成指南](/form-designer/development-cn/)

## 快速启动

在代码仓库根目录运行：

```bash
cd aj-form-designer
npm install
npm run dev
```

在终端显示的本地地址打开设计器。开发、类型检查、测试和构建命令见[开发与集成指南](/form-designer/development-cn/#本地开发与验证)。

## 当前范围

设计器支持文本、数值、选择、日期时间、开关、滑块、评分、颜色和 Button 等表单控件。根画布支持字段与两列栅格，栅格列内只支持字段。新版 Schema 当前为 `version: 1`。

导出的 Vue SFC 假定宿主工程已经注册 View UI Plus。生成器不会自行添加提交、重置或校验规则；需要业务行为时，建议由宿主页面监听 Button 事件处理。详见[开发与集成指南](/form-designer/development-cn/)。
