<template>
  <section class="editor">
    <div class="metadata">
      <Input v-model.trim="service.namespace" required size="small" placeholder="相当于接口的 URL 目录，必填的"><template
        #prepend>命名空间</template></Input>
      <Input v-model.trim="service.name" size="small" placeholder="接口的说明"><template #prepend>说明</template></Input>
      <Input v-if="service.type === 'CRUD'" v-model.trim="service.tableName" size="small" placeholder="数据库表名"><template
        #prepend>数据库表名</template></Input>
      <Checkbox v-model="enabled" class="enabled">启用</Checkbox>
    </div>
    <details v-if="service.type === 'CRUD'" class="more-settings">
      <summary>更多设置</summary>
      <div class="more-grid">
        <label>Bean 类型<input v-model.trim="service.clzName" placeholder="Java Bean 类全称" /></label>
        <label>唯一主键字段<input v-model.trim="service.idField" placeholder="默认为 id" /></label>
        <label>创建日期字段<input v-model.trim="service.createDate" placeholder="默认为 createDate" /></label>
        <label>修改日期字段<input v-model.trim="service.updateDate" placeholder="默认为 updateDate" /></label>
        <label>创建人字段<input v-model.trim="service.createUser" /></label>
        <label>修改人字段<input v-model.trim="service.updateUser" /></label>
        <label class="wide">描述<textarea v-model.trim="service.content" rows="2" /></label>
      </div>
    </details>
    <template v-if="service.type === 'CRUD'">
      <div class="crud-editor">
        <nav class="operations">
          <button v-for="operation in operations" :key="operation.key"
            :class="{ selected: activeOperation === operation.key }" type="button"
            @click="activeOperation = operation.key">
            <span :class="operation.method">{{ operation.method }}</span> {{ operation.label }}
          </button>
        </nav>
        <div class="sql-area">
          <Checkbox v-model="isCustomSql" class="custom-sql">自定义 SQL</Checkbox>
          <SqlEditor v-if="isCustomSql" v-model="activeSql" class="sql-editor" />
          <div v-else class="default-sql">使用数据服务的默认 {{ activeOperationLabel }} 逻辑。保存时会以空 SQL 配置提交。</div>
          <div v-if="activeOperation === 'createSql' && !isCustomSql" class="operation-options"><label>主键策略 <Select
                v-model="service.idType" style="width:200px">
                <Option :value="1">自增</Option>
                <Option :value="2">雪花</Option>
                <Option :value="3">UUID</Option>
              </Select></label></div>
          <div v-if="activeOperation === 'deleteSql' && !isCustomSql" class="operation-options">
            <Checkbox v-model="softDelete">逻辑删除</Checkbox><Input v-if="softDelete" v-model.trim="service.delField"
              placeholder="删除标记字段" style="width:160px" />
          </div>
        </div>
      </div>
    </template>
    <div v-else class="single-editor">
      <SqlEditor v-model="singleSql" height="370px" />
    </div>
    <ApiPreview :project="project" :service="service" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { DataServiceProject, ServiceConfig } from "../types/dataservice";
import { EMPTY_SQL } from "../utils/service";
import ApiPreview from "./ApiPreview.vue";
import SqlEditor from "./SqlEditor.vue";

/** 
 * CRUD 服务可单独配置的 SQL 字段
 */
type SqlField = "infoSql" | "listSql" | "createSql" | "updateSql" | "deleteSql";

const props = defineProps<{
  project: DataServiceProject;
  service: ServiceConfig;
}>();

/** 
 * 左侧 CRUD SQL 操作栏的显示定义。
 */
const operations: Array<{ key: SqlField; label: string; method: string }> = [
  { key: "infoSql", label: "详情", method: "GET" },
  { key: "listSql", label: "列表", method: "GET" },
  { key: "createSql", label: "新增", method: "POST" },
  { key: "updateSql", label: "修改", method: "PUT" },
  { key: "deleteSql", label: "删除", method: "DELETE" },
];

/** 
 * 当前正在编辑的 CRUD SQL 操作。
 */
const activeOperation = ref<SqlField>("infoSql");

