<template>
  <Tabs :model-value="selected" :animated="false" class="tabs" type="card" @on-click="select" @on-tab-remove="$emit('close', $event)">
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
  /* 卡片 Tab 的激活项高度为 32px，需为其向下覆盖分割线保留 1px 空间。 */
  height: 49px;
  overflow: hidden;
  padding: 16px 10px 0;
  border-top: 1px solid #dcdcdc;
  background: white;
}

:deep(.ivu-tabs-bar) {
  margin-bottom: 0;
  /* 分割线必须位于 Tab bar，不能放在外层，否则激活标签无法盖住它。 */
  border-bottom: 1px solid lightgray;
}

:deep(.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab) {
  height: 31px;
  padding: 4px 14px;
  color: #666;
  line-height: 20px;
}

:deep(.ivu-tabs.ivu-tabs-card > .ivu-tabs-bar .ivu-tabs-tab-active) {
  height: 32px;
  padding-bottom: 5px;
  position: relative;
  z-index: 1;
  background: #fff;
  color: #555;
  font-weight: 600;
}
</style>
