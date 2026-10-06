package com.ajaxjs.dataservice.model;

import com.ajaxjs.framework.tree.TreeNode;
import com.ajaxjs.sqlman.annotation.Table;
import lombok.Data;

import java.util.Date;

@Table("ds_url_group")
@Data
public class UrlGroup implements TreeNode {
    Integer id;

    Integer parentId;

    String name;

    Date createDate;
}
