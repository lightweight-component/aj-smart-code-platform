---
title: AJ Form Designer
description: Visually design View UI Plus forms with aj-form-designer and export a stable FormSchema or Vue SFC.
tags:
  - Form Designer
  - Vue
layout: layouts/docs.njk
---

# AJ Form Designer

`aj-form-designer` is a Vue 3 visual designer for View UI Plus forms. It focuses on explicit form fields, a two-column grid, and a data schema rather than trying to design every page layout or View UI Plus component.

## Workflow

1. Drag fields or a two-column row from the palette onto the canvas.
2. Configure field names, labels, required state, and widget properties in the property panel.
3. Use Preview to fill out the form and check required fields.
4. Export the `FormSchema` JSON for later editing, or generate a Vue single-file component for your application.

## Documentation

- [User Guide](/form-designer/guide/)
- [Widget Reference](/form-designer/widgets/)
- [FormSchema Reference](/form-designer/schema/)
- [Development and Integration](/form-designer/development/)

## Quick Start

From the repository root, run:

```bash
cd aj-form-designer
npm install
npm run dev
```

Open the local address printed in the terminal. See [Development and Integration](/form-designer/development/#local-development-and-validation) for type checking, tests, and production builds.

## Scope

The designer supports text, numeric, selection, date/time, switch, slider, rating, color, and Button controls. The root canvas accepts fields and two-column rows; columns accept fields only. The current schema version is `1`.

Generated Vue SFCs assume that the host application has registered View UI Plus. The generator does not add submit/reset controls or validation rules. For business behavior, handle Button events in the host page. See [Development and Integration](/form-designer/development/).
