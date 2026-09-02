<template>
  <li v-if="matches || hasMatchingChild" class="service-item">
    <div class="service-row" @click="$emit('open', node)">
      <span :class="['kind', node.service.type === 'SINGLE' ? 'single' : 'crud']">{{ node.service.type === 'SINGLE' ?
        'S' : 'C' }}</span>
      <span :title="node.service.namespace">{{ node.service.name || node.service.namespace }}</span>
    </div>
    <ul v-if="node.children.length">
      <ServiceTreeItem v-for="child in node.children" :key="child.key" :node="child" :keyword="keyword"
        @open="$emit('open', $event)" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ServiceTreeNode } from "../types/dataservice";

const props = defineProps<{ node: ServiceTreeNode; keyword: string }>();

defineEmits<{ open: [node: ServiceTreeNode] }>();

/** 
 * 当前服务自身是否命中搜索词。
 */
const matches = computed(
  () => !props.keyword ||
    `${props.node.service.name ?? ""} ${props.node.service.namespace}`.toLowerCase().includes(props.keyword.trim().toLowerCase()),
);

/** 
 * 当前服务的直接子节点是否命中搜索词，用于保留父级导航路径。
 */
const hasMatchingChild = computed(() =>
  props.node.children.some((child) =>
    `${child.service.name ?? ""} ${child.service.namespace}`
      .toLowerCase()
      .includes(props.keyword.trim().toLowerCase()),
  ),
);
</script>

<style scoped lang="less">
ul {
  margin: 0;
  padding-left: 16px;
  list-style: none;
}

.service-row {
  display: flex;
  gap: 6px;
  min-height: 29px;
  align-items: center;
  padding: 0 7px;
  color: #555;
  cursor: pointer;
}

.service-row:hover {
  background: #e5f1f7;
}

.kind {
  display: inline-grid;
  width: 16px;
  height: 16px;
  place-content: center;
  border: 1px solid;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 700;
}

.crud {
  border-color: green;
  color: green;
}

.single {
  border-color: #b12fbc;
  color: #b12fbc;
}
</style>
