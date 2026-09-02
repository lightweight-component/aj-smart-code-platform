<template>
  <Modal :model-value="open" :title="(model.id ? '编辑' : '新建') + '项目'" :mask-closable="false" ok-text="保存" width="600"
    @on-cancel="$emit('close')" @on-ok="submit" @update:model-value="visibleChanged">
    <Form :label-width="180" class="project-form">
      <FormItem label="项目名称" required><Input v-model.trim="draft.name" autofocus placeholder="项目名称" /></FormItem>
      <FormItem label="项目简介"><Input v-model.trim="draft.content" :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="项目简介，可选的" type="textarea" /></FormItem>
      <FormItem label="API 前缀-开发阶段" required><Input v-model.trim="draft.apiPrefixDev" placeholder="以 http(s)...开头" />
      </FormItem>
      <FormItem label="API 前缀-生产环境" required><Input v-model.trim="draft.apiPrefixProd" placeholder="以 http(s)...开头" />
      </FormItem>
    </Form>
  </Modal>
</template>

<script setup lang="ts">
import { reactive, watch } from "vue";
import type { DataServiceProject } from "../types/dataservice";

const props = defineProps<{ open: boolean; model: DataServiceProject }>();
const emit = defineEmits<{ close: []; save: [project: DataServiceProject] }>();

/** 
 * 弹窗内部表单副本，只有提交时才向父组件回传。 
 */
const draft = reactive<DataServiceProject>(emptyProject());

watch(
  () => [props.open, props.model] as const,
  () => Object.assign(draft, emptyProject(), props.model),
  { immediate: true },
);

/**
 * 初始化项目弹窗的默认表单值。
 *
 * @returns 空项目表单模型。
 */
function emptyProject(): DataServiceProject {
  return { name: "", content: "", apiPrefixDev: "", apiPrefixProd: "" };
}

/**
 * 校验必填字段后向父组件提交项目表单。
 *
 * @returns 无返回值；缺少必填值时保持弹窗打开。
 */
function submit(): void {
  if (!draft.name || !draft.apiPrefixDev || !draft.apiPrefixProd)
    return;

  emit("save", { ...draft });
}

/**
 * 将 iView Modal 的关闭动作同步为组件的 `close` 事件。
 *
 * @param visible Modal 当前可见状态。
 * @returns 无返回值。
 */
function visibleChanged(visible: boolean): void {
  if (!visible)
    emit("close");
}
</script>

<style scoped lang="less">
.project-form {
  margin-right: 100px;
}
</style>
