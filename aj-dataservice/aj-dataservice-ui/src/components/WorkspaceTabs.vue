<template>
  <Tabs :model-value="selected" :animated="false" class="tabs" type="card" @on-click="select"
    @on-tab-remove="$emit('close', $event)">
    <TabPane label="首页" name="__home__" />
    <TabPane v-for="tab in tabs" :key="tab.key" :label="tab.label" :name="tab.key" closable />
  </Tabs>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { WorkspaceTab } from "../types/dataservice";

const props = defineProps<{ tabs: WorkspaceTab[]; activeKey?: string }>();

const emit = defineEmits<{ select: [key?: string]; close: [key: string] }>();

/** 
 * 映射到 iView Tabs 的激活名称；首页使用内部固定键
 */
const selected = computed(() => props.activeKey ?? "__home__");

/**
 * 将 iView Tabs 的名称转换为可选的工作区标签键。
 *
 * @param name 被点击 Tab 的 iView 名称。
 * @returns 无返回值。
 */
function select(name: string): void {
  emit("select", name === "__home__" ? undefined : name);
}
</script>

<style scoped lang="less">
.tabs {
  height: 47px;
  overflow: hidden;
  padding: 16px 10px 0;
  border-bottom: 1px solid lightgray;
  background: white;
}

:deep(.ivu-tabs-bar) {
  margin-bottom: 0;
  border-bottom: 0;
}

:deep(.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab) {
  height: 30px;
  padding: 4px 14px;
  color: #666;
  line-height: 20px;
}

:deep(.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active) {
  color: #555;
  font-weight: 600;
}
</style>
