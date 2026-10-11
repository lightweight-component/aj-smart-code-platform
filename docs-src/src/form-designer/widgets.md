---
title: Form Designer Widget Reference
description: Supported aj-form-designer widgets, dedicated settings, option values, and Button actions.
tags:
  - Form Designer
  - Widgets
layout: layouts/docs.njk
---

# Widget Configuration Reference

The designer includes widgets with explicit form semantics. Palette groups and defaults are defined in `src/registry/form-widgets.ts`. The field data structure is described in the [FormSchema Reference](/form-designer/schema/).

## Supported widgets

| Schema type | Palette name | Dedicated settings | Options |
| --- | --- | --- | --- |
| `Input` | Text input | Input type, placeholder | — |
| `InputNumber` | Number input | Advanced props | — |
| `Select` | Select | Options, advanced props | Yes |
| `RadioGroup` | Radio group | Options, advanced props | Yes |
| `CheckboxGroup` | Checkbox group | Options, advanced props | Yes |
| `DatePicker` | Date picker | Picker type, display format | — |
| `TimePicker` | Time picker | Advanced props | — |
| `Switch` | Switch | Advanced props | — |
| `Slider` | Slider | Advanced props | — |
| `Rate` | Rating | Advanced props | — |
| `ColorPicker` | Color picker | Advanced props | — |
| `Button` | Button | Action, event name, or custom JavaScript | — |

Every field has a field name, display label, and required state. The field name is the key in form data and must be unique. Advanced props must be a JSON object and are passed to the corresponding View UI Plus control. Button actions are stored separately and are not passed as component props.

## Dedicated settings

### Input

- **Input type**: `text` (default), `textarea`, or `password`.
- **Placeholder**: passed as the View UI Plus `Input` `placeholder` prop.

### DatePicker

- **Picker type**: `date` (default), `daterange`, or `datetime`.
- **Display format**: defaults to `yyyy-MM-dd` and is passed as the `format` prop.

Other DatePicker properties can be configured through advanced props. Follow the component API for the View UI Plus version used by the host application.

### Select, RadioGroup, and CheckboxGroup

Enter one option per line in `Label=value` format:

```text
Draft=draft
Number=number:12
Enabled=boolean:true
Description=string:This value can contain = signs
```

Parsing rules:

- `number:` must be followed by a finite number, such as `number:12` or `number:-0.5`.
- `boolean:` must be followed by `true` or `false`.
- `string:` is removed and the remainder is kept as a string.
- Values without a type prefix remain strings; `001` is not converted to a number.
- Whitespace around labels and values is trimmed, and blank lines are ignored. Each non-blank line must contain a non-empty label and value.

## Button actions

Buttons have three actions. The default is `none`.

| Action | Generated behavior |
| --- | --- |
| `none` | Render the Button without adding a click handler. |
| `emit` | Emit the configured Vue event with a copy of the current form data. Event names must start with a letter and may contain letters, digits, `:`, `_`, and `-`. |
| `code` | Insert the configured code into the generated component's click handler. The code can use `formData`, `emit`, and `event`. |

Custom code is included in the generated SFC and is not executed in designer Preview. Import validation rejects code containing `</script` (case-insensitive). Only generate and run trusted code. Business requests, authorization, and navigation are usually easier to maintain in the host component's event handler.

## Widget defaults

New `Input` fields use the placeholder “Please enter”. `Select`, `RadioGroup`, and `CheckboxGroup` start with two sample options. New Buttons use `type: "primary"`. Other widgets start with an empty props object and can be configured through advanced props.

## Notes

- Preview renders View UI Plus controls from the Schema, but does not execute custom Button code.
- `required` marks the form item as required and also creates a required validation rule in Preview. The current SFC generator marks the generated `FormItem` as required but does not generate the validation rule.
- The meaning of advanced props depends on the View UI Plus version used by the host application. Refer to that version's component API.
