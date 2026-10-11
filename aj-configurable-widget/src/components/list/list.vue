<template>
  <div>
    <FastiViewTable widget-name="列表定义" :list-api-url="getListApiUrl()" :api-url="getApiUrl()" :columns-def="list.columns" @create="onCreate" @edit="onEdit">
      <template v-slot:list_action="item">
        <a @click="openDemo(item.item)">预览</a>
        <Divider type="vertical" />
      </template>

      <!-- <template v-slot:toolbar>
        <div style="float:left;margin-right:10px;">
          <h2>Scoped slot with props</h2>
          <a>管理项目</a>
        </div>
      </template> -->
    </FastiViewTable>

    <Modal v-model="perview.isShow" title="预览" width="1300" ok-text="关闭" cancel-text="">
      <ListLoader ref="listDefDemo" />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { runtimeConfig } from '../../config/runtime';
import { dateFormat } from '../common/utils';
import List from '../common/common-ui';
import FastiViewTable from "../common/FastiViewTable.vue";
import ListLoader from "./list-loader.vue";

/**
 * LIST 管理界面列表
 */
export default defineComponent({
  setup() {
    const listDefDemo = ref();

    return { listDefDemo };
  },
  components: { FastiViewTable, ListLoader },
  data() {
    return {
      perview: { isShow: false, title: "", data: {} },
      list: {
        columns: [
          List.id,
          {
            title: "列表名称",
            key: "name",
            minWidth: 130,
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "关联表单",
            render(h: Function, params: any): string {
              return params.row.config.bindingFormName;
            },
            width: 180,
            ellipsis: true,
          },
          {
            title: "接口地址",
            minWidth: 250,
            render: (h: Function, params: any) => params.row.config.dataBinding.url,
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "修改日期",
            width: 160,
            align: "center",
            render: (h: Function, params: any) => dateFormat(params.row.updateDate),
          },
          List.createDate,
          List.status,
          { title: "操作", slot: "action", align: "center", width: 260 },
        ],
      },
    };
  },
  methods: {
    getListApiUrl(): string {
      return runtimeConfig.adminApiRoot + '/common_api/ds_widget_config/page_no?q_type=LIST';
    },

    getApiUrl(): string {
      return window.config.dsApiRoot + '/common_api/ds_widget_config';
    },
    /**
     * 预览
     */
    openDemo(item: any): void {
      this.listDefDemo.colDefId = item.id;
      this.perview.isShow = true;
    },
    /**
     * 进入详情页
     */
    onCreate(): void {
      this.$router.push({ path: "/list-info" });
    },
    /**
     * 编辑
     */
    onEdit(id: number): void {
      this.$router.push({ path: "/list-info", query: { id } });
    }
  },
});
</script>