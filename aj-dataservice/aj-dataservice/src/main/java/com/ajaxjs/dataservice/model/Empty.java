package com.ajaxjs.dataservice.model;

import lombok.Data;

/**
 * 没有查询结果或操作结果时使用的空响应对象。
 */
@Data
public class Empty {
    /**
     * 空响应的提示文本。
     */
    String msg = "No data";
}