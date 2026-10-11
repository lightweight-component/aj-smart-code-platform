<template>
    <div>
        <span v-if="modalInfo || !isShowForm">
            <!-- 搜索表单 -->
            <!-- <Card :bordered="false" dis-hover class="common-search-panel" style="text-align:left" v-if="showSearch">
                <span style="float:right;">
                    <Button type="primary" icon="ios-search" @click="$parent.getData()">查询</Button>
                    <Button style="margin-left:10px" @click="reset">重置</Button>
                </span>
                <Input suffix="ios-search" v-model="list.search.name" @on-enter="getData" clearable
                    :placeholder="'请输入' + widgetName_ + '名称'" />
            </Card> -->

            <Card :bordered="false" dis-hover>
                <!-- 搜索表单 -->
                <div style="margin:20px 0;  overflow: hidden;">
                    <div class="common-search-panel" v-if="showSearch">
                        <span style="float:right;">
                            <Button type="primary" icon="ios-search" @click="$parent.getData()">查询</Button>
                            <Button style="margin-left:10px" @click="reset">重置</Button>
                        </span>
                        <Input suffix="ios-search" v-model="list.search.name" @on-enter="getData" clearable :placeholder="'请输入' + widgetName_ + '名称'" />
                    </div>
                    <div class="toolbar">
                        <Tooltip class="ivu-ml" content="刷新" placement="top">
                            <Icon size="20" type="ios-refresh" @click="getData" style="cursor: pointer;" />
                        </Tooltip>

                        <slot name="toolbar"></slot>
                        <Button v-if="showCreateBtn" type="primary" icon="md-add" @click="onCreate">新建{{ widgetName_
                        }}</Button>
                    </div>
                </div>
                <Table style="clear:both" :columns="list.columns" :data="list.data" :loading="list.loading">
                    <template v-slot:action="{ row, index }">
                        <slot name="list_action" :item="row"></slot>

                        <a style="color:green;" @click="onEdit(row.id)" v-if="showEditBtn">{{ editBtnAsView ? '查看' :
                            '编辑' }}</a>
                        <Divider type="vertical" v-if="showEditBtn" />
                        <Poptip confirm transfer title="是否要删除此行？" @on-ok="deleteInfo(row.id, index)">
                            <a style="color:red;">删除</a>
                        </Poptip>
                    </template>
                </Table>

                <Page class="ivu-mt ivu-text-right" :total="list.total" :current="list.pageNo" show-total show-sizer :page-size="list.limit"
                    @on-change="onPageNoChange" @on-page-size-change="handleChangePageSize" />
            </Card>
        </span>

        <Modal v-if="modalInfo" v-model="isShowForm" title="预览" width="800" ok-text="关闭" cancel-text="">
            <FormLoader ref="FormLoader" />
        </Modal>

        <span v-if="!modalInfo && isShowForm">
            <a href="#" @click="isShowForm = false">返回列表</a>
            <!-- <FormLoader ref="FormLoader2a" style="width:1200px;margin: 0 auto;" /> -->
        </span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { requestResponse, type ApiResponse } from '../../api/http';
import { getRealUrl } from '../common/utils.js';
import FormLoader from "../form/form-loader.vue";