/** Single 服务 SQL 与组件 v-model 之间的双向映射，保证空值可编辑。 */
const singleSql = computed({
  get: () => props.service.sql ?? "",
  set: (value: string) => {
    props.service.sql = value;
  },
});

/** 当前 SQL 操作的中文名称，用于默认逻辑提示。 */
const activeOperationLabel = computed(
  () =>
    operations.find((item) => item.key === activeOperation.value)?.label ?? "",
);

/** 当前 CRUD SQL 字段与编辑器内容之间的双向映射。 */
const activeSql = computed({
  get: () =>
    props.service[activeOperation.value] === EMPTY_SQL
      ? ""
      : (props.service[activeOperation.value] ?? ""),
  set: (value: string) => {
    props.service[activeOperation.value] = value;
  },
});

/** 
 * 当前操作是否已启用自定义 SQL；关闭时写入后端约定的默认逻辑标记。
 */
const isCustomSql = computed({
  get: () =>
    Boolean(
      props.service[activeOperation.value] &&
      props.service[activeOperation.value] !== EMPTY_SQL,
    ),
  set: (value: boolean) => {
    props.service[activeOperation.value] = value ? "" : EMPTY_SQL;
  },
});

/** 
 * 将后端可能返回的 `0/1` 或布尔值统一映射为 Checkbox 状态。
 */
const enabled = computed({
  get: () => props.service.enable !== false && props.service.enable !== 0,
  set: (value: boolean) => {
    props.service.enable = value;
  },
});

/** 
 * 将逻辑删除字段的 `0/1` 或布尔值统一映射为 Checkbox 状态。
 */
const softDelete = computed({
  get: () =>
    props.service.hasIsDeleted === true || props.service.hasIsDeleted === 1,
  set: (value: boolean) => {
    props.service.hasIsDeleted = value;
  }
});
</script>

<style scoped lang="less">
.editor {
  overflow: auto;
  height: 100%;
  padding: 14px 10px 20px;
}

.metadata {
  display: flex;
  gap: 20px;
  align-items: center;
}

.metadata :deep(.ivu-input-wrapper) {
  width: 200px;
}

.metadata .enabled {
  color: #555;
  font-size: 13px;
}

.more-settings {
  margin: 20px 0 0;
  border-top: 1px solid lightgray;
  padding: 0 20px 0;
}

.more-settings summary {
  width: 120px;
  margin: -10px 0 0;
  padding: 0 8px;
  cursor: pointer;
  background: white;
  color: #555;
  font-weight: bold;
  letter-spacing: 4px;
}

.more-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(170px, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.more-grid label {
  color: #555;
  font-size: 13px;
  font-weight: 400;
}

.more-grid input,
textarea,
select {
  display: block;
  width: 100%;
  margin-top: 5px;
  border: 1px solid #dcdee2;
  border-radius: 3px;
  padding: 6px;
  color: #555;
  font: inherit;
}

.wide {
  grid-column: span 2;
}

.crud-editor {
  display: grid;
  min-height: 400px;
  margin-top: 12px;
  grid-template-columns: 16% 1fr;
  overflow: hidden;
}

.operations {
  min-height: 400px;
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
}

.operations button.selected {
  background: #eee;
  color: #555;
}

.operations button:hover {
  background: #e3e3e3;
}

.operations span {
  font-weight: bold;
  font-size: 14px;
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

.sql-area {
  padding-left: 15px;
}

.custom-sql {
  color: #555;
  font-size: 13px;
}

.sql-editor {
  display: block;
  margin-bottom: 20px;
}

.default-sql {
  margin-bottom: 20px;
  border: 1px solid #e3e3e3;
  padding: 18px;
  color: gray;
}

.operation-options {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
}

.operation-options input {
  display: inline;
  width: auto;
  margin: 0;
}

.operation-options select,
.operation-options input[placeholder] {
  display: inline-block;
  width: auto;
  margin: 0 0 0 5px;
}

.single-editor {
  min-height: 370px;
  margin-top: 20px;
}

@media (max-width: 1100px) {

  .metadata,
  .more-grid {
    grid-template-columns: repeat(2, minmax(170px, 1fr));
  }
}
</style>
