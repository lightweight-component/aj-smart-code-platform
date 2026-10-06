package com.ajaxjs.dataservice.model;

import com.ajaxjs.framework.tree.TreeNode;
import com.ajaxjs.sqlman.annotation.Table;
import com.ajaxjs.sqlman.annotation.Transient;
import lombok.Data;

import java.util.Date;

@Table("ds_url_group")
@Data
public class UrlGroup implements TreeNode {
    Long id;

    Long parentId;

    String name;

    /**
     * 当前分组在最终接口地址中的 URL 路径片段，不包含首尾斜杠。
     */
    String url;

    @Transient
    Boolean isLeaf;

    Date createDate;
}
