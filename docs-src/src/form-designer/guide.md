---
title: Form Designer User Guide
description: Learn to design, preview, import, and generate View UI Plus forms with aj-form-designer.
tags:
  - Form Designer
  - Vue
layout: layouts/docs.njk
---

# aj-form-designer User Guide

`aj-form-designer` is a visual form designer for View UI Plus. It focuses on form fields, a two-column grid, form schemas, and Vue single-file component generation. It is not a general-purpose page layout editor.

For the full widget list, see the [Widget Reference](/form-designer/widgets/). For the data format, see the [FormSchema Reference](/form-designer/schema/). For generated component integration and legacy imports, see [Development and Integration](/form-designer/development/).

## 1. Start the project

From the project directory:

```bash
npm install
npm run dev
```

Open the local address printed in the terminal. The page has three main areas: the widget palette on the left, the form canvas in the middle, and the property panel on the right.

## 2. Design a form

Expand a group in the palette and drag a widget onto the canvas.

- The root canvas accepts fields and two-column rows.
- A grid column accepts fields only; rows cannot be nested.
- Fields and rows can be reordered on the canvas.
- Select a field or row to use the toolbar actions for copy, delete, undo, and redo.

Supported controls include text and numeric inputs, selection controls, date/time controls, switches, sliders, ratings, color pickers, and Buttons.

## 3. Configure the form and fields

When nothing is selected, the property panel shows form-level label position and label width.

Select a field to edit its field name, label, and required state. The field name becomes a key in the form data object and must be unique, for example `name`, `status`, or `createdAt`.

Some widgets have dedicated settings:

- `Input`: single-line, multi-line, or password input, plus a placeholder.
- `DatePicker`: date, date range, or date-time type, plus the display format.
- `Select`, `RadioGroup`, and `CheckboxGroup`: their option lists.
- All widgets: advanced JSON props passed to the View UI Plus control. Button actions are stored separately from props.

Enter one choice per line as `Label=value`:

```text
Draft=draft
Published=published
Quantity=number:12
Enabled=boolean:true
```

Values without a type prefix are strings. Use `number:` or `boolean:` to preserve numeric or Boolean values when converting between the text editor and Schema. `string:` explicitly marks a string.

## 4. Configure a Button

The generated component includes only the Buttons placed on the canvas. The designer does not add a fixed submit or reset button.

Choose one of three Button actions in the property panel:

1. **Regular Button**: keep the Button appearance and View UI Plus props, without a click handler.
2. **Emit event**: enter an event name such as `save`. The generated component emits that event with a copy of the current form data.
3. **Custom JavaScript**: enter a function body that can use `formData`, `emit`, and `event`.

For example:

```ts
if (!formData.name) {
  window.alert("Please enter a name");
  return;
}

emit("save", formData);
```

Custom JavaScript is written to the generated Vue SFC and is not executed in designer Preview. Use trusted code only. Network requests, routing, and permission checks are usually easier to maintain in the host page's event handler.

## 5. Preview the form

Click **Preview** to enter values in the current form. **Validate and view data** checks required fields and displays the form data JSON when validation succeeds.

The Preview dialog's **Reset** and **Validate and view data** buttons are designer tools; they are not included in the generated component.

## 6. Import, edit, and export Schema

Click **Schema** to view and edit the current JSON. **Import** reads a local `.json` file, and **Export Schema** downloads the current design for later editing.

The editor supports `FormSchema` version 1 and can also migrate eligible legacy designer data. Schema rules and migration details are in the [FormSchema Reference](/form-designer/schema/) and [Development and Integration](/form-designer/development/).

## 7. Generate a Vue single-file component

Click **Generate SFC** to inspect the Vue 3 component, then download it as `GeneratedForm.vue`.

The host project must register View UI Plus globally or register the components used by the generated Schema on demand. The generated `required` property marks a form item as required, but the generator does not emit the Preview validation rules or submit/reset controls. See [Development and Integration](/form-designer/development/) for integration details.

Example host event handler:

```vue
<GeneratedForm @save="saveForm" />

<script setup lang="ts">
function saveForm(formData: Record<string, unknown>): void {
  // Call an API, navigate, or perform other business logic.
}
</script>
```

## 8. Suggested workflow

Keep the Schema JSON in your business project's configuration directory and use it as the editable source. Review generated SFCs as application code. For API calls, permissions, routing, and complex behavior, prefer Button events handled by the host component over embedding large amounts of custom JavaScript.
