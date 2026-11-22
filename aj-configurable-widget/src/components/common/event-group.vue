<template>
  <div>
    <Divider size="small">{{ name }} <a style="color:green;" title="增加按钮" @click="add">✚</a></Divider>
    <ul :class="{ custom: true }">
      <li>
        <div class="id"><b>按钮文本</b></div>
        <div class="name"><b>点击事件</b></div>
        <div class="isChecked"><b>删除</b></div>
      </li>
      <li v-for="(item, index) in buttons" :key="index">
        <div class="text"> <input v-model="item.text" /></div>
        <div class="event"><a @click="editEvent(item)">编辑</a></div>
        <div class="action"><a title="删除按钮" @click="buttons.splice(index, 1)">⨯</a></div>
      </li>
    </ul>

    <Modal v-model="isShowEditEvent" title="编辑事件" @on-ok="saveEvent">
      <p>请直接输入 JavaScript 事件代码。事件函数说明：</p>
      <ul class="fn-help">
        <li>第一个参数为 <code>row: Entity</code>，是当前点击所在行的实体数据对象；</li>
        <li>第二个参数为 <code>index: number</code>，是当前点击所在行的索引；</li>
        <li>函数 <code>this</code> 参数为当前 table 实例</li>
      </ul>
      <code>function onClick(row: Entity, index: number): void {</code>
      <Codemirror v-model="eventCode" :extensions="extensions" :style="editorStyle" />
      <div style="clear: both"></div>
      <code>}</code>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
import { computed, ref, shallowRef } from "vue";
import { Codemirror } from "vue-codemirror";

interface EventButton {
  text: string;
  event?: string;
}

const props = defineProps<{
  name?: string;
  type: string;
  cfg: Record<string, unknown>;
}>();

const buttons = computed(() => {
  const group = props.cfg[props.type];

  return Array.isArray(group) ? group as EventButton[] : [];
});
const isShowEditEvent = ref(false);
const editingButton = shallowRef<EventButton>();
const eventCode = ref("");
const extensions = [basicSetup, javascript()];
const editorStyle = { border: "1px solid lightgray", margin: "1% 0 1% 20px", width: "93%" };

function add(): void {
  const button = { text: "请输入文本" };
  const group = props.cfg[props.type];
  
  if (Array.isArray(group))
    group.push(button);
  else
    props.cfg[props.type] = [button];
}

function editEvent(button: EventButton): void {
  editingButton.value = button;
  eventCode.value = button.event ?? "";
  isShowEditEvent.value = true;
}

function saveEvent(): void {
  const button = editingButton.value;

  if (button && buttons.value.includes(button))
    button.event = eventCode.value;

  editingButton.value = undefined;
}
</script>

<style scoped>
code {
  background-color: rgb(250, 212, 212);
  color: rgb(252, 41, 41);
  padding: 2px 5px;
  margin: 3px 0;
}

.fn-help {
  margin: 2%;
  margin-left: 5%;
}

.fn-help li {
  list-style: disc;
  margin-top: 3px;
}
</style>
