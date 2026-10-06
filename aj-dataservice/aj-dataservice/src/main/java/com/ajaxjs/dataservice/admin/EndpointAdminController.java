package com.ajaxjs.dataservice.admin;

import com.ajaxjs.dataservice.model.EndpointEntity;
import com.ajaxjs.sqlman.Action;
import com.ajaxjs.util.ObjectHelper;
import org.springframework.web.bind.annotation.*;

import java.io.Serializable;
import java.util.List;

/**
 * URL 分组下动态端点的管理 API。
 */
@RestController
@RequestMapping("/ds_endpoint")
public class EndpointAdminController {
    private static final String TABLE_NAME = "ds_endpoint";

    @GetMapping("/group/{groupId}")
    public List<EndpointEntity> listByGroup(@PathVariable Integer groupId) {
        return new Action("SELECT * FROM ds_endpoint WHERE group_id = ? ORDER BY id")
                .query(groupId).list(EndpointEntity.class);
    }

    @PostMapping
    public Long create(@RequestBody EndpointEntity endpoint) {
        validate(endpoint, null);
        endpoint.setId(null);

        Serializable id = new Action(endpoint, TABLE_NAME).create().execute(true).getNewlyId();
        return ((Number) id).longValue();
    }

    @PutMapping("/{id}")
    public boolean update(@PathVariable Integer id, @RequestBody EndpointEntity endpoint) {
        if (endpoint.getId() != null && !id.equals(endpoint.getId()))
            throw new IllegalArgumentException("The path id does not match the endpoint id.");

        validate(endpoint, id);
        endpoint.setId(id);

        return new Action(endpoint, TABLE_NAME).update().withId("id", id).isOk();
    }

    @DeleteMapping("/{id}")
    public boolean delete(@PathVariable Integer id) {
        return new Action("DELETE FROM ds_endpoint WHERE id = ?").update(id).execute().getEffectedRows() > 0;
    }

    private void validate(EndpointEntity endpoint, Integer endpointId) {
        if (endpoint == null)
            throw new IllegalArgumentException("The endpoint is required.");

        if (endpoint.getGroupId() == null || new Action("SELECT id FROM ds_url_group WHERE id = ?")
                .query(endpoint.getGroupId()).one(Integer.class) == null)
            throw new IllegalArgumentException("The URL group does not exist.");

        if (ObjectHelper.isEmptyText(endpoint.getName()))
            throw new IllegalArgumentException("The endpoint name is required.");

        if (ObjectHelper.isEmptyText(endpoint.getUrl()))
            throw new IllegalArgumentException("The endpoint URL is required.");

        if (endpoint.getMethod() == null || endpoint.getActionType() == null)
            throw new IllegalArgumentException("The endpoint method and action type are required.");

        String duplicateSql = endpointId == null
                ? "SELECT id FROM ds_endpoint WHERE group_id = ? AND method = ? AND url = ?"
                : "SELECT id FROM ds_endpoint WHERE group_id = ? AND method = ? AND url = ? AND id <> ?";
        Object[] params = endpointId == null
                ? new Object[]{endpoint.getGroupId(), endpoint.getMethod().name(), endpoint.getUrl()}
                : new Object[]{endpoint.getGroupId(), endpoint.getMethod().name(), endpoint.getUrl(), endpointId};

        if (new Action(duplicateSql).query(params).one(Integer.class) != null)
            throw new IllegalArgumentException("The endpoint method and URL already exist in this group.");
    }
}
