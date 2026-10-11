/**
 * 项目
 */
type DataService_Porject = {
    id: number;
    name: string;
    content: string;
    apiPrefixDev: string;
    apiPrefixProd: string;
    defaultConfig: any;
};

/**
 * 树节点
 */
type DS_TreeNode_Project = {
    title: string,
    contextmenu: boolean,
    expand?: boolean,
    loading: boolean,
    render: Function,
    projectData: any,
    children?: DS_TreeNode_Service[]
};

/**
 * 树节点（服务）
 */
type DS_TreeNode_Service = {
    title: string,
    contextmenu: boolean,
    expand?: boolean,
    /**
     * 是否创建的
     */
    isCreate?: boolean,
    data: any,
    id: string,
    parentNode: DS_TreeNode_Service | any,
    render?: Function,
    children?: DS_TreeNode_Service[]
};

interface FormLoaderType {
    formId: number;
    load(): void;
}

interface ComponentInstance extends InstanceType<typeof FormLoader> {
    previewloader: FormLoaderType,

    perview: {
        isShow: boolean
    }
}


/* FORM */
/**
 * 表单生成器的配置
 */
declare type FormFactory_Config = {
    /**
     * label 宽度
     */
    labelWidth: number;

    /**
     * 数据绑定配置（读取）
     */
    dataBinding: DataBinding;

    /**
     * 数据绑定配置（创建）
     */
    createApi?: DataBinding;

    /**
     * 数据绑定配置（修改）
     */
    updateApi?: DataBinding;

    /**
     * 是否创新/修改同一个接口，只是 HTTP 方法不同
     */
    isRESTful_writeApi: boolean;

    jsonBased?: JsonBased;

    /**
     * 是否显示表单按钮
     */
    isShowBtns: boolean;

    /**
     * 各个字段的配置
     */
    fields: FormFactory_ItemConfig[];
};

/**
 * JSON 表单的配置
 */
declare type JsonBased = {
    /**
     * 是否基于 JSON  新建的
     */
    isJsonBased: boolean;

    /**
     * JSON 为多层结构，须指定某个对象，这里指定一个字段
     */
    key: string;
};

/**
 * JSON 值类型
 */
declare type JsonType = 'string' | 'long_string' | 'number' | 'boolean' | undefined;

/**
 * 表单生成器各个字段的配置
 */
declare type FormFactory_ItemConfig = BaseModel & {
    /**
     * 是否显示
     */
    isShow: boolean;

    /**
     * JSON 类型
     */
    jsonType?: JsonType;

    /**
     * UI 类型
     */
    uiType: number;

    /**
     * UI 布局
     */
    uiLayout: number;

    /**
     * 校验的正则表达式
     */
    regexp?: string;

    /**
     * 验证错误时的信息
     */
    validMsg?: string;
};

/* LIST */
/**
 * 抽象列配置
 */
type BaseCol = {
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

/**
 * 列配置
 */
declare type TableColumn = BaseCol & {
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
    customRenderKV?: JsonParam;

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

/**
 * iView 的列配置
 */
declare type iViewTableColumn = BaseCol & {
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

/**
 * 列表其他配置
 */
declare type ListFactory_ListConfig = {
    /**
     * 是否分页
     */
    isPage?: boolean;

    /**
     * 分页 0 = 不分页；1 = start/limit； 2 = pageNo/pageSize
     */
    page: 0 | 1 | 2;

    /**
     * 数据绑定配置（读取列表）
     */
    dataBinding: DataBinding;

    /**
     * 删除的数据绑定
     */
    deleteDataBinding?: DataBinding;

    /**
     * 工具条按钮
     */
    toolbarButtons?: ButtonEvent[];

    /**
     * 列表内的操作按钮
     */
    actionButtons?: ButtonEvent[];

    /**
     * 各列配置
     */
    fields: TableColumn[];

    /**
     * 绑定的表单
     */
    bindingForm: {
        /**
         * id
         */
        id: Number;

        name: string;
    }
};

/**
 * 分页类型
 */
enum Paging {
    /**
     * 不分页
     */
    NO_PAGE,

    /**
     * start/limit
     */
    START_LIMIT,

    /**
     * pageNo/pageSize
     */
    PAGE_NO
}

declare type ListFactory_ListConfig_New = {
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
    dataBinding: DataBinding;

    httpApi?: string,

    /**
    * 绑定的表单 id
    */
    bindingFormId?: number,
    bindingFormName?: stirng
}

/**
 * 对应数据库记录
 */
declare type ConfigurableWidgetPO = {
    id?: number;

    name: string;

    config: string;

    // type: 'LIST' | 'FORM' | 'LIST_DEF' | 'FOR'
    type: string
}