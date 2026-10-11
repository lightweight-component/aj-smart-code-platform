---
title: 表单设计器 FormSchema 参考
description: FormSchema v1 字段、布局、校验和导入格式说明。
tags:
  - 表单设计器
  - Schema
layout: layouts/docs-cn.njk
---

# FormSchema 参考

设计器使用版本化 JSON 描述表单。当前仅支持 `version: 1`。Schema 可通过工具栏的 **Schema** 对话框编辑，也可以导出为 JSON 文件并在以后重新导入。控件的全部类型和属性见[控件配置参考](/form-designer/widgets-cn/)。

## 顶层结构

```ts
interface FormSchema {
  version: 1;
  props: {
    labelPosition: "left" | "right" | "top";
    labelWidth: number;
  };
  items: Array<FormField | FormRow>;
}
```

- `version`：固定为 `1`。
- `props.labelPosition`：表单标签位置，可选 `left`、`right`、`top`，默认 `right`。
- `props.labelWidth`：表单标签宽度，默认 `100`。属性面板输入范围为 40–300。
- `items`：表单根级内容，按数组顺序渲染字段和栅格行。

## 字段节点

```json
{
  "id": "name-node",
  "kind": "field",
  "field": "name",
  "label": "名称",
  "required": true,
  "widget": {
    "type": "Input",
    "props": {
      "placeholder": "请输入名称"
    }
  }
}
```

- `id`：节点标识。所有字段、行和列的 ID 必须唯一。
- `kind`：字段固定为 `field`。
- `field`：表单数据键，必须非空且在整张表单内唯一。
- `label`：显示标签。
- `required`：只有值严格为 `true` 时视为必填。
- `widget.type`：控件类型，必须是[控件配置参考](/form-designer/widgets-cn/)中列出的类型。
- `widget.props`：传给 View UI Plus 控件的 props；缺省时按空对象处理。
- `widget.options`：选择类控件的选项数组。
- `widget.action`：仅供 Button 使用的动作配置。

Schema 导入时缺少 `id` 会生成新 ID；缺少字段名会生成临时字段名，缺少标签时使用“未命名字段”。但为了让 Schema 可读、稳定地进行版本管理，建议始终显式保存这些值。

## 选项

选择类控件的 `widget.options` 使用以下结构：

```json
[
  { "label": "草稿", "value": "draft" },
  { "label": "数量", "value": 12 },
  { "label": "启用", "value": true }
]
```

`value` 可为字符串、数字或布尔值。属性面板的多行文本格式与 Schema 可往返转换，详见[控件配置参考](/form-designer/widgets-cn/)。

## 两列栅格行

```json
{
  "id": "identity-row",
  "kind": "row",
  "columns": [
    { "id": "identity-left", "span": 12, "fields": [] },
    { "id": "identity-right", "span": 12, "fields": [] }
  ]
}
```

行必须恰好有两个列，列宽 `span` 大于 0 且不超过 24，两列宽度之和必须为 24。缺少或无效的列宽会先规范化为 `12`，之后再检查总和。每列的 `fields` 只接受字段，不接受嵌套行。设计器中新建的行默认宽度为 `12 + 12`。

## Button 动作

普通 Button 可以省略 `action`，此时按 `none` 处理。

```json
{
  "id": "save-node",
  "kind": "field",
  "field": "save",
  "label": "保存",
  "required": false,
  "widget": {
    "type": "Button",
    "props": { "type": "primary" },
    "action": { "type": "emit", "event": "save" }
  }
}
```

动作类型：

- `{ "type": "none" }`：普通按钮。
- `{ "type": "emit", "event": "save" }`：生成 `save` 事件处理器。事件名须匹配 `^[a-zA-Z][a-zA-Z0-9:_-]*$`。
- `{ "type": "code", "code": "emit('save', formData);" }`：把 `code` 写入 SFC 中独立的点击函数。代码不能包含 `</script`（不区分大小写）。

`action` 不能用于非 Button 控件。动作详细行为和安全边界见[控件配置参考](/form-designer/widgets-cn/)。

## 完整示例

```json
{
  "version": 1,
  "props": {
    "labelPosition": "right",
    "labelWidth": 100
  },
  "items": [
    {
      "id": "name-node",
      "kind": "field",
      "field": "name",
      "label": "名称",
      "required": true,
      "widget": {
        "type": "Input",
        "props": { "placeholder": "请输入名称" }
      }
    },
    {
      "id": "status-node",
      "kind": "field",
      "field": "status",
      "label": "状态",
      "required": false,
      "widget": {
        "type": "Select",
        "props": {},
        "options": [
          { "label": "草稿", "value": "draft" },
          { "label": "发布", "value": "published" }
        ]
      }
    },
    {
      "id": "actions-row",
      "kind": "row",
      "columns": [
        {
          "id": "actions-left",
          "span": 12,
          "fields": [
            {
              "id": "save-node",
              "kind": "field",
              "field": "save",
              "label": "保存",
              "required": false,
              "widget": {
                "type": "Button",
                "props": { "type": "primary" },
                "action": { "type": "emit", "event": "save" }
              }
            }
          ]
        },
        { "id": "actions-right", "span": 12, "fields": [] }
      ]
    }
  ]
}
```

## 导入校验与规范化

新版 Schema 导入时会检查对象结构、版本、支持的控件类型、节点 ID 唯一性、字段名唯一性、Button 动作以及两列布局约束。无效数据不会替换当前设计。部分可选属性会规范化为默认值，例如标签位置为 `right`、标签宽度为 `100`。

设计器还可导入旧版通用设计器数据。迁移只针对可识别的表单结构，处理方式及提示见[开发与集成指南](/form-designer/development-cn/#旧版设计数据迁移)。
