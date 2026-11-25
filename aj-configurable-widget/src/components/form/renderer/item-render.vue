<template>
  <FormItem :label="item.label">
    <!--      <Row>
        <Col span="18"> -->
    <!-- 查看模式（只读） -->
    <span v-if="status === 0">
      <span v-if="item.uiType == 8" v-html="data[item.name]" class="html-content"></span>
      <span v-else-if="item.uiType == 6" style="word-wrap: break-word;">{{ data[item.name] }}</span>
      <span v-else-if="item.uiType == 21">{{ formattedDate }}</span>
      <span v-else>{{ data[item.name] }}</span>
    </span>

    <!-- 可写模式 -->
    <span v-if="status !== 0">
      <Input v-if="item.uiType == 1" type="text" v-model="data[item.name]" :placeholder="item.comment"
        :readonly="item.ext_attribs && item.ext_attribs.isReadonly" />

      <Input v-if="item.uiType == 6" type="textarea" v-model="data[item.name]" :placeholder="item.comment"
        style="width:100%;" />

      <!-- <HtmlEditor v-if="item.uiType == 8" :v-model="data[item.name]" @on-change="data[item.name] = $event" :is-ionicons="true" style="height:360px;"></HtmlEditor> -->

      <Input v-if="item.uiType == 11" type="number" v-model="data[item.name]" :placeholder="item.comment" />
      <Input v-if="item.uiType == 18" type="password" v-model="data[item.name]" :placeholder="item.comment" />
      <Input v-if="item.uiType == 12" type="email" v-model="data[item.name]" :placeholder="item.comment" />

      <DatePicker v-if="item.uiType == 5" type="date" v-model="data[item.name]" placeholder="选择日期" style="width: 200px">
      </DatePicker>

      <Slider v-if="item.uiType == 10" v-model="data[item.name]" range />

      <span v-if="item.uiType == 7">
        <i-Switch v-model="data[item.name]" size="middle" /> &nbsp;
        <Tooltip v-if="item.comment" :content="item.comment" placement="right"><i
            class="ivu-icon ivu-icon-ios-help-circle-outline" /></Tooltip>
      </span>

      <Select v-if="item.uiType == 2" v-model="data[item.name]">
        <Option v-for="(_item, index) in candidateOptions" :key="index" :value="_item.value">{{ _item.name }}</Option>
      </Select>

      <RadioGroup v-if="item.uiType == 3" v-model="data[item.name]">
        <Radio v-for="(_item, index) in candidateOptions" :key="index" :label="_item.value">
          <span>{{ _item.name }}</span>
        </Radio>
      </RadioGroup>

      <RadioGroup v-if="item.uiType == 15" v-model="data[item.name]">
        <Radio label="1">
          <span>男</span>
        </Radio>
        <Radio label="2">
          <span>女</span>
        </Radio>
        <Radio label="0">
          <span>未知</span>
        </Radio>
      </RadioGroup>

      <RadioGroup v-if="item.uiType == 19" v-model="data[item.name]">
        <Radio :label="-1">
          <span>草稿</span>
        </Radio>
        <Radio :label="0">
          <span>正常</span>
        </Radio>
        <Radio :label="1">
          <span>已删除</span>
        </Radio>
        <Radio :label="2">
          <span>已禁用</span>
        </Radio>
      </RadioGroup>

      <span v-if="item.uiType == 21">{{ formattedDate }}</span>

      <TreeSelect v-if="item.uiType == 22" v-model="data[item.name]" :data="DataDictData" />

      <div v-if="item.uiType == 17">
        <img :src="data[item.name]" alt="图片" style="max-width: 90%;">
      </div>

      <CheckboxGroup v-if="item.uiType == 4" v-model="data[item.name]">
        <Checkbox v-for="(_item, index) in candidateOptions" :key="index" :label="_item.value">{{
          _item.name }}
        </Checkbox>
      </CheckboxGroup>

      <FileUpload v-if="item.uiType == 9" :upload-url="item.ext_attribs.uploadUrl" :value="data[item.name]"
        @update:model-value="handleModelUpdate($event, item.name)" />
    </span>
    <!--    </Col> <Col span="4" offset="1">
         <Button @click="handleRemove(index)">Delete</Button> 
        </Col> -->
    <!--      </Row> -->
  </FormItem>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { requestResponse, type ApiResponse } from '../../../api/http';
