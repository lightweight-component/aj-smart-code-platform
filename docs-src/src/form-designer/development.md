---
title: Form Designer Development and Integration
description: Integrate generated forms, migrate legacy designer data, and extend aj-form-designer.
tags:
  - Form Designer
  - Vue
layout: layouts/docs.njk
---

# Development and Integration

This guide is for developers integrating generated forms into an application and maintainers extending the designer.

## Use a generated component in a Vue host

Click **Generate SFC** to inspect the generated code and download it as `GeneratedForm.vue`. The generated file uses Vue 3 `<script setup lang="ts">` and View UI Plus `Form`, `FormItem`, field widgets, and `Row/Col` components.

### Register View UI Plus

The generated file does not import or register View UI Plus. The host application must register it globally or register the components referenced by the generated Schema on demand. On-demand registration may include `Form`, `FormItem`, `Option`, `Radio`, `Checkbox`, `Row`, and `Col`, depending on which widgets the Schema uses.

Example global registration:

```ts
import { createApp } from "vue";
import ViewUIPlus from "view-ui-plus";
import "view-ui-plus/dist/styles/viewuiplus.css";
import App from "./App.vue";

createApp(App).use(ViewUIPlus).mount("#app");
```

Import the generated component like any other Vue component. For an event-action Button, listen for the configured event in the host:

```vue
<GeneratedForm @save="saveForm" />
```

The event handler receives a JSON copy of the current `formData`. The host owns API calls, routing, permissions, and business state.

### What generated code includes

The generator outputs form model bindings, widget props, selection options, and the two-column layout from the Schema. It generates only the Buttons on the canvas; it does not add submit, reset, or validation controls.

Designer Preview creates required-field validation rules. The current SFC generator only marks generated `FormItem` elements as required; it does not generate the same validation rules or submit behavior. The host application must provide those rules and actions when needed.

A Button configured with the `code` action inserts that code into the generated click handler, where it can use `formData`, `emit`, and `event`. The code is not run in designer Preview. Generate and run trusted code only; business side effects are usually better handled in the host event handler.

## Legacy designer data migration

Both local JSON import and Schema dialog import first check for the new `version: 1` schema. Otherwise, the importer tries to find a `Form` node in the legacy component tree.

The migration keeps settings that can be represented unambiguously:

- `labelPosition` and `labelWidth` from `Form` props;
- the first supported widget inside each `FormItem`;
- direct `Row` children of `Form`, with their direct `Col` children;
- supported widget types, widget props, labels, required state, and field names.

See the [Widget Reference](/form-designer/widgets/) for supported fields. Unknown or unsafe-to-convert nodes are skipped with warnings. A legacy row with more than two columns keeps only the first two; a one-column row gets an empty second column; a row with no `Col` is skipped. Import fails without replacing the current design if no fields can be migrated.

Field names are chosen from `FormItem.props.prop`, then widget `props.name`, then the widget type. Names are normalized to letters, digits, underscore, and `$`; duplicates receive a numeric suffix. A Button label comes from the legacy node text, or defaults to “Submit”.

## Source layout

| Path | Responsibility |
| --- | --- |
| `src/core/form-schema.ts` | Schema types, node creation, import normalization, and structural validation. |
| `src/core/form-options.ts` | Conversion between option-editor text and structured options. |
| `src/core/form-data.ts` | Flattening field lists and synchronizing preview form data. |
| `src/core/legacy-migration.ts` | Migration from the legacy generic component tree. |
| `src/core/vue-sfc-generator.ts` | Vue single-file component generation. |
| `src/registry/form-widgets.ts` | Palette groups, icons, default props, and sample options. |
| `src/stores/designer.ts` | Pinia editor state, selection, copy/delete, and undo/redo history. |
| `src/components/designer/` | Designer UI, palette, canvas, property panel, and preview. |
| `src/demo/form-schema.ts` | Schema loaded when the app starts. |

## Basic steps to add a widget

1. Add the type to `FieldType` in `src/core/form-schema.ts` and update Schema type validation.
2. Add a palette definition, default props, and options if needed in `src/registry/form-widgets.ts`.
3. Add preview rendering to `FormFieldNode.vue`. If the widget changes the container structure, define its drag-and-drop rules too.
4. Add dedicated property controls and read/write logic in `PropertyPanel.vue` if the widget needs them. Update the option parser conditions if reusing option editing.
5. Add the generated template to `vue-sfc-generator.ts` and keep props, `v-model`, and options consistent with Preview.
6. Extend Schema validation and migration as needed. Add tests for normalization, Preview, migration, and generation.

If a widget type already exists and only needs another View UI Plus prop, the advanced JSON property editor may be sufficient without changing the palette registry.

## Local development and validation

Run these commands from the `aj-form-designer` directory:

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
```

`npm run dev` starts the Vite development server. `typecheck` runs `vue-tsc --noEmit`; `test` runs Vitest; `build` performs type checking before creating the production build.

## Troubleshooting

- **Duplicate field name on import**: Field names are keys in the form data object. Rename duplicates before importing.
- **Unsupported widget type**: `widget.type` must be listed in the [Widget Reference](/form-designer/widgets/).
- **Invalid grid row**: Check that `columns` contains exactly two items, each normalized span is between 1 and 24, and the spans total 24. Columns accept fields only.
- **Invalid option text**: Use `Label=value` on each line. Prefix numeric and Boolean values with `number:` and `boolean:`.
- **Advanced props have no effect**: Advanced props must be a JSON object and must match the API of the View UI Plus version in the host project.
- **Unknown component in generated SFC**: Register the View UI Plus components referenced by the generated file, globally or on demand.
- **Some legacy content is missing**: The importer only converts supported form structures. Review its warning; display-only nodes that cannot be converted are skipped.
