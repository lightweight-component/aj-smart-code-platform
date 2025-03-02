import ListRenderer from './renderer/list-factory-renderer.vue';
import Fields2Cfg from './renderer/fields-to-cfg';
import CellRender from './renderer/list-cell-render';
import MoreAttrib from './list-more-attrib.vue';
import { FastViewTable as FormListSelector } from "@ajaxjs/ui";
import FormLoader from "../form/form-loader.vue";
import ConfigTable from '../common/config-table.vue';
import InfoMixins from '../common/info-common';
import ListLoader from "./list-loader.vue";

/**
 * 内页
 */
export default {
    components: { ListRenderer, ConfigTable, MoreAttrib, FormListSelector, ListLoader, FormLoader },
    mixins: [InfoMixins],
    data(): {} {
        let self: any = this;

        return {
            widgetType: 'LIST_DEF',
            initTableData: [], // 预览用的表格数据
            rendererColDef: [] as iViewTableColumn[], // 渲染器的列定义
            selectedTable: {} as SelectedTable,
            searchFields: [],
            isShowListModal: false,
            formListApi: `${this.$route.query.apiPrefix}/common_api/widget_config/page?q_type=FORM_DEF`,
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
            this.getDataBase(() => this.$refs.configTable.fields = this.cfg.colConfig);
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
            this.cfg = { page: 1, colConfig: [] };
            this.$refs.configTable.fields = [];
        },

        /**
         * 数据库字段转换为表格列配置
         */
        fieldsToCfg(selected: SelectedTable): void {
            this.selectedTable = selected;
            let listCfg: ListFactory_ListConfig = this.cfg;

            if (selected && selected.fields && selected.fields.length) {
                listCfg.fields = [];
                this.datasourceId = selected.datasourceId;
                this.datasourceName = selected.datasourceName;
                this.tableName = selected.tableName;

                selected.fields.forEach((item: CheckableDataBaseColumnMeta) => Fields2Cfg(item, listCfg.fields));
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
            let fields: TableColumn[] = listCfg.colConfig;

            fields.forEach((item: TableColumn) => { // 转换为 iView 的配置
                if (item.isShow) {
                    let rendererColDef: iViewTableColumn = { title: item.title, key: item.key, width: item.width, minWidth: item.minWidth, align: item.align };
                    CellRender(rendererColDef, item);
                    this.rendererColDef.push(rendererColDef);
                }
            });

            this.$refs.renderer.list.pageNo = 1; // 复位分页
            this.$refs.renderer.getData(); // 手动加载数据
        },

        /**
         * 显示表单配置
         *
         * @returns
         */
        getFormConfig(): string {
            let cfg: ListFactory_ListConfig_New = this.cfg;

            if (cfg && cfg.bindingFormId)
                return '#' + (cfg.bindingFormId || "") + " " + (cfg.bindingFormName || '');
            else return "未绑定";
        },

        /**
         * 选中表单配置之后
         *
         * @param formCfg
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
                this.cfg.colConfig = newValue;
        }
    }
}