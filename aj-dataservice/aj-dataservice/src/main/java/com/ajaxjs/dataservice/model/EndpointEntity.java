package com.ajaxjs.dataservice.model;

import com.ajaxjs.sqlman.annotation.Table;
import com.ajaxjs.util.httpremote.model.HttpMethod;
import lombok.Data;

import java.util.Date;

/**
 * 动态数据服务中一个可被 HTTP 请求调用的端点定义。
 */
@Data
@Table("ds_endpoint")
public class EndpointEntity {
    /**
     * 端点的唯一标识。
     */
    Integer id;

    /**
     * Equals to parent id.
     */
    Integer groupId;

    /**
     * 允许访问端点的 HTTP 方法。
     */
    HttpMethod method;

    /**
     * 相对于所属分组的访问路径。
     */
    String url;

    /**
     * 自定义查询或写入 SQL。
     */
    String sql;

    /**
     * 用于展示的端点名称。
     */
    String name;

    /**
     * 端点说明。
     */
    String content;

    /**
     * 端点执行的操作类型。
     */
    ActionType actionType;

    /**
     * If it's true, you need to specify the tableName.
     */
    boolean isAutoSql;

    /**
     * Required when Map data is used and custom SQL is not used, to specify the table name.
     */
    String tableName;

    /**
     * Required when doing the creation of an entity, to know if it's auto increment ID.
     */
    boolean isAutoIns;

    /**
     * Required when doing the update of an entity, to know which field is the ID.
     */
    String idField;

    /**
     * 数据字典状态；0 表示正常。
     */
    Integer stat;

    /**
     * 创建人名称。
     */
    String creator;

    /**
     * 创建人 ID。
     */
    Integer creatorId;

    /**
     * 创建时间。
     */
    Date createDate;

    /**
     * 修改人名称。
     */
    String updater;

    /**
     * 修改人 ID。
     */
    Integer updaterId;

    /**
     * 修改时间。
     */
    Date updateDate;
}
