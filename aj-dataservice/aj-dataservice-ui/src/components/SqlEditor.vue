<template>
  <Codemirror :extensions="extensions" :model-value="modelValue" :style="{ height }"
    @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import { sql } from "@codemirror/lang-sql";
import { Codemirror } from "vue-codemirror";

withDefaults(
  defineProps<{
    modelValue: string;
    height?: string;
  }>(),
  { height: "280px" },
);
defineEmits<{ "update:modelValue": [value: string] }>();

/**
 *  CodeMirror SQL 语法扩展集合。
 */
const extensions = [sql()];
</script>

<style scoped>
:deep(.cm-editor) {
  height: 100%;
  border: 1px solid #e3e3e3;
  border-radius: 0;
  background: white;
  color: black;
}

:deep(.cm-scroller) {
  overflow: auto;
  font-family: Consolas, "Courier New", monospace;
  line-height: 1.5;
}

:deep(.cm-gutters) {
  border: 0;
  background: #f8f8f8;
  color: #999;
}

:deep(.cm-activeLine),
:deep(.cm-activeLineGutter) {
  background: #eaf2ff;
}
</style>
