<template>
  <Form :label-width="100" style="padding:0 10% 0 0" label-colon>
    <Row>
      <Col span="12">
      <FormItem label="是否禁用">
        <i-Switch v-model="extAttribs.disabled" />
        &nbsp;<Tooltip content="disabled 设置输入框为禁用状态" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i></Tooltip>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="是否只读">
        <i-Switch v-model="extAttribs.isReadonly" />
        &nbsp;<Tooltip content="readonly 设置输入框为只读" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i></Tooltip>
      </FormItem>
      </Col>
    </Row>

    <!-- 输入框 -->
    <Row v-if="isInput()">
      <Col span="12">
      <FormItem label="最大长度">
        <Input type="text" class="more-attrib input small" v-model="extAttribs.maxlength" placeholder="最大输入长度" /> &nbsp;
        <Tooltip content="maxlength 最大输入长度" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i>
        </Tooltip>
      </FormItem>
      </Col>
      <Col span="12">
      </Col>
    </Row>

    <Row v-if="isInput()">
      <Col span="12">
      <FormItem label="清空按钮">
        <i-Switch v-model="extAttribs.clearable" />
        &nbsp;<Tooltip content="clearable 是否显示清空按钮" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i></Tooltip>
      </FormItem>
      </Col>

      <Col span="12">
      <FormItem label="显示边框">
        <i-Switch v-model="extAttribs.border" />
        &nbsp;<Tooltip content="border 是否显示边框" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i></Tooltip>
      </FormItem>
      </Col>
    </Row>

    <Row v-if="isInput()">
      <Col span="12">
      <FormItem label="头部图标">
        <IconSelector />
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="尾部图标">
        <IconSelector />
      </FormItem>
      </Col>
    </Row>

    <!-- 密码输入框 -->
    <FormItem v-if="row.uiType == 18" label="允许显示/隐藏密码">
      <Switch v-model="extAttribs.password" />
      &nbsp;<Tooltip content="开启属性 password 可以切换显示隐藏密码" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i></Tooltip>
    </FormItem>

    <!-- 多行文本 -->
    <FormItem v-if="row.uiType == 6" label="行数/高度">
      <Input type="number" class="more-attrib input small" v-model="extAttribs.rows" placeholder="文本域默认行数" />&nbsp;
      <Tooltip content="rows 文本域默认行数" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i>
      </Tooltip>
    </FormItem>

    <Row v-if="row.uiType == 6">
      <Col span="12">
      <FormItem label="字数统计">
        <Switch v-model="extAttribs.showWordLimit" />&nbsp;
        <Tooltip content="show-word-limit 是否显示输入字数统计，可以配合 maxlength 使用" placement="right" :transfer="true"><i
            class="ivu-icon ivu-icon-ios-help-circle-outline"></i></Tooltip>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="自适应内容高度">
        <Switch v-model="extAttribs.autosize" />&nbsp;
        <Tooltip content="autosize 自适应内容高度" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i>
        </Tooltip>
      </FormItem>
      </Col>
    </Row>

    <Row v-if="row.uiType == 22">
      <Col span="12">
      <FormItem label="数据字典父 id">
        <Input type="text" v-model="extAttribs.dataDictId" style="width: 80px;" />&nbsp;
        <Tooltip content="指定展示哪些数据字典，若不指定则展示全部" placement="right" :transfer="true"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i></Tooltip>
      </FormItem>
      </Col>
      <Col span="12">
      <FormItem label="保存 id 字段">
        <Input type="text" v-model="extAttribs.dataDictIdField" style="width: 80px;" />&nbsp;
        <Tooltip content="数据字典的 id 保存在哪个字段" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i>
        </Tooltip>
      </FormItem>
      </Col>
    </Row>
    <Row v-if="row.uiType == 9">
      <Col span="24">
      <FormItem label="上传地址">
        <Input type="text" placeholder="文件上传地址，必填" v-model="extAttribs.uploadUrl" style="width: 90%" />&nbsp;
        <Tooltip content="文件上传地址，必填" placement="right" :transfer="true"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i></Tooltip>
      </FormItem>
      </Col>

    </Row>

    <FormItem v-if="row.uiType == 6" label="行数/高度">
      <Input type="number" class="more-attrib input small" v-model="extAttribs.rows" placeholder="文本域默认行数" />&nbsp;
      <Tooltip content="rows 文本域默认行数" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i>
      </Tooltip>
    </FormItem>

    <FormItem v-if="row.uiType == 2" label="候选数据">
      <RadioGroup v-model="extAttribs.type">
        <Radio :label="1">
          从 API 接口获取数据 <Tooltip content="指定 URL 读取列表，title 字段外显，value 字段值。" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline"></i>
          </Tooltip>

          <div>
            <label>
              API 接口：<Input size="small" v-width="220" v-model="extAttribs.api" placeholder="" />
            </label>
          </div>
          <div>
            <label>
              外显字段：<Input size="small" v-width="80" v-model="extAttribs.keyField" placeholder="填JSON Key" />
            </label>
            <label>
              值字段：<Input size="small" v-width="80" v-model="extAttribs.valueField" placeholder="" />
            </label>
          </div>
        </Radio>
        <br />
        <Radio :label="2">
          指定数据 <Tooltip content="相当于静态数据" placement="right"><i class="ivu-icon ivu-icon-ios-help-circle-outline" />
          </Tooltip><br />
        </Radio>
      </RadioGroup>
    </FormItem>

    <!-- 单选框 -->
    <FormItem v-if="row.uiType == 3 || row.uiType == 4" label="候选数据">
      <CandidateData ref="CandidateData" />
    </FormItem>
  </Form>
