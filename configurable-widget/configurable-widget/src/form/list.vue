<template>
  <div>
    <FastViewTable widget-name="表单定义" :list-api-url="initApi" :api-url="apiPrefix + '/common_api/widget_config/'" :columns-def="list.columns">
      <template v-slot:list_action="item">
        <a @click="openDemo(item.item)">预览</a>
        <Divider type="vertical" />
      </template>
    </FastViewTable>

    <Modal v-model="perview.isShow" title="预览" width="1200" ok-text="关闭" cancel-text="">
      <FormLoader ref="preview" :api-prefix="apiPrefix" />
    </Modal>
  </div>
</template>

<script lang="ts">
import UI from "@ajaxjs/ui";
import FormLoader from "./form-loader.vue";
import { Utils } from "@ajaxjs/util";

const FastViewTable = UI.FastViewTable;

/**
 * 管理界面列表
 */
export default {
  components: { FastViewTable, FormLoader },
  props: {
    apiPrefix: { type: String, required: true }, // API 前缀
    initApi: { type: String, required: true },
  },
  data() {
    return {
      perview: { isShow: false, title: "", data: {} },
      // @ts-ignore
      // API: `${window.config.dsApiRoot}/common_api/widget_config/page?q_type=FORM_DEF`,
      list: {
        columns: [
          UI.List.id,
          {
            title: "列表名称",
            key: "name",
            minWidth: 130,
            ellipsis: true,
            tooltip: true,
          },
          {
            title: "关联数据库",
            render(h: Function, params: any) {
              if (params.row.datasourceName)
                return h(
                  "span",
                  params.row.datasourceName + "/" + params.row.tableName
                );
              else return h("span", params.row.tableName);
            },
            width: 280,
            ellipsis: true,
          },
          {
            title: "修改日期",
            width: 160,
            align: "center",
            render(h: Function, params: any) {
              return h(
                "div",
                Utils.dateFormat.call(
                  new Date(params.row.updateDate),
                  "yyyy-MM-dd hh:mm"
                )
              );
            },
          },
          UI.List.createDate,
          UI.List.status,
          { title: "操作", slot: "action", align: "center", width: 260 },
        ],
      },
    };
  },

  methods: {
    /**
     * 预览
     *
     * @param id
     */
    openDemo(item: any): void {
      this.$refs.preview.formId = item.id;
      this.$refs.preview.load();
      this.perview.isShow = true;
    },
    onCreate(): void {
      this.$router.push({
        path: "form-info",
        query: { apiPrefix: this.apiPrefix },
      }); // 进入详情页
    },
    /**
     * 编辑
     */
    onEdit(id: number): void {
      this.$router.push({
        path: "form-info",
        query: { id, apiPrefix: this.apiPrefix },
      }); // 进入详情页，采用相对路径
    },
  },
};
</script>