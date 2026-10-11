---
title: 表单设计器控件配置参考
description: aj-form-designer 支持的控件、属性和按钮动作。
tags:
  - 表单设计器
  - 控件
layout: layouts/docs-cn.njk
---

# 控件配置参考

设计器只提供有明确表单语义的控件。控件面板中的分组与默认值由 `src/registry/form-widgets.ts` 定义，字段结构见 [FormSchema 参考](/form-designer/schema-cn/)。

## 支持的控件

| Schema 类型 | 面板名称 | 专用属性面板 | 选项配置 |
| --- | --- | --- | --- |
| `Input` | 文本框 | 输入类型、占位提示 | — |
| `InputNumber` | 数字框 | 高级属性 | — |
| `Select` | 下拉选择 | 选项、高级属性 | 支持 |
| `RadioGroup` | 单选组 | 选项、高级属性 | 支持 |
| `CheckboxGroup` | 多选组 | 选项、高级属性 | 支持 |
| `DatePicker` | 日期选择 | 选择类型、显示格式 | — |
| `TimePicker` | 时间选择 | 高级属性 | — |
| `Switch` | 开关 | 高级属性 | — |
| `Slider` | 滑块 | 高级属性 | — |
| `Rate` | 评分 | 高级属性 | — |
| `ColorPicker` | 颜色选择 | 高级属性 | — |
| `Button` | 提交按钮 | 点击行为、事件名或自定义 JS | — |

所有字段都可配置字段名、显示标签和必填状态。字段名是表单数据的对象键，必须唯一。高级属性必须填写 JSON 对象，并作为对应 View UI Plus 控件的 props 传递。Button 的动作配置单独存储，不会传给 View UI Plus。

## 专用属性

### Input

- **输入类型**：`text`（默认）、`textarea` 或 `password`。
- **占位提示**：对应 View UI Plus `Input` 的 `placeholder` 属性。

### DatePicker

- **选择类型**：`date`（默认）、`daterange` 或 `datetime`。
- **显示格式**：默认 `yyyy-MM-dd`，传给 `DatePicker` 的 `format` 属性。

其他 `DatePicker` 选项（例如时间范围、清除按钮）可通过高级属性配置，并应遵循宿主工程所用 View UI Plus 版本的属性定义。

### Select、RadioGroup 和 CheckboxGroup

每行写一个 `标签=值`。默认值为字符串；需要数值或布尔值时，给值加类型前缀：

```text
草稿=draft
编号=number:12
启用=boolean:true
说明=string:包含等号=也可以
```

解析规则：

- `number:` 后必须是有限数字，例如 `number:12`、`number:-0.5`。
- `boolean:` 后只能是 `true` 或 `false`。
- `string:` 会移除前缀，并把其余内容作为字符串。
- 没有类型前缀的值保持为字符串；因此 `001` 不会被转换成数字。
- 标签和值两侧的空白会被去除；空行会忽略。每行都必须包含非空标签和值。

## Button 点击行为

Button 有三种动作，默认是 `none`：

| 动作 | 生成组件行为 |
| --- | --- |
| `none` | 只渲染按钮，不添加点击处理函数。 |
| `emit` | 点击时触发指定的 Vue 事件，并传出当前表单数据副本。事件名必须以字母开头，后续可包含字母、数字、冒号、下划线和连字符。 |
| `code` | 将属性面板中的代码写入生成组件的点击函数体，可使用 `formData`、`emit` 和 `event`。 |

自定义代码只会写入生成的 Vue SFC，不会在设计器预览中执行。导入校验会拒绝包含 `</script`（不区分大小写）的代码。只应生成并使用可信代码；业务请求、权限和路由通常放在宿主组件监听的事件处理函数里更容易维护。

## 控件默认值

面板新增控件时，`Input` 默认提示为“请输入”，`Select`、`RadioGroup` 和 `CheckboxGroup` 默认提供“选项一/选项二”，Button 默认使用 `type: "primary"`。其他控件的 props 默认为空对象；可在高级属性中配置。

## 相关说明

- 设计器预览按 Schema 渲染 View UI Plus 控件；它不会执行 Button 自定义代码。
- `required` 会显示必填状态，预览时还会用于生成必填校验规则。当前生成器生成 `FormItem` 的必填标记，但不会生成校验规则。
- 可配置 props 的最终含义由宿主工程实际使用的 View UI Plus 版本决定。请以该版本的组件文档为准。
