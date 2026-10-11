<template>
  <div>
    <!-- 搜索表单 -->
    <div style="margin:10px 0 30px;" v-if="searchFields && searchFields.length">
      <span style="float:right;margin-top:10px;">
        <Button type="primary" icon="ios-search">查询</Button>
        <Button style="margin-left:10px">重置</Button>
      </span>

      <span v-for="(item, index) in searchFields" :key="index">
        <DatePicker v-if="item.type == 'date'" type="date" class="searchFieldInput" :placeholder="item.field"
          :name="item.name" />
        <Input v-else suffix="ios-search" class="searchFieldInput" :placeholder="'请输入' + item.field + '关键字'"
          :name="item.name" />
      </span>
    </div>

    <!-- 功能按钮 -->
    <Row type="flex" align="middle" slot="title" v-if="cfg.toolbarButtons && cfg.toolbarButtons.length">
      <Col span="12">
      <Button v-for="(item, index) in cfg.toolbarButtons" :key="index" style="margin-right:10px"
        @click="btnClk(item.event)">{{ item.text }}</Button>
      <!-- <Button :disabled="true" icon="md-delete" style="margin: 0 10px">删除</Button> -->
      </Col>
      <Col span="12" style="text-align:right;">
      <Tooltip class="ivu-ml" content="刷新" placement="top">
        <Icon size="20" type="ios-refresh" @click="getData" style="cursor: pointer;" />
      </Tooltip>
      </Col>
    </Row>

    <Table :loading="list.loading" :data="list.data" :columns="col" style="margin-top:20px;">
      <template v-slot:action="{ row, index }">
        <span v-for="(item, _index) in cfg.actionButtons" :key="_index">
          <a @click="btnClk(item.event, row, index)">{{ item.text }}</a>
          <Divider v-if="_index != (cfg.actionButtons.length - 1)" type="vertical" />
        </span>
      </template>
    </Table>

    <div class="ivu-mt ivu-text-right" v-if="cfg.isPage">
      <Page :total="list.total" :current.sync="list.pageNo" show-total show-sizer :page-size="list.pageSize" />
    </div>

    <Modal v-model="isShowForm" :title="form.title" width="1100" ok-text="保存" @on-ok="formSave">
      <FromRenderer ref="FromRenderer" :cfg="form.cfg" :fields="form.fields" />
    </Modal>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import FromRenderer from '../form/renderer/form-factory-renderer.vue';
import { requestResponse, type ApiResponse } from '../../api/http';

/**
 * 列表渲染器
 * 调用器
 */
