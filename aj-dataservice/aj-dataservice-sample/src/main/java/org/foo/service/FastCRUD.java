package org.foo.service;

import com.ajaxjs.dataservice.fastcrud.Namespaces;
import com.ajaxjs.dataservice.fastcrud.sqlgenerator.AutoQuery;
import com.ajaxjs.dataservice.fastcrud.sqlgenerator.AutoQueryBusiness;
import com.ajaxjs.sqlman.model.tablemodel.TableModel;
import org.springframework.stereotype.Component;

import java.io.Serializable;

@Component
public class FastCRUD extends Namespaces {
    {
        AutoQueryBusiness autoQueryBusiness = new AutoQueryBusiness() {
            @Override
            public boolean isListOrderByDate() {
                return true;
            }

            @Override
            public boolean isTenantIsolation() {
                return false;
            }

            @Override
            public boolean isCurrentUserOnly() {
                return false;
            }

            @Override
            public boolean isFilterDeleted() {
                return false;
            }

            @Override
            public Serializable getCurrentUserId() {
                return null;
            }

            @Override
            public Serializable getTenantId() {
                return null;
            }
        };

        TableModel shopAddress = new TableModel();
        shopAddress.setTableName("shop_address");

        put("shop_address", new AutoQuery(shopAddress, autoQueryBusiness));
    }

//    @EventListener
//    public void loadConfig(ApplicationReadyEvent event) {
//        try (Connection conn = DataBaseConnection.initDb()) {
//            loadFromDB(() -> SecurityManager.getUser().getId(), TenantService::getTenantId);
//        } catch (SQLException e) {
//            throw new RuntimeException(e);
//        } finally {
//            JdbcConnection.closeDb();
//        }
//    }
}
