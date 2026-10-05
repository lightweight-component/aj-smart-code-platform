package org.foo.controller;

import com.ajaxjs.dataservice.DataServiceDispatcher;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 数据服务接口
 */
@RestController
@RequestMapping(DataServiceDispatcher.URL_PREFIX)
public class DataServiceController extends DataServiceDispatcher {
}
