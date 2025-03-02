import { Xhr } from "@ajaxjs/util";

export default {
    props: {
        apiRoot: { type: String, required: false },  // 接口前缀 API 选择器需要这个属性,
        api: { type: String, required: false },     // 完整的 API 地址。与 接口前缀 二选一
        initId: Number, // 有 id 表示编辑
    },
    data() {

        return {
            id: this.initId || 0,
            apiPrefix: this.$route.query.apiPrefix,
            name: '',
            isShowPerview: false,
            datasourceId: 0,    // 关联的数据源 id。不是数据绑定，没什么约束力，只是参考用
            datasourceName: '', // 关联的数据源名称。不是数据绑定，没什么约束力，只是参考用
            tableName: '',      // 关联的表名。不是数据绑定，没什么约束力，只是参考用
            editIndex: -1,
            widgetType: '' // 组件类型
        };
    },
    mounted(): void {
        let id: string = this.$route.query.id;

        if (id) {
            this.id = Number(id);
            this.getData();
        }
    },
    beforeUpdate() {
        let id: string = this.$route.query.id

        if (!id)
            this.id = null; // clear last id for creation
    },
    methods: {
        /**
         * 获取单个数据
         */
        getDataBase(cb: Function): void {
            Xhr.xhr_get(`${this.apiPrefix}/common_api/widget_config/${this.id}`, (j: RepsonseResult) => {
                let r: any = j.data;

                if (r) {
                    this.name = r.name;
                    this.datasourceId = r.datasourceId || 0;
                    this.datasourceName = r.datasourceName || 0;
                    this.tableName = r.tableName || 0;
                    this.cfg = r.config;
                    cb && cb(r);
                    this.$refs.LivePerview.cfg = this.cfg;
                } else
                    this.$Message.warning('获取配置失败');
            });
        },

        /**
         * 创建 api-> 持久化
         */
        saveOrUpdate(): void {
            let config: any = this.cfg;

            if (!this.name) {
                this.$Message.error('保存失败。请输入名称');
                return;
            }

            let valueObj: ConfigurableWidgetPO = {
                name: this.name,
                config: JSON.stringify(config, null, 1),
                type: this.widgetType
            };

            if (this.id) {
                valueObj.id = this.id;

                Xhr.xhr_put(`${this.apiPrefix}/common_api/widget_config`, (j: RepsonseResult) => {
                    if (j.status)
                        this.$Message.success('修改成功');
                    else
                        this.$Message.warning(j.message);
                }, valueObj);
            } else
                Xhr.xhr_post(`${this.apiPrefix}/common_api/widget_config`, (j: RepsonseResult) => {
                    if (j.status) {
                        this.$Message.success('创建成功');
                        setTimeout(() => this.id = j.data, 800);
                    } else
                        this.$Message.warning(j.message);
                }, valueObj);
        },

        /**
         * 新增
         */
        addRow_(row: any): void {
            this.$refs.configTable.fields.push(row);
            this.editIndex = this.$refs.configTable.fields.length - 1;
            let container = this.$el.querySelector('.content-panel');
            setTimeout(() => container.scrollTop = container.scrollHeight, 200); // 滚动到底部
        },

        /**
         * 保存新增
         */
        saveAddRow_(s1: string, s2: string): void {
            let fields: [] = this.$refs.configTable.fields;
            let lastRow: any = fields[fields.length - 1];

            if (!lastRow[s1] || !lastRow[s2]) {
                this.$Message.error('请填写完整内容');
                return;
            }

            this.editIndex = -1;
        },

        /**
         * 默认的清空数据方法，用于新建的状态。子类可以覆盖
         */
        emptyData(): void {
            this.name = this.cfg.dataBinding.tableName = this.cfg.apiUrl = '';
            this.cfg.fields = [];
        },

        /**
         * 预览
         */
        perview(): void {
            this.$refs.preview.cfg = this.cfg;
            this.isShowPerview = true;
        }
    },
    watch: {
        $route() {
            let id: string = this.$route.query.id;

            if (id) {
                this.id = Number(id);
                this.getData();
            } else
                this.emptyData();// 新建
        }
    }
}