export default defineComponent({
    name: "ListLoader",
    components: { FormLoader },
    props: {
        createRoute: { type: String, required: false },     // 新建事件触发时候，进入的路由地址
        editRoute: { type: String, required: false },       // 编辑事件触发时候，进入的路由地址
        defaultAction: { type: Boolean, required: false, default: true },
        id: { type: Number, required: false, default: 0 },
        showSearch: { type: Boolean, required: false, default: true },
        modalInfo: { type: Boolean, required: false, default: true }, // 是否弹窗显示详情，false 为进入新页面
        showCreateBtn: { type: Boolean, default: false },// 是否显示创建按钮
        showEditBtn: { type: Boolean, default: true }, // 是否显示 编辑 按钮
        editBtnAsView: { type: Boolean, default: false },// 是否改编辑按钮为查看按钮
    },
    data() {
        return {
            widgetName_: '',
            cfg: { fields: [] },
            listApiUrl_: '',
            colDefId: this.id,
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

    mounted(): void {
        if (this.id)
            this.getRemoteColDef();
    },

    methods: {
        /**
         * 加载列定义
         */
        getRemoteColDef(): void {
            requestResponse<any>(`${window.config.dsApiRoot}/common_api/ds_widget_config/${this.colDefId}`).then((j: ApiResponse<any>) => {
                this.list.loading = false;

                if (j.status) {
                    this.widgetName_ = j.data.name;
                    this.renderConfig(j.data.config);
                } else
                    this.$Message.warning(j.message || '获取列表失败');
            }).catch((error: unknown) => { this.list.loading = false; this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
        },
        renderConfig(cfg: ListFactory_ListConfig_New): void {
            this.bindingFormId = cfg.bindingFormId || 0;
            this.listApiUrl_ = getRealUrl(cfg.dataBinding.url);
            const colDefs: TableColumn[] = cfg.fields;
            this.list.columns = [];

            colDefs.forEach((item: TableColumn) => { // 转换为 iView 的配置
                if (item.isShow) {
                    const rendererColDef: iViewTableColumn = { title: item.title, key: item.key, width: item.width, minWidth: item.minWidth, align: item.align };
                    cellRender(rendererColDef, item);
                    this.list.columns.push(rendererColDef);
                }
            });

            if (this.defaultAction)
                this.list.columns.push({ title: "操作", slot: "action", align: "center", width: 200 });

            this.getData();
        },
        getData(): void {
            this.list.loading = true;
            // if (this.list.search.name)
            //     params.where = `name LIKE '%${this.list.search.name}%'`;

            let api: string = this.listApiUrl_;
            api += ((api.indexOf('?') > -1) ? '&' : '?') + `pageNo=${this.list.pageNo}&pageSize=${this.list.pageSize}`;

            requestResponse<any>(api).then((j: ApiResponse<any>) => {
                this.list.loading = false;

                if (j.status) {
                    if (j.data.zero) {
                        this.$Message.warning('暂无数据');
                    } else {
                        this.list.data = j.data.list as any[];
                        this.list.total = j.data.totalCount as number;
                    }
                } else
                    this.$Message.warning(j.message || '获取列表失败');
            }).catch((error: unknown) => { this.list.loading = false; this.$Message.error(error instanceof Error ? error.message : '请求失败'); });
        },
        onPageNoChange(pageNo: number): void {
            this.list.pageNo = pageNo;
            this.getData();
        },
        /**
         * 分页记录数
         */
        handleChangePageSize(pageSize: number): void {
            this.list.limit = this.list.pageSize = pageSize;
            this.getData();
        },
        reset(): void {
            for (const i in this.search)
                this.search[i] = "";

            this.getData();
        },
        /**
         * 新建
         */
        onCreate(id: number): void {
            if (this.createRoute)
                this.$router.push({ path: this.createRoute }); // 进入详情页，采用相对路径
            else if (this.$parent.onCreate)
                this.$parent.edit(id);
            else if (this.modalInfo) {
                this.isShowForm = true;
                const formLoader: any = this.$refs.FormLoader;
                formLoader.formId = this.bindingFormId;
                formLoader.entityId = 0;
                formLoader.load();
            }
        },
        /**
         * 编辑
         */
        onEdit(id: number): void {
            if (this.editRoute)
                this.$router.push({ path: this.editRoute, query: { id } }); // 进入详情页，采用相对路径
            else if (this.$parent.onEdit)
                this.$parent.edit(id);
            else {
                this.isShowForm = true;
                const formLoader = this.$refs.FormLoader;

                if (!this.modalInfo) {
                    setTimeout(() => {
                        this.$refs.FormLoader2a.formId = this.bindingFormId;
                        this.$refs.FormLoader2a.load();
                    });
                } else {
                    formLoader.formId = this.bindingFormId;
                    formLoader.entityId = id;
                    formLoader.load();
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
        // current(v: number): void {
        //     this.start = (v - 1) * this.list.limit;
        //     this.getData();
        // },
        // 'list.pageNo'(v: number): void {
        //     this.list.start = (v - 1) * this.list.limit;
        //     this.getData();
        // },
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
});

/**
 * 常见的单元格渲染器
 */
export function cellRender(rendererColDef: iViewTableColumn, item: TableColumn): void {
    if (item.isOneLine) {
        rendererColDef.ellipsis = true;
        rendererColDef.tooltip = true;
    }

    if (item.render && item.render != 'raw') {
        if (item.render == 'email')
            rendererColDef.render = email;

        if (item.render == 'link')
            rendererColDef.render = link;

        if (item.render == 'link_http') {
            rendererColDef.render = link_http;
            item.isOneLine = true;
            rendererColDef.ellipsis = true;
            rendererColDef.tooltip = true;
            rendererColDef.minWidth = item.minWidth = 150;// item.minWidth 不起作用
        }

        if (item.render == 'sex')
            rendererColDef.render = sex;

        if (item.render == 'date')
            rendererColDef.render = date;

        if (item.render == 'short_date')
            rendererColDef.render = short_date;

        if (item.render == 'long_date')
            rendererColDef.render = long_date;

        if (item.render == 'thumb')
            rendererColDef.render = thumb;

        if (item.render == 'stat')
            rendererColDef.render = state;

        if (item.render == 'boolean_value')
            rendererColDef.render = booleanValue;

        if (item.render == 'price')
            rendererColDef.render = price;

        if (item.render == 'clk_event' && item.clkEvent)
            try {
                rendererColDef.render = clk_event(eval(item.clkEvent));
            } catch (e) {
                alert('eval 代码错误，请检查配置 code: ' + item.clkEvent);
            }

        if (item.render == 'render') {
            if (item.isCode && item.customRender)
                rendererColDef.render = eval(item.customRender);

            if (!item.isCode && item.customRenderKV)
                rendererColDef.render = customRender(item.customRenderKV as unknown as JsonParam[]);
        }
    }
}

/**
 * 渲染 状态 单元格
 * 
 * @param h 
 * @param params 
 * @returns 
 */
function state(h: (a: string, b: object, c: string) => any, params: any) {
    const value = params.row[params.column.key]; // 取出当前值
    const dot: string = '•';

    switch (value) {
        case 0:
            return h('div', {
                style: { color: '#52c41a', fontSize: '20px' },
                attrs: { title: '正常' }
            }, dot);
            break;
        case -1:
            return h('div', {
                style: { color: 'red', fontSize: '20px' },
                attrs: { title: '已删除' }
            }, dot);
            break;
        default:
            return h('div', {
                style: { color: 'yellow', fontSize: '20px' },
                attrs: { title: '已禁用/已下线' }
            }, dot);
    }
}

// function sex(h: (a: string, b: string) => any, params: any) {
//     const value: number = params.row[params.column.key]; // 取出当前值
//     let str = '';

//     switch (value) {
//         case 1:
//             str = '男';
//             break;
//         case 2:
//             str = '女';
//             break;
//         case 0:
//         default:
//             str = '未知';
//     }

//     return h('span', str);
// }

function sex(h: (a: string, b: string) => any, params: any) {
    const value: string = params.row[params.column.key]; // 取出当前值
    let str = '';

    switch (value) {
        case 'MALE':
            str = '男';
            break;
        case 'FEMALE':
            str = '女';
            break;
        case 'UNKONWN':
        default:
            str = '未知';
    }

    return h('span', str);
}

function email(h: (a: string, b: object, c: string) => any, params: any) {
    const value: string = params.row[params.column.key]; // 取出当前值

    return value ? h('a', { href: 'mailto://' + value }, value) : '';
}

function link(h: (a: string, b: object, c: string) => any, params: any) {
    const value: string = params.row[params.column.key]; // 取出当前值

    return value ? h('a', { href: value, target: '_blank', title: value }, '超链接') : '';
}

function link_http(h: (a: string, b: object, c: string) => any, params: any) {
    const value: string = params.row[params.column.key]; // 取出当前值

    return value ? h('a', { href: value, target: '_blank', title: value }, value) : '';
}

function date(h: (a: string, c: object, b: string) => any, params: any) {
    const value: string = params.row[params.column.key]; // 取出当前值

    if (value) {
        if (value.indexOf(':') != -1) {
            const arr: string[] = value.split(':');
            arr.pop();
            arr.pop();

            return value ? arr.join('').replace(/\s\d+$/, '') : '';
        } else
            return value;
    } else
        return '';
}

function long_date(h: (a: string, b: string) => any, params: any) {
    const value: string = params.row[params.column.key]; // 取出当前值

    if (value && isoDateTimeRegex.test(value)) // 先判断是否 ISO 8601 格式的日期和时间 的字符串
        return h('span', convertDateLong(value));

    return value ? h('span', value) : '';
}

const isoDateTimeRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:.\d*)?)$/;

function convertDate(isoDate: any): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes() === 0 ? '00' : date.getMinutes();

    return `${year}-${month}-${day} ${hour}:${minute}`;
}

function convertDateLong(isoDate: any): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes() === 0 ? '00' : date.getMinutes();
    const seconds = date.getSeconds();

    return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
}

function short_date(h: (a: string, b: string) => any, params: any): string {
    const value: string = params.row[params.column.key]; // 取出当前值

    if (value) {
        if (isoDateTimeRegex.test(value)) // 先判断是否 ISO 8601 格式的日期和时间 的字符串
            return h('span', convertDate(value));

        const arr: string[] = value.split(':');
        arr.pop();

        return value ? h('span', arr.join(':')) : '';
    } else
        return '';
}

function thumb(h: (a: string, b: object, c?: any[]) => any, params: any) {
    const value: string = params.row[params.column.key]; // 取出当前值
    // console.log(value)

    // return value ? h('a', {
    //     attrs: {
    //         href: value, target: '_blank', title: value
    //     }
    // }, [
    //     h('img', {
    //         attrs: {
    //             src: 'https://picx.zhimg.com/3b9d1cb5b_l.jpg?source=172ae18b', style: 'max-width:100px;max-height:50px;'
    //         }
    //     })
    // ]) : '';

    if (!value)
        return '';

    const isBase64Image: boolean = value.startsWith('iVBOR') || value.startsWith('/9j');
    const a: any = isBase64Image ?
        { href: 'javascript:void(0);' } :
        { href: value, target: '_blank', title: value };

    return h('a', a, [
        h('img', {
            src: isBase64Image ? 'data:image/*;base64,' + value : value,
            // 对于内联样式，可以直接传递字符串或对象
            style: 'max-width:100px;max-height:50px;margin-top:5px'
        })
    ]);
}

function clk_event(clk: (a: any) => any): (h: (a: string, b: object, c: string) => any, params: any) => any {
    return (h: (a: string, b: object, c: string) => any, params: any) => {
        const value: string = params.row[params.column.key]; // 取出当前值

        return value ? h('a', {
            on: { 'click': () => clk(params.row) }
        }, value) : '';
    };
}

function booleanValue(h: (a: string, b: string) => any, params: any): string {
    const value: boolean = params.row[params.column.key]; // 取出当前值

    return value ? '是' : '否';
}

function price(h: (a: string, b: string) => any, params: any): string {
    const value: number | null = params.row[params.column.key]; // 取出当前值

    if (!value)
        return '';

    const amountInYuan: number = value / 100;

    return amountInYuan.toFixed(2);
}

function customRender(arr: JsonParam[]): (h: (a: string, b: any) => any, params: any) => any {
    // arr to map
    const map: { [key: string]: any } = {};
    arr.forEach(item => map[(item.value) + ""] = item.name);

    return (h: (a: string, b: any) => any, params: any) => {
        const value: string = params.row[params.column.key]; // 取出当前值

        return (value == '0' || value) ? h('span', map[value]) : '';
    };
}
</script>

<style scoped>
.toolbar {
    margin-bottom: 20px;
    overflow: hidden;
    float: right;
}

.toolbar .ivu-ml {
    float: right;
    padding-top: 10px;
}

/* 分页控件有点问题，修改下 */
.ivu-mt.ivu-text-right {
    text-align: right;
    margin-top: 20px;
}

.common-search-panel {
    width: 380px;
    float: left;
}

.common-search-panel .ivu-input-type-text {
    width: 200px;
    margin: 0 10px 16px 0;
}
</style>