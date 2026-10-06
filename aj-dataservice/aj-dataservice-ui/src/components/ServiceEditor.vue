<template>
  <section class="editor">
    <template v-if="endpoint">
      <div class="metadata">
        <Checkbox v-model="enabled" style="float:right" size="small">启用</Checkbox>
        <div class="method-field">
          <span class="method-field-label">请求方法</span>
          <Select v-model="endpoint.method" class="method-select" size="small">
            <Option v-for="method in httpMethods" :key="method" :value="method">{{ method }}</Option>
          </Select>
        </div>
        <div><Input v-model.trim="endpoint.url" required size="small" placeholder="必填的"><template #prepend>访问路径</template></Input></div>
        <div><Input v-model.trim="endpoint.name" required size="small" placeholder="必填的"><template #prepend>接口名称</template></Input></div>
        <div><Input v-model.trim="endpoint.content" size="small" placeholder="接口的说明"><template #prepend>说明</template></Input></div>
      </div>

      <div class="crud-editor">
        <nav class="operations" aria-label="Endpoint 列表">
          <button v-for="(item, index) in endpoints" :key="item.id ?? `new-${index}`" :class="{ selected: activeIndex === index }" type="button"
            @click="$emit('select-endpoint', index)">
            <span :class="item.method">{{ item.method }}</span> {{ item.name || item.url || '未命名端点' }}
          </button>
          <Button class="add-endpoint" icon="md-add" long type="text" @click="$emit('add-endpoint')">新增</Button>
        </nav>

        <div class="sql-area">
          <div class="url-preview">
            <span :class="endpoint.method">{{ endpoint.method }}</span>{{ endpointUrl }}
            <Button class="copy-url" icon="md-copy" size="small" title="复制完整地址" type="text" @click="copyEndpointUrl" />
          </div>
          <div class="sql-toolbar">
            <Select v-model="endpoint.actionType" size="small" style="width:180px">
              <Option v-for="item in actionTypes" :key="item.value" :value="item.value">{{ item.label }}</Option>
            </Select>
            <Checkbox v-model="customSql" class="custom-sql">自定义 SQL</Checkbox>
            <Checkbox v-if="endpoint.actionType === 'CREATE'" v-model="endpoint.isAutoIns">使用数据库自增主键</Checkbox>
          </div>
          <SqlEditor v-if="customSql" v-model="sql" class="sql-editor" height="440px" />
          <div v-else class="default-sql">
            <Input v-model.trim="endpoint.tableName" class="table-name-input" size="small" placeholder="请输入数据库表名"><template #prepend>数据库表名</template></Input>
            <Input v-if="needsIdField" v-model.trim="endpoint.idField" class="id-field-input" size="small" placeholder="默认为 id"><template
              #prepend>主键字段</template></Input>
          </div>
        </div>
      </div>
    </template>
    <div v-else class="empty-state"><Button icon="md-add" type="dashed" @click="$emit('add-endpoint')">新增 Endpoint</Button></div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Message } from "view-ui-plus";
import type { ActionType, EndpointEntity, HttpMethod } from "../types/dataservice";
import SqlEditor from "./SqlEditor.vue";

const props = defineProps<{ urlPrefix: string; endpoints: EndpointEntity[]; activeIndex: number }>();

defineEmits<{ "select-endpoint": [index: number]; "add-endpoint": []; "delete-endpoint": [] }>();

const httpMethods: HttpMethod[] = ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS", "PATCH", "TRACE", "CONNECT"];

const actionTypes: Array<{ value: ActionType; label: string }> = [
  { value: "VALUE", label: "VALUE - 单值" }, { value: "INFO", label: "INFO - 单个实体" }, { value: "LIST", label: "LIST - 列表" },
  { value: "PAGE_LIST", label: "PAGE_LIST - 分页列表" }, { value: "CREATE", label: "CREATE - 新增" },
  { value: "UPDATE", label: "UPDATE - 修改" }, { value: "DELETE", label: "DELETE - 删除" },
];

const endpoint = computed(() => props.endpoints[props.activeIndex] ?? props.endpoints[0]);

const customSql = computed({
  get: () => endpoint.value ? !endpoint.value.isAutoSql : false,
  set: (value: boolean) => {
    if (endpoint.value)
      endpoint.value.isAutoSql = !value;
  },
});

