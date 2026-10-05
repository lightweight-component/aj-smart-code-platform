package com.ajaxjs.dataservice.fastcrud;

import com.ajaxjs.dataservice.fastcrud.sqlgenerator.AutoQuery;
import com.ajaxjs.dataservice.fastcrud.sqlgenerator.AutoQueryBusiness;
import com.ajaxjs.spring.DiContextUtil;
import com.ajaxjs.sqlman.Action;
import com.ajaxjs.sqlman.model.CreateResult;
import com.ajaxjs.sqlman.model.UpdateResult;
import com.ajaxjs.sqlman.page.PageResult;
import com.ajaxjs.sqlman.util.Utils;
import com.ajaxjs.util.CommonConstant;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * 基于命名空间配置执行通用 CRUD 操作的服务。
 */
@Service
@RequiredArgsConstructor
public class FastCrudService implements FastCrudController {
    /**
     * 可访问命名空间及其自动查询规则。
     */
    protected final Namespaces namespaces;

    @Override
    public Map<String, Object> info(String namespace, Long id) {
        AutoQuery autoQuery = namespaces.get(namespace);
        String sql = autoQuery.info();

        return new Action(sql).query(id).one();
    }

    @Override
    public List<Map<String, Object>> list(String namespace) {
        String where = getWhereClause();
        AutoQuery autoQuery = namespaces.get(namespace);
        String sql = autoQuery.list(where);

        return new Action(sql).query().list();
    }

    @Override
    public PageResult<Map<String, Object>> page(String namespace) {
        String where = getWhereClause();
        AutoQuery autoQuery = namespaces.get(namespace);
        String sql = autoQuery.list(where);

        return new Action(sql).query().pageByStartLimit(DiContextUtil.getRequest());
    }

    @Override
    public PageResult<Map<String, Object>> pageByNo(String namespace) {
        String where = getWhereClause();
        AutoQuery autoQuery = namespaces.get(namespace);
        String sql = autoQuery.list(where);

        return new Action(sql).query().pageByPageNo(DiContextUtil.getRequest());
    }

    @Override
    public CreateResult<Serializable> create(String namespace, Map<String, Object> params) {
        return create(params, namespace);
    }

    @Override
    public CreateResult<Serializable> create(Map<String, Object> params, String namespace) {
        AutoQuery autoQuery = namespaces.get(namespace);
        String tableName = autoQuery.getTableModel().getTableName();
        AutoQueryBusiness autoQueryBusiness = autoQuery.getAutoQueryBusiness();
        Integer saveUserOnCreate = autoQueryBusiness.getSaveUserOnCreate();

        if (saveUserOnCreate != null) {
            Serializable userId = autoQueryBusiness.getCurrentUserId();

            if (testBCD(1, saveUserOnCreate) && !params.containsKey("creator_id"))
                params.put("creator_id", userId);

            if (testBCD(4, saveUserOnCreate) && !params.containsKey("user_id"))
                params.put("user_id", userId);

            // creator/user_name? TODO
        }

        return new Action(params, tableName).create().execute(autoQuery.getTableModel().isAutoIns());
    }

    @Override
    public UpdateResult update(String namespace, Map<String, Object> params) {
        return update(params, namespace);
    }

    @Override
    public UpdateResult update(Map<String, Object> params, String namespace) {
        AutoQuery autoQuery = namespaces.get(namespace);
        String tableName = autoQuery.getTableModel().getTableName();

        return new Action(params, tableName).update().withId(autoQuery.getTableModel().getIdField());
    }

    @Override
    public boolean deletePhysical(String namespace, Long id) {
        AutoQuery autoQuery = namespaces.get(namespace);
        String sql = autoQuery.deletePhysicalById();

        return new Action(sql).update(id).execute().isOk();
    }

    @Override
    public boolean deleteLogical(String namespace, Long id) {
        AutoQuery autoQuery = namespaces.get(namespace);
        String sql = autoQuery.deleteLogicalById();

        return new Action(sql).update(id).execute().isOk();
    }

    /**
     * 测试 8421 码是否包含 v
     *
     * @param v   当前权限值
     * @param all 总值
     * @return true=已包含
     */
    public static boolean testBCD(int v, int all) {
        return (v & all) == v;
    }

    /**
     * 根据当前 HTTP 请求构造 SQL 条件片段。
     *
     * @return SQL 的 WHERE 条件片段
     * @throws NullPointerException 当当前线程没有绑定 HTTP 请求时抛出
     */
    public static String getWhereClause() {
        return getWhereClause(Objects.requireNonNull(DiContextUtil.getRequest()));
    }

    /**
     * 请求属性中附加 SQL 查询条件参数的键名。
     */
    public static final String SQL_WHERE_CLAUSE = "SQL_WHERE_CLAUSE";

    /**
     * 基于 URL 的 QueryString，设计一个条件查询的参数规范，可以转化为 SQL 的 Where 里面的查询
     * usage:
     * <pre>
     *  ?q_name=张三&amp;q_age=18&amp;q_sex=1&amp;ql_address=上海&amp;lo=and // 默认是 OR 关系
     * </pre>
     *
     * @param request 请求对象
     * @return SQL Where 语句
     */
    public static String getWhereClause(HttpServletRequest request) {
        Map<String, String[]> parameters = request.getParameterMap();

        if (request.getAttribute(SQL_WHERE_CLAUSE) != null) {
            Map<String, String[]> sqlWhereClause = (Map<String, String[]>) request.getAttribute("SQL_WHERE_CLAUSE");
            parameters.putAll(sqlWhereClause);
        }

        List<String> arr = new ArrayList<>();

        for (String parameterName : parameters.keySet()) {
            boolean isQuery = parameterName.startsWith("q_");
            boolean isQueryLike = parameterName.startsWith("ql_");

            if (!isQuery && !isQueryLike)// 跳过不符合条件的参数
                continue;

            StringBuilder pair = new StringBuilder();
            String[] parameterValues = parameters.get(parameterName);
            String fieldName = parameterName.substring(isQueryLike ? 3 : 2);  // 构建 SQL 查询
            Utils.escapeSqlInjection(fieldName);

//            whereClause.append(" OR ");
            pair.append(fieldName);

            // 处理单值参数
            if (parameterValues.length == 1) {
                String value = Utils.escapeSqlInjection(parameterValues[0]).trim();

                if (isQuery) {
                    pair.append(" = ");
                    pair.append("'").append(value).append("'");
                }

                if (isQueryLike) {
                    pair.append(" LIKE ");
                    pair.append("'%").append(value).append("%'");
                }
            } else {
                // 处理数组参数
                pair.append(" IN (");

                if (parameterValues.length > 0) {
                    for (String parameterValue : parameterValues) {
                        pair.append("'");
                        pair.append(Utils.escapeSqlInjection(parameterValue).trim());
                        pair.append("',");
                    }

                    pair.deleteCharAt(pair.length() - 1);
                }

                pair.append(")");
            }

            arr.add(pair.toString());
        }

        if (arr.size() == 0)
            return CommonConstant.EMPTY_STRING;
        else {
            StringBuilder whereClause = new StringBuilder(); // 创建一个用于存储 SQL 查询的 StringBuilder
            whereClause.append(" AND (");
            String logicalOperators = "and".equals(request.getParameter("lo")) ? " AND " : " OR ";
            whereClause.append(String.join(logicalOperators, arr));
            whereClause.append(")");

            return whereClause.toString();// 返回 SQL 查询
        }
    }
}
