<template>
  <FormItem :label="item.label">
    <!--      <Row>
        <Col span="18"> -->
    <!-- 查看模式（只读） -->
    <span v-if="status === 0">
      <span v-if="item.uiType == 8" v-html="data[item.name]" class="html-content"></span>
      <!-- <span v-else-if="age<40">中年</span> -->
      <span v-else>{{ data[item.name] }}</span>
    </span>

    <!-- 可写模式 -->
    <span v-if="status !== 0">
      <Input v-if="item.uiType == 1" type="text" v-model="data[item.name]" :placeholder="item.comment"
        :readonly="item.ext_attribs && item.ext_attribs.isReadonly" />

      <Input v-if="item.uiType == 6" type="textarea" v-model="data[item.name]" :placeholder="item.comment" />

      <!-- <HtmlEditor v-if="item.uiType == 8" :v-model="data[item.name]" @on-change="data[item.name] = $event" :is-ionicons="true" style="height:360px;"></HtmlEditor> -->

      <Input v-if="item.uiType == 11" type="number" v-model="data[item.name]" :placeholder="item.comment" />
      <Input v-if="item.uiType == 18" type="password" v-model="data[item.name]" :placeholder="item.comment" />
      <Input v-if="item.uiType == 12" type="email" v-model="data[item.name]" :placeholder="item.comment" />

      <DatePicker v-if="item.uiType == 5" type="date" v-model="data[item.name]" placeholder="选择日期" style="width: 200px">
      </DatePicker>

      <Slider v-if="item.uiType == 10" v-model="data[item.name]" range />

      <span v-if="item.uiType == 7">
        <i-Switch v-model="data[item.name]" size="middle" /> &nbsp;
        <Tooltip v-if="item.comment" :content="item.comment" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline" /></Tooltip>
      </span>

      <!-- {{  item.uiType}} -->
      <Select v-if="item.uiType == 2 && item.ext_attribs.type == 1" v-model="data[item.name]">
        <Option v-for="(_item, index) in dropDownListData" :key="index" :value="_item.value">{{ _item.name }}
        </Option>
      </Select>

      <Select v-if="item.uiType == 2 && item.ext_attribs.type == 2" v-model="data[item.name]">
        <Option v-for="(_item, index) in item.ext_attribs.candidateData" :key="index" :value="_item.value">{{ _item.name
        }}
        </Option>
      </Select>

      <RadioGroup v-if="item.uiType == 3 && item.ext_attribs" v-model="data[item.name]">
        <Radio v-for="(_item, index) in item.ext_attribs.candidateData" :key="index" :label="_item.value">
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

      <span v-if="item.uiType == 21">{{ data[item.name] }}</span>

      <TreeSelect v-if="item.uiType == 22" v-model="data[item.name]" :data="DataDictData" />

      <div v-if="item.uiType == 17">
        <img :src="data[item.name]" alt="图片" style="max-width: 90%;">
      </div>

      <CheckboxGroup v-if="item.uiType == 4 && item.ext_attribs" v-model="data[item.name]">
        <Checkbox v-for="(_item, index) in item.ext_attribs.candidateData" :key="index" :label="_item.value">{{
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
import FileUpload from '../widgets/file-upload.vue';
import { requestResponse, type ApiResponse } from '../../../api/http';

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
      dropDownListData: []
    }
  },
  mounted(): void {
    if (this.item.uiType == 2) {
      const type: number = this.item?.ext_attribs.type;
      if (type === 1) {
        const { api, keyField, valueField } = this.item?.ext_attribs;

        requestResponse<any>(`${api}`).then(resp => {
          if (resp.status) {
            resp.data.forEach((item: any) => {
              item.label = item[keyField];
              item.value = item[valueField];
            });
            this.dropDownListData = resp.data;
          }
        }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
      } else if (type === 2) {
      }
    } else if (this.item.uiType == 22) {
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
    showDataDict(fieldName: string) {
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