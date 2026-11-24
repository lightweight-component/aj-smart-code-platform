package com.ajaxjs.dataservice.datasource;

import com.ajaxjs.sqlman.JdbcConnection;
import lombok.extern.slf4j.Slf4j;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

@Slf4j
public class LocalDataSource {
    final static Long LOCAL_DATA_SOURCE_ID = 99999L;

    public static boolean tableExists(String tableName) {
        return tableExists(null, tableName);
    }

    public static boolean tableExists(String schema, String tableName) {
        Connection connection = JdbcConnection.getConnection();
        try {
            return tableExists(connection, connection.getCatalog(), schema, tableName);
        } catch (SQLException e) {
            log.warn("LocalDataSource.tableExists", e);
            return false;
        }
    }

    public static boolean tableExists(Connection conn, String catalog, String schema, String tableName) {
        try (ResultSet rs = conn.getMetaData().getTables(catalog, schema, tableName, new String[]{"TABLE"})) {
            while (rs.next()) {
                // getTables 的表名参数是模式，_ 和 % 可能匹配到其他表。
                if (tableName.equals(rs.getString("TABLE_NAME")))
                    return true;
            }
        } catch (SQLException e) {
            log.warn("LocalDataSource.tableExists", e);
        }

        return false;
    }
}
