<template>
  <!-- 详细配置 -->
  <Tabs style="min-height:600px" :animated="false">
    <TabPane label="表单配置">
      <Form :label-width="120" label-colon>
        <FormItem label="记录 id">{{ id }}</FormItem>
        <Row>
          <Col span="12">
          <FormItem label="数据源">
            <!-- {{cfg.dataBinding.datasourceName}}#{{cfg.dataBinding.datasourceId}} -->
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="绑定表名">
            <!--  {{cfg.dataBinding.tableName}} -->
          </FormItem>
          </Col>
          <FormItem label="Label 宽度"><Input type="number" v-model="cfg.labelWidth" :number="true" /></FormItem>
        </Row>
      </Form>
    </TabPane>

    <TabPane label="数据绑定">
      <Form :label-width="120" style="width:500px;margin:50px auto">
        <FormItem label="获取记录接口">
          <Input v-model="cfg.infoApi" />
          <div style="padding-top:10px;height: 20px; line-height: 20px;">
            <Tooltip content="适合RESTful接口，POST创建PUT更新" placement="right">
              <i class="ivu-icon ivu-icon-ios-help-circle-outline"></i>
            </Tooltip>
            <a href="javascript:void(9);" @click="copy">一键复制到下面</a>
          </div>
        </FormItem>
        <FormItem label="创建记录接口">
          <Input v-model="cfg.createApi" />
        </FormItem>
        <FormItem label="更新记录接口">
          <Input v-model="cfg.editApi" /><!-- updateApi get errors, odd -->
        </FormItem>
        <!-- <Divider size="small" v-if="cfg.isRESTful_writeApi">创建记录接口</Divider> -->
        <!--    <ApiBinding v-if="!cfg.isRESTful_writeApi" :cfg="cfg.createApi" /> -->
      </Form>
    </TabPane>

    <TabPane label="状态控制">
      <p align="center">控制字段在不同状态下是否显示，打勾表示隐藏。</p>
      <br />
      <table align="center" width="90%" class="aj-table">
        <thead>
          <tr>
            <th></th>
            <th>当查看时</th>
            <th>当新增时</th>
            <th>当修改时</th>
          </tr>
        </thead>
        <tbody v-if="cfg.fields && cfg.fields.length">
          <tr v-for="(item, key) in cfg.fields" :key="key">
            <td align="center" style="width:130px">
              {{ item.name }} {{ item.label }}
            </td>
            <td>
              <div class="checkbox_holder">
                <Checkbox size="small" />
              </div>
            </td>
            <td>
              <div class="checkbox_holder">
                <Checkbox size="small" />
              </div>
            </td>
            <td>
              <div class="checkbox_holder">
                <Checkbox size="small" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </TabPane>
  </Tabs>

</template>

<script lang="ts">
export default {
  props: {
    id: { type: Number, required: false },
    cfg: { type: Object, required: true },
    apiRoot: { type: String, required: true }, // API 选择器需要这个属性
  },
  methods: {
    copy(): void {
      this.cfg.createApi = this.cfg.infoApi;
      this.cfg.editApi = this.cfg.infoApi;

      // this.$Copy({ text });
      // this.$Message.success('已复制到剪贴板');
      this.$Notice.success({ title: '复制成功' });
    }
  }
};
</script>

<style lang="less" scope>
// 快速制作1px 表格边框，为需要设置的 table 元素加上 border 的class即可
.aj-table {
  border: 1px lightgray solid;
  border-collapse: collapse;
  border-spacing: 0;

  th {
    background-color: #efefef;
    letter-spacing: 3px;
  }

  td,
  th {
    border: 1px lightgray solid;
    line-height: 160%;
    height: 120%;
    padding: 6px;
  }

  tr {
    // .transition (background-color 400ms ease-out);

    &:nth-child(odd) {
      background: #f5f5f5;
      box-shadow: 0 1px 0 rgba(255, 255, 255, 0.8) inset;
    }

    &:hover {
      background-color: #fbf8e9;
    }
  }
}

.checkbox_holder {
  width: 12px;
  margin: 0 auto;
}
</style>