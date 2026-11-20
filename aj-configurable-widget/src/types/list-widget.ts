export interface JsonParam {
  name: string;
  value: unknown;
}

declare enum Paging {
  NO_PAGE,
  START_LIMIT,
  PAGE_NO,
}

export type BaseCol = {
    /**
     * json 的 key
     */
    key: string;

    /**
     * 标题
     */
    title: string;

    /**
     * 对齐方式
     */
    align?: 'left' | 'center' | 'right';

    /**
     * 列宽
     */
    width?: number;

    /**
     * 最小列宽
     */
    minWidth?: number;

    /**
     * 最大列宽
     */
    maxWidth?: number;

    /**
     * 列的样式名称
     */
    className?: string;

    /**
     * 对应列是否可以排序
     */
    sortable?: boolean;
};

export type TableColumn = BaseCol & {
    /**
     * 是否渲染
     */
    isShow: boolean;

    /**
     * 渲染器
     */
    render?: 'raw' | 'link' | 'link_http' | 'thumb' | 'email' | 'date' | 'short_date' | 'long_date' | 'sex' | 'render' | 'clk_event' | 'stat' | 'price' | 'boolean_value';

    /**
     * true = 不换行，一行
     */
    isOneLine?: boolean;

    /**
     * 自定义渲染函数（true） or 自定义键值对（false）
     */
    isCode?: boolean;

    /**
     * 自定义键值对
     */
    customRenderKV?: JsonParam[];

    /**
     * 自定义渲染函数
     */
    customRender?: string;

    /**
     * 自定义点击事件
     */
    clkEvent?: string;

    /**
     * 可否搜索
     */
    canSearch?: boolean;

    /**
     * 可否下拉筛选
     */
    canDropdownFilter?: boolean;
}

export type iViewTableColumn = BaseCol & {
    /**
     * 开启后，文本将不换行，超出部分显示为省略号
     */
    ellipsis?: boolean;

    /**
     * 开启后，文本将不换行，超出部分显示为省略号，并用 Tooltip 组件显示完整内容
     */
    tooltip?: boolean;

    /**
    * 渲染器
    */
    render?: Function;
}

export type ListFactory_ListConfig_New = {
    /**
     * 分页
     */
    page: Paging,

    /**
     * 各列配置
     */
    // colConfig: TableColumn[],
    fields: TableColumn[],

    /**
     * 数据绑定配置（读取列表）
     */
    dataBinding: { url: string };

    httpApi?: string,

    /**
    * 绑定的表单 id
    */
    bindingFormId?: number,
    bindingFormName?: string
}
