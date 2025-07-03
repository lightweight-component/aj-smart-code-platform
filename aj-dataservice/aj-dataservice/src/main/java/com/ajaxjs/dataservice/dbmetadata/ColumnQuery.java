package com.ajaxjs.dataservice.dbmetadata;

import lombok.extern.slf4j.Slf4j;
import org.springframework.util.StringUtils;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 列信息查询
 */
@Slf4j
public class ColumnQuery extends BaseMetaQuery {

    public ColumnQuery(Connection conn) {
        super(conn);
    }

    /**
     * 获取一张表的各个字段的注释
     *
     * @param tableName 单张表名
     * @param dbName    数据库名，可选的
     * @return 一张表的各个字段的注释
     */
    public List<Column> getColumnComment(String tableName, String dbName) {
        String target = "";

        if (StringUtils.hasText(dbName))
            target += dbName + ".";

        target += tableName;

        List<Column> list = new ArrayList<>();
//        JdbcReader.query(conn, "SHOW FULL COLUMNS FROM " + target, rs -> rs2list(rs, list));
        getMapResult("SHOW FULL COLUMNS FROM " + target, (rs, map) -> rs2list(rs, list), false);

        return list;
    }

    /**
     * 获取多张表的各个字段的注释
     *
     * @param tableNames 多张表的表名
     * @return 包含给个字段注释的 Map，key 是表名，value 是各个列。列中的Map
     */
    public Map<String, List<Column>> getColumnComment(List<String> tableNames) {
        Map<String, List<Column>> map = new HashMap<>();

        try (Statement stmt = conn.createStatement()) {
            for (String tableName : tableNames) {
                try (ResultSet rs = stmt.executeQuery("SHOW FULL COLUMNS FROM " + tableName)) {
                    List<Column> list = new ArrayList<>();
                    rs2list(rs, list);
                    map.put(tableName, list);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        return map;
    }

    private static Pattern getLength;

    private static void rs2list(ResultSet rs, List<Column> list) {
        if (getLength == null)
            getLength = Pattern.compile("\\((\\d+)\\)");

        try {
            while (rs.next()) {
                Column col = new Column();
                col.setName(rs.getString("Field"));
                String type = rs.getString("Type");

                Matcher m = getLength.matcher(type);
                col.setLength(m.find() ? Integer.parseInt(m.group(1)) : 0);
                col.setType(m.replaceAll(""));
                col.setComment(rs.getString("Comment"));
                col.setDefaultValue(rs.getString("Default"));

                String key = rs.getString("Key");
                col.setIsKey(StringUtils.hasText(key) && "PRI".equals(key));

                list.add(col);
            }
        } catch (SQLException e) {
            log.warn("SQLException", e);
        }
    }
}