import FileUpload from '../widgets/file-upload.vue';
import { formatDate } from '../../common/utils';
import type { CandidateOption } from '../../../types/candidate-data';

type CandidateRow = Record<string, unknown>;

export default defineComponent({
  components: { FileUpload },
  props: {
    item: { type: Object, required: true },
    data: { type: Object, required: true },
    status: Number
  },
  data() {
    return {
      DataDictData: [],
      remoteCandidateOptions: [] as CandidateOption[]
    }
  },
  computed: {
    candidateOptions(): CandidateOption[] {
      const ext = this.item.ext_attribs;
      return Number(ext?.type) === 1 ? this.remoteCandidateOptions : (ext?.candidateData ?? []);
    },
    candidateApiConfig(): { api: string; keyField: string; valueField: string } | null {
      if (this.status === 0 || ![2, 3, 4].includes(Number(this.item.uiType))) return null;

      const ext = this.item.ext_attribs;
      if (Number(ext?.type) !== 1) return null;

      const { api, keyField, valueField } = ext;
      return api && keyField && valueField ? { api, keyField, valueField } : null;
    },
    formattedDate(): string {
      const value: any = this.data[this.item.name];
      if (value == null || value === '')
        return '';

      const date: Date = value instanceof Date ? value : new Date(value);

      return Number.isNaN(date.getTime()) ? String(value) : formatDate.call(date, 'yyyy-MM-dd hh:mm:ss');
    }
  },
  watch: {
    candidateApiConfig: {
      immediate: true,
      async handler(config, _previous, onCleanup) {
        this.remoteCandidateOptions = [];
        if (!config) return;

        const controller = new AbortController();
        const { signal } = controller;
        onCleanup(() => controller.abort());
        const { api, keyField, valueField } = config;

        try {
          const resp = await requestResponse<CandidateRow[] | { list: CandidateRow[] }>(api, { signal });
          if (signal.aborted) return;
          if (!resp.status) throw new Error(resp.message || '获取候选数据失败');

          const rows = Array.isArray(resp.data) ? resp.data : resp.data?.list;
          if (!Array.isArray(rows)) throw new Error('候选数据接口未返回列表');

          this.remoteCandidateOptions = rows.flatMap(row => {
            const name = row?.[keyField];
            const value = row?.[valueField];
            if (name == null || (typeof value !== 'string' && typeof value !== 'number')) return [];
            return [{ name: String(name), value }];
          });
        } catch (error: unknown) {
          if (!signal.aborted)
            this.$Message.error(error instanceof Error ? error.message : '获取候选数据失败');
        }
      }
    }
  },
  mounted(): void {
    if (this.item.uiType == 22) {
      const selectedId: number | undefined = this.data[this.item.name];
      const { dataDictId, dataDictIdField } = this.item?.ext_attribs;

      let url: string;

      if (selectedId)
        url = `${window.config.dsApiRoot}/data_dict/${dataDictId}?selectedId=${selectedId}`;
      else
        url = `${window.config.dsApiRoot}/data_dict/${dataDictId}`;

      requestResponse<any>(url).then(resp => {
        if (resp.status) {
          resp.data.forEach((item: any) => {
            item.title = item.name;
            item.expand = true;
          });
          this.DataDictData = resp.data;
        }
      }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
    }
  },
  methods: {
    /**
     * 打开数据字典选择器
     * @param fieldName 字段名
     */
    showDataDict(fieldName: string): void {
      const { dataDictId, dataDictIdField } = this.item?.ext_attribs;
      console.log(dataDictId);
      console.log(this.data);
      console.log(fieldName);
    },
    /**
     * 子组件触发父组件的事件，保存值。该函数可通用
     * 
     * @param e 
     * @param name 
     */
    handleModelUpdate(e: string, name: string): void {
      this.data[name] = e;
    }
  }
});
</script>