/**
 * 将后端的状态字段映射为“启用”复选框。
 *
 * `stat` 为 `1` 时表示禁用；`0` 或未设置时表示启用。
 */
const enabled = computed({
  get: () => endpoint.value?.stat !== 1,
  set: (value: boolean) => {
    if (endpoint.value)
      endpoint.value.stat = value ? 0 : 1;
  },
});

const sql = computed({
  get: () => endpoint.value?.sql ?? "",
  set: (value: string) => {
    if (endpoint.value)
      endpoint.value.sql = value;
  },
});

const needsIdField = computed(() => ["INFO", "UPDATE", "DELETE"].includes(endpoint.value?.actionType ?? ""));

const endpointUrl = computed(() => `${props.urlPrefix.replace(/\/+$/, "")}/${(endpoint.value?.url ?? "").replace(/^\/+/, "")}`);

/** 
 * 将当前 Endpoint 的完整访问地址复制到剪贴板。
 */
async function copyEndpointUrl(): Promise<void> {
  try {
    await navigator.clipboard.writeText(endpointUrl.value);
    Message.success({ content: "已复制", duration: 2 });
  } catch {
    Message.error({ content: "复制失败，请检查浏览器剪贴板权限", duration: 3 });
  }
}
</script>

<style scoped lang="less">
.editor {
  overflow: auto;
  height: 100%;
  padding: 14px 10px 20px;
}

.metadata>div {
  display: inline-block;
  margin-right: 20px;
  vertical-align: middle;
}

.metadata :deep(.ivu-input-wrapper) {
  width: 200px;
}

.method-field {
  display: inline-flex !important;
  width: 200px;
  margin-right: 20px;
  vertical-align: middle;
}

.method-field-label {
  box-sizing: border-box;
  height: 24px;
  border: 1px solid #dcdee2;
  border-right: 0;
  border-radius: 4px 0 0 4px;
  padding: 3px 7px;
  background: #f8f8f9;
  color: #515a6e;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
}

.method-select {
  min-width: 0;
  flex: 1;
}

.method-select :deep(.ivu-select-selection) {
  border-radius: 0 4px 4px 0;
}

.crud-editor {
  display: grid;
  min-width: 0;
  min-height: 540px;
  margin-top: 20px;
  grid-template-columns: minmax(140px, 16%) minmax(0, 1fr);
  overflow: hidden;
}

.operations {
  min-width: 0;
  min-height: 540px;
  border-top: 1px solid lightgray;
  border-right: 1px solid lightgray;
  border-radius: 0 5px 0 0;
  background: white;
}

.operations button {
  display: block;
  width: 100%;
  height: 35px;
  overflow: hidden;
  border: 0;
  border-bottom: 1px solid #e3e3e3;
  background: transparent;
  padding-left: 15px;
  text-align: left;
  color: #555;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.operations button.selected {
  background: #eee;
  color: #555;
}

.operations button:hover {
  background: #e3e3e3;
}

.operations span,
.url-preview span {
  font-weight: bold;
  font-size: 14px;
}

.add-endpoint {
  margin-top: 10px;
  color: #555;
  text-align: left;
}

.sql-area {
  min-width: 0;
  overflow: hidden;
  padding-left: 15px;
}

.url-preview {
  display: flex;
  align-items: center;
  margin: 0 0 14px;
  border-left: 4px solid #dcdcdc;
  padding-left: 10px;
  color: #555;
  font-family: Consolas, "Courier New", monospace;
}

.url-preview span {
  margin-right: 8px;
}

.copy-url {
  margin-left: 8px;
  color: #4d83a7;
}

.sql-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 32px;
  margin-bottom: 10px;
}

.custom-sql {
  color: #555;
  font-size: 13px;
}

.sql-editor {
  display: block;
  width: 100%;
  height: 440px;
  min-width: 0;
  overflow: hidden;
}

.sql-editor:deep(.sql-editor-shell) {
  height: 440px !important;
}

.default-sql {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 100px;
  border: 1px solid #e3e3e3;
  padding: 18px;
}

.table-name-input,
.id-field-input {
  width: 280px;
}

.empty-state {
  padding: 35px;
  text-align: center;
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
</style>
