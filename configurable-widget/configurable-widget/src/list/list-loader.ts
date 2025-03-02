import { Xhr } from "@ajaxjs/util";
import CellRender from '../list/renderer/list-cell-render';
import FormLoader from "../form/form-loader.vue";

// 声明 window.config 并为其指定类型
declare const window: Window & {
    config: ConfigInterface;
};

export default {
    components: { FormLoader },
    props: {
        apiPrefix: { type: String, required: true },     // API 前缀
        createRoute: { type: String, required: false },     // 新建事件触发时候，进入的路由地址
        editRoute: { type: String, required: false },       // 编辑事件触发时候，进入的路由地址
        defaultAction: { type: Boolean, required: false, default: true },
        showSearch: { type: Boolean, required: false, default: true },
        modalInfo: { type: Boolean, required: false, default: true }, // 是否弹窗显示详情，false 为进入新页面
    },
    data() {
        return {
            widgetName_: '',
            cfg: { fields: [] },
            listApiUrl_: '',
            colDefId: 0,
            list: {
                columns: [],
                data: [],
                total: 0,
                start: 0,
                limit: 9,
                pageNo: 1,
                pageSize: 9,
                loading: false,
                search: {
                    name: ''
                },
            } as TableListConfig,
            isShowForm: false,
            bindingFormId: 0
        };
    },

    methods: {
        /**
         * 加载列定义
         */
        getRemoteColDef(): void {
            Xhr.xhr_get(`${this.apiPrefix}/common_api/widget_config/${this.colDefId}`, (j: RepsonseResult) => {
                this.list.loading = false;

                if (j.status) {
                    this.widgetName_ = j.data.name;
                    this.renderConfig(j.data.config);
                } else
                    this.$Message.warning(j.message || '获取列表失败');
            });
        },
        renderConfig(cfg: ListFactory_ListConfig_New): void {
            this.bindingFormId = cfg.bindingFormId;
            this.listApiUrl_ = cfg.httpApi.replace('{project_prefix}', this.apiPrefix);
            let colDefs: TableColumn[] = cfg.colConfig;
            this.list.columns = [];

            colDefs.forEach((item: TableColumn) => { // 转换为 iView 的配置
                if (item.isShow) {
                    let rendererColDef: iViewTableColumn = { title: item.title, key: item.key, width: item.width, minWidth: item.minWidth, align: item.align };

                    CellRender(rendererColDef, item);

                    this.list.columns.push(rendererColDef);
                }
            });

            if (this.defaultAction)
                this.list.columns.push({ title: "操作", slot: "action", align: "center", width: 260 });

            this.getData();
        },
        getData(): void {
            this.list.loading = true;
            let params: any = { pageNo: this.list.pageNo, pageSize: this.list.pageSize };

            // if (this.list.search.name)
            //     params.where = `name LIKE '%${this.list.search.name}%'`;

            Xhr.xhr_get(this.listApiUrl_, (j: RepsonseResult) => {
                this.list.loading = false;

                if (j.status) {
                    this.list.data = j.data.rows;
                    this.list.total = j.data.total;
                } else
                    this.$Message.warning(j.message || '获取列表失败');
            }, params);
        },

        /**
         * 分页记录数
         */
        handleChangePageSize(pageSize: number): void {
            this.list.limit = pageSize;
            this.getData();
        },
        reset(): void {
            for (let i in this.search)
                this.search[i] = "";

            this.getData();
        },

        /**
         * 新建
         */
        onCreate(id: number): void {
            if (this.createRoute)
                this.$router.push({ path: this.createRoute }); // 进入详情页，采用相对路径
            else {
                if (!this.$parent.onCreate)
                    throw '请设置父组件的 onCreate 事件处理器';

                this.$parent.edit(id);
            }
        },

        /**
         * 编辑
         */
        onEdit(id: number): void {
            if (this.editRoute)
                this.$router.push({ path: this.editRoute, query: { id } }); // 进入详情页，采用相对路径
            else if (this.$parent.onEdit) {
                // throw '请设置父组件的 onEdit 事件处理器';
                this.$parent.edit(id);
            } else {
                this.isShowForm = true;

                if (!this.modalInfo) {
                    setTimeout(() => {
                        this.$refs.FormLoader2a.formId = this.bindingFormId;
                        this.$refs.FormLoader2a.load();
                    });
                } else {
                    this.$refs.FormLoader.formId = this.bindingFormId;
                    this.$refs.FormLoader.load();
                }
            }
        }
    },
    watch: {
        /**
         * 分页
         * 
         * @param v 
         */
        current(v: number): void {
            this.start = (v - 1) * this.list.limit;
            this.getData();
        },
        'list.pageNo'(v: number): void {
            this.list.start = (v - 1) * this.list.limit;
            this.getData();
        },
        colDefId(v: number): void {
            this.getRemoteColDef();
        },
        'cfg': {
            handler(cfg: ListFactory_ListConfig_New): void {
                this.renderConfig(cfg);
            },
            deep: true
        }
    },
};