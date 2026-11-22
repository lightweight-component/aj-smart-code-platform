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
 * 列配置
 */
type TableColumn = import("./list-widget").TableColumn;

/**
 * iView 的列配置
 */
type iViewTableColumn = import("./list-widget").iViewTableColumn;

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

type ListFactory_ListConfig_New = import("./list-widget").ListFactory_ListConfig_New;

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

declare interface TableListConfig {
  columns: unknown[];
  data: unknown[];
  total: number;
  start: number;
  limit: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  search: Record<string, string>;
}
