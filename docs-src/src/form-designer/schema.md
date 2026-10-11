---
title: Form Designer FormSchema Reference
description: FormSchema v1 fields, layout rules, validation, and import behavior.
tags:
  - Form Designer
  - Schema
layout: layouts/docs.njk
---

# FormSchema Reference

The designer represents forms as versioned JSON. Only `version: 1` is currently supported. Edit the Schema in the **Schema** dialog, or export it as a JSON file and import it later. See the [Widget Reference](/form-designer/widgets/) for supported widget types and properties.

## Top-level structure

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

- `version` is fixed at `1`.
- `props.labelPosition` is `left`, `right`, or `top`; it defaults to `right`.
- `props.labelWidth` defaults to `100`. The property panel accepts values from 40 to 300.
- `items` contains root-level fields and grid rows in render order.

## Field node

```json
{
  "id": "name-node",
  "kind": "field",
  "field": "name",
  "label": "Name",
  "required": true,
  "widget": {
    "type": "Input",
    "props": {
      "placeholder": "Enter a name"
    }
  }
}
```

- `id`: node identifier. IDs must be unique across fields, rows, and columns.
- `kind`: always `field` for a field node.
- `field`: non-empty key in the form data object; field names must be unique across the form.
- `label`: display label.
- `required`: only the Boolean value `true` is treated as required.
- `widget.type`: one of the types in the [Widget Reference](/form-designer/widgets/).
- `widget.props`: props passed to the View UI Plus control; defaults to an empty object.
- `widget.options`: options for selection widgets.
- `widget.action`: action configuration for Buttons only.

When an imported field has no `id`, the normalizer generates one. A missing field name is replaced with a temporary generated name, and a missing label becomes “Unnamed field”. For readable, version-controlled Schemas, include these values explicitly.

## Options

Selection widgets use this structure in `widget.options`:

```json
[
  { "label": "Draft", "value": "draft" },
  { "label": "Quantity", "value": 12 },
  { "label": "Enabled", "value": true }
]
```

`value` may be a string, number, or Boolean. The property panel's text representation is reversible; see the [Widget Reference](/form-designer/widgets/).

## Two-column row

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

A row must contain exactly two columns. Each `span` must be greater than 0 and at most 24, and the two spans must add up to 24. A missing or invalid span is normalized to `12` before the total is checked. Each column's `fields` array accepts fields only; nested rows are not supported. New rows default to `12 + 12`.

## Button actions

The `action` property may be omitted for a regular Button; it defaults to `none`.

```json
{
  "id": "save-node",
  "kind": "field",
  "field": "save",
  "label": "Save",
  "required": false,
  "widget": {
    "type": "Button",
    "props": { "type": "primary" },
    "action": { "type": "emit", "event": "save" }
  }
}
```

- `{ "type": "none" }`: a regular Button.
- `{ "type": "emit", "event": "save" }`: generate a `save` event handler. Event names must match `^[a-zA-Z][a-zA-Z0-9:_-]*$`.
- `{ "type": "code", "code": "emit('save', formData);" }`: insert the code into a separate click handler in the generated SFC. Code cannot contain `</script` (case-insensitive).

`action` is not allowed on non-Button widgets. See the [Widget Reference](/form-designer/widgets/) for behavior and security notes.

## Complete example

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
      "label": "Name",
      "required": true,
      "widget": {
        "type": "Input",
        "props": { "placeholder": "Enter a name" }
      }
    },
    {
      "id": "status-node",
      "kind": "field",
      "field": "status",
      "label": "Status",
      "required": false,
      "widget": {
        "type": "Select",
        "props": {},
        "options": [
          { "label": "Draft", "value": "draft" },
          { "label": "Published", "value": "published" }
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
              "label": "Save",
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

## Import validation and normalization

Import checks the object structure, version, supported widget types, unique node IDs, unique field names, Button actions, and two-column layout constraints. Invalid JSON does not replace the current design. Some optional values are normalized to defaults, such as `labelPosition: "right"` and `labelWidth: 100`.

The designer can also import eligible legacy designer data. See [Development and Integration](/form-designer/development/#legacy-designer-data-migration) for conversion rules and warnings.