</template>

<script lang="ts">
import IconSelector from "../../components/common/icon-select.vue";
import CandidateData from "./candidate-data.vue";

export default {
  components: { IconSelector, CandidateData },
  props: {
    row: {
      type: Object,
      default() {
        return { ext_attribs: {} };
      },
    },
    extAttribs: {
      type: Object,
      required: true,
      default() {
        return { ext_attribs: {} };
      },
    },
  },
  methods: {
    // edit(row: any): void {
    //   debugger
    //   if (!extAttribs)
    //     extAttribs = {};

    //   this.row = row;

    //   this.$nextTick(() => {
    //     if (row.uiType == 2 || row.uiType == 3 || row.uiType == 4) {
    //       if (!extAttribs.candidateData)
    //         extAttribs.candidateData = [];

    //       this.$refs.CandidateData.staticData = extAttribs;
    //       // console.log(this.$refs.CandidateData.staticData);
    //     }
    //   });
    // },

    /**
     * 是否输入框类型
     */
    isInput(): boolean {
      let row = this.row;
      return (
        row.uiType == 1 ||
        row.uiType == 18 ||
        row.uiType == 11 ||
        row.uiType == 6 ||
        row.uiType == 16 ||
        row.uiType == 12 ||
        row.uiType == 13
      );
    },
  },
  watch: {
    row: {
      handler(extAttribs, oldValue) {
        this.$nextTick(() => {
          if (this.row.uiType == 2 || this.row.uiType == 3 || this.row.uiType == 4) {
            if (!extAttribs.candidateData)
              extAttribs.candidateData = [];

            this.$refs.CandidateData.staticData = extAttribs.ext_attribs;
            console.log(this.$refs.CandidateData.staticData);
          }
        });
        // if (!v.ext_attribs.hasOwnProperty("placeholder")) {
        //   v.ext_attribs.placeholder = "";
        // }
      },
      deep: true, // 深度观察
    },
  },
};
</script>

<style lang="less" scoped>
.more-attrib.input {
  width: 260px;
}

.more-attrib.input.small {
  width: 100px;
}
</style>