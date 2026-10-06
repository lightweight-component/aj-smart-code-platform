package org.foo.controller;

import com.ajaxjs.dataservice.model.UrlGroup;
import com.ajaxjs.framework.tree.TreeController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ds_tree")
public class TreeNodeAdminController extends TreeController<UrlGroup> {
    public TreeNodeAdminController() {
        super("ds_url_group");
    }
}
