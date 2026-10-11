<template>
  <ConfigTable ref="configTable" class="list-factory" below-perview>
    <template v-slot:table-header>
      <div class="input-width">渲染器</div>
      <div class="align">对齐方式</div>
      <div class="number-width">最小列宽</div>
      <div class="number-width">列宽</div>
      <div class="number-width">最大列宽</div>
      <div class="checkbox-width">不换行</div>
      <!--       <div class="checkbox-width">可搜索</div> -->
      <div class="checkbox-width">可排序</div>
      <div class="checkbox-width">下拉筛选</div>
    </template>

    <template v-slot:table-fields="scope">
      <div class="input-width"><Input type="text" size="small" v-model="scope.item.key" /></div>
      <div class="input-width"><Input type="text" size="small" v-model="scope.item.title" /></div>

      <div class="input-width">
        <Select size="small" v-model="scope.item.render" transfer>
          <Option value="raw">原文输出</Option>
          <Option value="link">链接</Option>
          <Option value="link_http">显示地址的链接</Option>
          <Option value="email">电子邮件</Option>
          <Option value="thumb">缩略图</Option>
          <Option value="date">日期（不含时间）</Option>
          <Option value="long_date">长日期</Option>
          <Option value="short_date">短日期</Option>
          <Option value="sex">性别</Option>
          <Option value="stat">实体状态</Option>
          <Option value="boolean_value">是否属性</Option>
          <Option value="price">价格</Option>
          <Option value="render">自定义渲染函数</Option>
          <Option value="clk_event">自定义点击事件</Option>
        </Select>
      </div>

      <div class="align">
        <Select size="small" v-model="scope.item.align" transfer>
          <Option value="left">居左</Option>
          <Option value="center">居中</Option>
          <Option value="right">居右</Option>
        </Select>
      </div>

      <div class="number-width">
        <Input type="number" size="small" v-model="scope.item.minWidth" style="margin:0 auto" />
      </div>
      <div class="number-width">
        <Input type="number" size="small" v-model="scope.item.width" />
      </div>
      <div class="number-width">
        <Input type="number" size="small" v-model="scope.item.maxWidth" />
      </div>

      <div class="checkbox-width">
        <Checkbox v-model="scope.item.isOneLine" />
      </div>
      <!--       <div class="checkbox-width">
        <Checkbox v-model="scope.item.canSearch" />
      </div> -->
      <div class="checkbox-width">
        <Checkbox v-model="scope.item.sortable" />
      </div>
      <div class="checkbox-width">
        <Checkbox v-model="scope.item.canDropdownFilter" />
      </div>
    </template>

    <!--     <Modal v-model="isShowFormDesigner" width="1300" title="表单设计器">
      <FormDesigner :init-config-data="formConfigData()"></FormDesigner>
    </Modal> -->

    <template v-slot:config-panel>
      <!-- 详细配置 -->
      <Form :label-width="120" label-colon>
        <!--         <FormItem label="记录 id">{{$parent.id}}</FormItem>
          <Row>
            <Col span="12">
            <FormItem label="数据源">
              {{parent.datasourceName}}#{{parent.datasourceId}}
            </FormItem>
            </Col>
            <Col span="12"> 
            <FormItem label="绑定表名">
              {{parent.tableName}}
            </FormItem>
            </Col>
          </Row> -->

        <FormItem label="绑定的表单">{{ getFormConfig() }}
          <Button size="small" @click="isShowListModal = true">选择表单</Button>
        </FormItem>

        <FormItem label="分页参数">
          <RadioGroup v-model="cfg.page">
            <Radio :label="0">不分页</Radio><i class="ivu-icon ivu-icon-ios-help-circle-outline" title="不分页则一次性查询所有数据，适合数据量较少的列表" />&nbsp;
            <Radio :label="1">start/limit</Radio>
            <Radio :label="2">pageNo/pageSize</Radio>
          </RadioGroup>
        </FormItem>

        <fieldset class="hr">
          <legend>API 接口</legend>
        </fieldset>

        <FormItem label="API 接口">
          <Input v-model="cfg.dataBinding.url" placeholder="API 接口，{project_prefix} 表示项目前缀" style="width:70%" />
        </FormItem>

        <!-- 选择哪张表单绑定 -->
        <Modal v-model="isShowListModal" title="选择表单" ok-text="关闭" cancel-text="" width="800">
          <FastiViewTable :pickup="true" ref="SelectForm" widget-name="表单配置" :list-api-url="formListApi" @on-select="onFormSelected($event)"
            :columns-def="formSelectorCols" />
        </Modal>

        <!-- <FormLoader ref="FormPerviewLoader" /> -->
      </Form>
    </template>

    <template v-slot:live-perview>
      <ListLoader ref="LivePerview" :show-search="false" :modal-info="false" />
    </template>

    <Modal v-model="isShowPerview" title="预览" width="1200" ok-text="关闭" cancel-text="">
      <ListLoader ref="preview" />
    </Modal>

    <template v-slot:more-attrib="scope">
      <MoreAttrib :row="scope.row" />
    </template>
  </ConfigTable>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { cellRender } from './list-loader.vue';
