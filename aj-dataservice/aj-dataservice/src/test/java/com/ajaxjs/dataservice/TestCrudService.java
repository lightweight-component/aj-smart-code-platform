package com.ajaxjs.dataservice;

import com.ajaxjs.dataservice.crud.CrudService;
import lombok.Data;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;


public class TestCrudService extends BaseTest {
    @Autowired
    CrudService crud;

    @Test
    public void testQueryOne() {
        int total = crud.queryOne(int.class, "SELECT count(*) FROM Employees");
        System.out.println(total);
        assertTrue(total > 0);
    }

    @Test
    public void testInfoMap() {
        Map<String, Object> map = crud.infoMap("SELECT * FROM Employees WHERE id = ?", 1);
        System.out.println(map);
        System.out.println(crud.hashCode());
        assertNotNull(map);
    }

    @Data
    public static class Employee {
        private Integer id;

        private String name;

        private Date birthday;

        private Date hireDate;

        private String department;
    }

    @Test
    public void testInfoBean() {
        Employee employee = crud.info(Employee.class, "SELECT * FROM Employees WHERE id = ?", 1);
        System.out.println(employee);

        System.out.println(crud.hashCode());

        assertNotNull(employee);
    }
}