export default defineComponent({
  setup() {
    const FromRenderer = ref();

    return { FromRenderer };
  },
  components: { FromRenderer },
  props: {
    col: { type: Array, required: true },
    cfg: { type: Object, required: true },
    initTableData: { type: Array, required: true },
    searchFields: { type: Array, required: false },
    apiRoot: { type: String, required: false } // 可选的
  },
  data() {
    return {
      isShowForm: false,          // 是否显示表单窗体
      tableData: this.initTableData,
      list: {
        columns: [], // 未使用
        data: this.initTableData,
        total: 0,
        pageNo: 1,
        pageSize: 10,
        loading: false,
        search: {
          name: ''
        }
      } as TableListConfig,
      form: {
        title: '',
        cfg: {} as FormFactory_Config,
        fields: [] as FormFactory_ItemConfig[]
      }
    };
  },
  methods: {
    getData(): void {
      this.list.loading = true;
      const params: any = { pageNo: this.list.pageNo, pageSize: this.list.pageSize };

      // @ts-ignore
      if (this.list.search.name)
        // @ts-ignore
        params.where = `name LIKE '%${this.list.search.name}%'`;

      const listCfg: ListFactory_ListConfig = this.cfg as ListFactory_ListConfig;
      const r: ManagedRequest | null = prepareRequest(listCfg.dataBinding, params, this);
      this.list.data = []; // 清空数据

      if (!r) {
        this.list.loading = false;
        return;
      }

      if (r)
        requestResponse<any>(r.url, { params: r.params }).then((j: ApiResponse<any>) => {
          if (j.status) {
            this.list.data = j.data.rows;
            this.list.total = j.data.total;
          } else this.$Message.warning(j.message);

          this.list.loading = false;
        }).catch((error: unknown) => { this.list.loading = false; this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
    },

    viewEntity(row: any, rowId: number): void {
      this._openForm(row, rowId, 0);
    },
    /**
     * 创建实体
     */
    createEntity(): void {
      this.FromRenderer.data = {};
      this.FromRenderer.$forceUpdate();
      this._openForm(null, undefined, 1);
    },
    /**
     * 编辑实体
     */
    editEntity(row: any, rowId: number): void {
      this._openForm(row, rowId, 2);
    },
    /**
     * 删除
     * 
     * @param url 
     * @param text 
     */
    delEntity(url: string, text: string): void {
      this.$Modal.confirm({
        title: "确认删除",
        content: "是否删除" + text + "？",
        onOk: () => {
          requestResponse<any>(url, { method: 'DELETE' }).then((j: ApiResponse<any>) => {
            if (j && j.status) {
              this.$Message.success('删除成功');
              this.getData();
            } else
              this.$Message.error(j.message);
          }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
        },
      });
    },

    // 打开表单，这是全屏的方式
    _openCreateFormFull(formId: number, name: string): void {
      location.hash = `#/form?formId=${formId}&title=${name}`;
    },

    _openEditFormFull(formId: number, name: string, entityId: number): void {
      location.hash = `#/form?formId=${formId}&title=${name}&entityId=${entityId}`;
    },

    _openForm(row: any, rowId?: number, formMode?: number): void {
      // 加载表单配置
      // @ts-ignore
      const apiRoot: string = this.apiRoot || this.$parent.$parent.$parent.apiRoot;

      if (!apiRoot)
        alert('无法获取根目录');

      if (formMode == 0)
        this.form.title = `查看 ${row.name}`;
      else if (formMode == 1)
        this.form.title = `新建`;
      else if (formMode == 2)
        this.form.title = `编辑 ${row.name}`;

      let formCfgId: number;//  表单配置

      if (!this.cfg.bindingForm || !this.cfg.bindingForm.id) {
        alert('未绑定表单，无法打开');
        return;
      } else
        formCfgId = this.cfg.bindingForm.id;//  表单配置
      debugger

      requestResponse<any>(`${apiRoot}/common_api/widget_config/${formCfgId}`).then((j: ApiResponse<any>) => {
        if (j.status) {
          this.isShowForm = true;
          this.form.cfg = j.data.config;// 数据库记录转换到 配置对象;
          const cfg: FormFactory_Config = this.form.cfg;
          this.form.fields = cfg.fields;
          this.FromRenderer.status = formMode;

          // if (formMode == 0 || formMode == 2) {
          //     FormLoaderMethod.methods.loadInfo.call({
          //         cfg: cfg,
          //         $refs: { FromRenderer: this.$refs.FromRenderer }
          //     }, rowId);
          // }
        } else
          this.$Message.error('未有任何配置');
      }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
    },

    _delete(row: any, api: string): void {
      this.$Modal.confirm({
        title: '删除实体',
        content: `<p>确定删除 ${row.name || '记录'} #${row.id}？</p>`,
        onOk: () => {
          requestResponse<any>(`${api}/${row.id}`, { method: 'DELETE' }).then((j: ApiResponse<any>) => {
            if (j.status) {
              this.$Message.info('删除成功');
              this.getData();
            } else
              this.$Message.warning(j.message);
          }).catch((error: unknown) => { this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
        },
        okText: '删除'
      });
    },

    formSave(): void {
    },
    btnClk(js: string, entity?: object, index?: number): void {
      if (entity) {
        const fn: any = new Function('row', 'index', js);
        fn.call(this, entity, index);
      } else
        eval(js);
    }
  },
  watch: {
    'list.pageNo'(v: number): void {
      this.getData();
    }
  }
});

/**
 * 数据绑定的公用方法
 */
const API_ROOT_PREFIX: string = '{API_ROOT_PREFIX}';

/**
 * 请求前的准备
 * 
 * @param dataBinding   配置对象
 * @param params        请求参数，可选的。如果没有则创建一个 空对象
 * @param cmp           组件实例，可选的。用于 beforeRequest 函数指定 this 指针
 * @returns 请求参数
 */
function prepareRequest(dataBinding: DataBinding, params?: any, cmp?: any): ManagedRequest | null {
  if (!dataBinding) {
    alert("未有数据绑定！");
    return null;
  }

  if (!dataBinding.url) {
    alert("未有 API 地址接口");
    return null;
  }

  let url: string = dataBinding.url;

  if (url.indexOf(API_ROOT_PREFIX) != -1)
    url = dataBinding.url.replace(API_ROOT_PREFIX, window['config'].dsApiRoot);

  if (!params)
    params = {};

  if (dataBinding.baseParams)
    Object.assign(params, JSON.parse(dataBinding.baseParams));

  if (dataBinding.beforeRequest) {
    const before: Function = new Function('params', dataBinding.beforeRequest);
    // @ts-ignore
    before.call(cmp || this, params);
  }

  return { url: url, params: params };
}
</script>

<style scoped>
.searchFieldInput {
  width: 240px;
  margin: 10px 10px 0px 0;
}
</style>