import ListRenderer from './list-factory-renderer.vue';
import MoreAttrib from './list-more-attrib.vue';
import FormLoader from "../form/form-loader.vue";
import ConfigTable from '../common/config-table.vue';
import InfoMixins from '../common/info-common.js';
import ListLoader from "./list-loader.vue";
import FastiViewTable from "../common/FastiViewTable.vue";

/**
 * 内页
 */
export default defineComponent({
  setup() {
    const configTable = ref();
    return { configTable };
  },
  components: { ListRenderer, ConfigTable, MoreAttrib, FastiViewTable, ListLoader, FormLoader },
  mixins: [InfoMixins],
  data() {
    let self: any = this;

    return {
      widgetType: 'LIST',
      initTableData: [], // 预览用的表格数据
      rendererColDef: [] as iViewTableColumn[], // 渲染器的列定义
      selectedTable: {} as SelectedTable,
      searchFields: [],
      isShowListModal: false,
      formListApi: `${window.config.dsApiRoot}/common_api/ds_widget_config/page_no?q_type=FORM`,
      // cfg: {
      //     isPage: true,
      //     page: 2,
      //     dataBinding: {
      //         httpMethod: 'GET',
      //         url: "",
      //         beforeRequest: '',
      //         baseParams: ''
      //     },
      //     fields: [], // 列配置
      //     toolbarButtons: [],
      //     actionButtons: [],
      //     bindingForm: { id: 0, name: '' }
      // } as ListFactory_ListConfig,

      cfg: {
        dataBinding: {},
        page: 1
      } as ListFactory_ListConfig_New,

      formSelectorCols: [
        { key: "id", title: "#", width: 60 },
        { key: "name", title: "名称", minWidth: 80 },
        { key: "tableName", title: "表名", minWidth: 70 },
        {
          key: "apiUrl",
          title: "接口地址",
          minWidth: 260,
          ellipsis: true,
          tooltip: true,
        },
        {

          title: "选择",
          minWidth: 50,
          slot: 'action'
        },
        // {
        //     title: "预览",
        //     width: 70,
        //     render(h: Function, params: any) {
        //         return h("a", {
        //             on: {
        //                 click: (event: Event) => {
        //                     let FormPerviewLoader = self.$refs.FormPerviewLoader;
        //                     // @ts-ignore
        //                     FormPerviewLoader.cfg = FormFactoryMethod.methods.copyValue({}, params.row); // 数据库记录转换到 配置对象;
        //                     FormPerviewLoader.isShow = true;
        //                 },
        //             },
        //         }, "预览");
        //     },
        // },
      ],
    }
  },

  methods: {
    /**
     * 获取单个数据
     */
    getData(): void {
      this.getDataBase((r: any) => {
        this.configTable.fields = this.cfg.fields;
      });
    },
    /**
     * 新增
     */
    addRow(): void {
      let row: TableColumn = { isShow: true, title: '', align: 'center', key: '', render: 'raw' };
      this.addRow_(row);
    },
    /**
     * 保存新增
     */
    saveAddRow(): void {
      this.saveAddRow_('key', 'title');
    },
    // @override
    emptyData(): void {
      this.name = '';
      this.cfg = { page: 1, fields: [] };
      this.configTable.fields = [];
    },
    /**
     * 数据库字段转换为表格列配置
     */
    fieldsToCfg(selected: SelectedTable): void {
      this.selectedTable = selected;
      const listCfg: ListFactory_ListConfig_New = this.cfg;

      if (selected && selected.fields && selected.fields.length) {
        listCfg.fields = [];
        this.datasourceId = selected.datasourceId;
        this.tableName = selected.tableName;
        if (selected.datasourceName)
          this.datasourceName = selected.datasourceName;

        selected.fields.forEach((item: CheckableDataBaseColumnMeta) => fields2Cfg(item, listCfg.fields));
        this.configTable.fields = listCfg.fields;

        if (selected.comment)
          this.name = selected.comment;
      } else
        this.$Message.warning('未选择任何字段');
    },
    /**
     * 转换为 Table 的配置
     */
    doRenderer(): void {
      this.isShowPerview = true;
      this.rendererColDef = [];

      if (this.initTableData.length)
        this.initTableData = [];

      let listCfg: ListFactory_ListConfig_New = this.cfg;
      let fields: TableColumn[] = listCfg.fields;

      fields.forEach((item: TableColumn) => { // 转换为 iView 的配置
        if (item.isShow) {
          let rendererColDef: iViewTableColumn = { title: item.title, key: item.key, width: item.width, minWidth: item.minWidth, align: item.align };
          cellRender(rendererColDef, item);
          this.rendererColDef.push(rendererColDef);
        }
      });

      this.$refs.renderer.list.pageNo = 1; // 复位分页
      this.$refs.renderer.getData(); // 手动加载数据
    },
    /**
     * 显示表单配置
     */
    getFormConfig(): string {
      let cfg: ListFactory_ListConfig_New = this.cfg;

      if (cfg && cfg.bindingFormId)
        return '#' + (cfg.bindingFormId || "") + " " + (cfg.bindingFormName || '');
      else
        return "未绑定";
    },
    /**
     * 选中表单配置之后
     */
    onFormSelected({ id, name }): void {
      // this.$refs.SelectForm.isShowListModal = false;
      this.isShowListModal = false;

      let cfg: ListFactory_ListConfig_New = this.cfg;
      cfg.bindingFormId = id;
      cfg.bindingFormName = name;

      this.$forceUpdate();
    },
    syncData(newValue: any): void {
      if (newValue)
        this.cfg.fields = newValue;
    }
  }
});

