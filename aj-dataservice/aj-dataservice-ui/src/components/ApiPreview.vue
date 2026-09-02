<template>
  <section class="preview">
    <h3>API 接口</h3>
    <div v-for="item in endpoints" :key="item.label" class="endpoint">
      <span :class="['method', item.method]">{{ item.method }}</span><code>{{ item.url }}</code>
      <button type="button" title="复制地址" @click="copy(item.url)">复制</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { joinUrl } from "../config/runtime";
import type { DataServiceProject, ServiceConfig } from "../types/dataservice";

const props = defineProps<{
  project: DataServiceProject;
  service: ServiceConfig;
}>();

/** 
 * 当前构建环境下该项目的 API 根路径。
 */
const apiRoot = computed(() =>
  joinUrl(
    import.meta.env.PROD
      ? props.project.apiPrefixProd
      : props.project.apiPrefixDev,
    "common_api",
  ),
);

/** 根据服务类型和命名空间生成可展示、可复制的 API 列表。 */
const endpoints = computed(() => {
  const base: string = joinUrl(
    apiRoot.value,
    props.service.namespace || "{namespace}",
  );

  if (props.service.type === "SINGLE")
    return [
      { label: "读取", method: "GET", url: base },
      { label: "列表", method: "GET", url: `${base}/list` },
      { label: "分页", method: "GET", url: `${base}/page` },
      { label: "创建", method: "POST", url: base },
      { label: "修改", method: "PUT", url: base },
      { label: "删除", method: "DELETE", url: `${base}/{id}` },
    ];
  return [
    { label: "详情", method: "GET", url: `${base}/{id}` },
    { label: "列表", method: "GET", url: `${base}/list` },
    { label: "分页", method: "GET", url: `${base}/page` },
    { label: "新建", method: "POST", url: base },
    { label: "修改", method: "PUT", url: base },
    { label: "删除", method: "DELETE", url: `${base}/{id}` },
  ];
});

/**
 * 复制接口地址到系统剪贴板。
 *
 * @param value 要复制的完整接口 URL。
 * @returns 剪贴板写入完成后的 Promise。
 */
async function copy(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}
</script>

<style scoped lang="less">
.preview {
  margin-top: 20px;
  border-top: 1px solid #e3e3e3;
}

.preview h3 {
  width: 100px;
  margin: -9px auto 13px;
  background: white;
  color: gray;
  text-align: center;
  font-size: 14px;
  font-weight: 400;
}

.endpoint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0;
}

.method {
  min-width: 35px;
  font-size: 12px;
  font-weight: 700;
}

.GET {
  color: green;
}

.POST {
  color: burlywood;
}

.PUT {
  color: blueviolet;
}

.DELETE {
  color: red;
}

code {
  overflow: hidden;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-left: 4px solid lightgray;
  padding-left: 15px;
  color: #555;
  font-family: "Courier New", Courier, monospace;
}

button {
  border: 0;
  background: transparent;
  padding: 3px 6px;
  color: #4d83a7;
  text-decoration: underline;
}
</style>
