<template>
  <span>
    <FormItem label="HTTP 方法">
      <Select v-model="cfg.httpMethod" size="small" style="width: 150px; margin-right: 20px">
        <Option value="GET">GET</Option>
        <Option value="POST">POST</Option>
        <Option value="PUT">PUT</Option>
        <Option value="DELETE">DELETE</Option>
        <Option value="PATCH">PATCH</Option>
        <Option value="OPTION">OPTION</Option>
      </Select>
      <Button size="small" @click="emit('select-api')">选择 API</Button>
    </FormItem>

    <FormItem label="API 地址">
      <Input size="small" v-model="cfg.url" placeholder="http(s)://……" />
    </FormItem>

    <FormItem label="固定参数">
      <Input size="small" v-model="cfg.baseParams" placeholder="JSON 格式" />
      <br />
      <Button size="small" @click="openEditor">动态获取参数</Button>
    </FormItem>

    <Modal v-model="isEditorOpen" title="动态获取参数" width="800" @on-ok="saveEditor">
      <Codemirror v-model="beforeRequestCode" :extensions="extensions" :style="editorStyle" />
    </Modal>
  </span>
</template>

<script setup lang="ts">
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
import { ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";

interface ApiBindingConfig {
  httpMethod?: string;
  url?: string;
  baseParams?: string;
  beforeRequest?: string;
}

const props = defineProps<{ cfg: ApiBindingConfig }>();
const emit = defineEmits<{ "select-api": [] }>();
const isEditorOpen = ref(false);
const beforeRequestCode = ref("");
const editingConfig = shallowRef<ApiBindingConfig>();
const extensions = [basicSetup, javascript()];
const editorStyle = { border: "1px solid lightgray" };

function openEditor(): void {
  editingConfig.value = props.cfg;
  beforeRequestCode.value = props.cfg.beforeRequest ?? "";
  isEditorOpen.value = true;
}

function saveEditor(): void {
  if (editingConfig.value === props.cfg)
    props.cfg.beforeRequest = beforeRequestCode.value;
  
  editingConfig.value = undefined;
}
</script>