/**
 * 智能识别
 * 针对不同的字段类型，决定不同的列配置
 * 都是一些常见的、约定成俗的配置
 * 
 * @param item 来自数据库的元数据
 * @param tableColumnData 最后 item 加入到这数组中
 */
function fields2Cfg(item: CheckableDataBaseColumnMeta, tableColumnData: TableColumn[]): void {
  let col: TableColumn = {
    isShow: true,
    key: toCamelCase(item.name), // 下划线转驼峰
    title: item.comment || item.name,
    align: 'center'
  };

  let type: string = item.type.toLowerCase();
  console.log('----------------', type);

  if (type.indexOf('text') != -1) {
    col.minWidth = 180;
    col.isOneLine = true;
  }

  if (type.indexOf('datetime') != -1)
    col.render = 'short_date';

  let name: string = item.name.toLowerCase();

  if (name.indexOf('email') != -1)
    col.render = 'email';

  if (name.indexOf('url') != -1)
    col.render = 'link';

  if (name.indexOf('thumb') != -1 || name.indexOf('avatar') != -1)
    col.render = 'thumb';

  // 名称
  switch (name) {
    case 'id':
      col.title = '#id';
      col.width = 60;
      break;
    case 'name':
      col.title = '名称';
      col.minWidth = 120;
      col.isOneLine = true;
      break;
    case 'content':
    case 'desc':
      col.title = '简介';
      col.minWidth = 180;
      col.isOneLine = true;
      break;
    case 'stat':
      col.title = '状态';
      col.width = 100;
      break;
    case 'createDate':
    case 'created_at':
      col.title = '创建日期';
      col.width = 160;
      break;
    case 'updateDate':
    case 'updated_at':
      col.title = '修改日期';
      col.width = 160;
  }

  tableColumnData.push(col);
}

/**
 * 从驼峰转换为下划线
 * @param str 
 */
function toCamelCase(str: string): string {
  return str.toLowerCase().replace(/_+([a-z0-9])/g, (_, char) => char.toUpperCase());
}
</script>

<style lang="less" scoped>
fieldset.hr {
  border: none;
  width: 90%;
  margin: 0 auto;
  border-top: 1px solid lightgray;

  legend {
    text-align: center;
    padding: 10px;
  }
}

fieldset.panel {
  margin-top: 20px;
  border: 1px solid lightgray;
  padding: 10px 20px;

  legend {
    text-align: center;
    letter-spacing: 5px;
  }
}

.list-factory {
  margin: 10px auto;

  .center input {
    text-align: center;
  }
}

li {
  .render {
    width: 120px;
  }

  .align {
    width: 90px;
  }
}

ul.custom {
  width: 380px;
  max-height: 400px;
  // margin: 30px 0;
  border: 1px solid lightgray;
  overflow-x: auto;

  li {
    list-style: none;
    padding: 3px;

    &:hover {
      color: black;

      .isChecked {
        a {
          display: inline;
        }
      }
    }

    &>div {
      display: inline-block;
      width: 33%;
      text-align: center;

      input {
        border: none;
        text-align: center;
        width: 90%;
        background-color: transparent;
        outline: none;
      }
    }

    &:nth-child(odd) {
      background-color: #f0f0f0;
    }

    .action a {
      // display: none;
      color: red;
    }
  }

  &.disabled {
    filter: grayscale(1) opacity(0.4);
  }
}
</style>