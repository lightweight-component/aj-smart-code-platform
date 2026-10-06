CREATE TABLE shop_address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    receiver VARCHAR(255),
    stat INT,
    create_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO shop_address (name, address, phone, receiver, stat)
VALUES
('Shop A', '123 Main St', '123-456-7890', 'John Doe', 0),
('Shop B', '456 Elm St', '234-567-8901', 'Jane Smith', 0),
('Shop C', '789 Oak St', '345-678-9012', 'Alice Johnson', 0),
('Shop D', '101 Maple St', '456-789-0123', 'Bob Brown', 1),
('Shop E', '202 Birch St', '567-890-1234', 'Charlie Davis', 1);


INSERT INTO ds_url_group (id, name, url, parent_id, sort_no, creator, creator_id) VALUES
(1000, '数据服务', 'data-service', -1, 10, 'admin', 1),
(1100, '系统管理', 'system', -1, 20, 'admin', 1),
(1200, '业务接口', 'business', -1, 30, 'admin', 1),

(1010, '数据源管理', 'datasource', 1000, 10, 'admin', 1),
(1020, '接口分组', 'api-group', 1000, 20, 'admin', 1),
(1030, '接口管理', 'endpoint', 1000, 30, 'admin', 1),

(1011, 'MySQL 数据源', 'mysql', 1010, 10, 'admin', 1),
(1012, 'H2 本地数据源', 'h2', 1010, 20, 'admin', 1),

(1021, '用户相关接口', 'user', 1020, 10, 'admin', 1),
(1022, '订单相关接口', 'order', 1020, 20, 'admin', 1),
(1023, '报表相关接口', 'report', 1020, 30, 'admin', 1),

(10211, '用户查询', 'query', 1021, 10, 'admin', 1),
(10212, '用户写入', 'write', 1021, 20, 'admin', 1),
(10221, '订单查询', 'query', 1022, 10, 'admin', 1),
(10222, '订单写入', 'write', 1022, 20, 'admin', 1),

(1031, 'GET /users', 'get-users', 1030, 10, 'admin', 1),
(1032, 'POST /users', 'post-users', 1030, 20, 'admin', 1),
(1033, 'GET /orders', 'get-orders', 1030, 30, 'admin', 1),

(1110, '用户与权限', 'permission', 1100, 10, 'admin', 1),
(1120, '菜单管理', 'menu', 1100, 20, 'admin', 1),
(1111, '角色管理', 'role', 1110, 10, 'admin', 1),
(1112, '用户管理', 'user', 1110, 20, 'admin', 1),

(1210, '客户中心', 'customer', 1200, 10, 'admin', 1),
(1220, '订单中心', 'order', 1200, 20, 'admin', 1),
(1211, '客户列表', 'list', 1210, 10, 'admin', 1),
(1212, '客户详情', 'detail', 1210, 20, 'admin', 1);

INSERT INTO ds_endpoint
(group_id, method, url, sql, name, content, action_type,
 is_auto_sql, table_name, is_auto_ins, id_field, creator, creator_id)
VALUES
-- 1021：用户相关接口
(1021, 'GET', '/{id}', 'SELECT * FROM shop_address WHERE id = ?', '查询用户地址详情', '按主键查询单个地址实体', 'INFO', 0, NULL, 0, 'id', 'admin', 1),
(1021, 'GET', '/list', 'SELECT * FROM shop_address ORDER BY id', '查询用户地址列表', '查询地址实体列表', 'LIST', 0, NULL, 0, NULL, 'admin', 1),
(1021, 'POST', '/', NULL, '新增用户地址', '自动新增一条地址实体', 'CREATE', 1, 'shop_address', 1, 'id', 'admin', 1),
(1021, 'PUT', '/', NULL, '修改用户地址', '请求体须包含 id，自动修改地址实体', 'UPDATE', 1, 'shop_address', 0, 'id', 'admin', 1),
(1021, 'DELETE', '/{id}', 'DELETE FROM shop_address WHERE id = ?', '删除用户地址', '按主键删除地址实体', 'DELETE', 0, NULL, 0, 'id', 'admin', 1),

-- 1022：订单相关接口
(1022, 'GET', '/{id}', 'SELECT * FROM shop_address WHERE id = ?', '查询订单地址详情', '按主键查询单个地址实体', 'INFO', 0, NULL, 0, 'id', 'admin', 1),
(1022, 'GET', '/list', 'SELECT * FROM shop_address ORDER BY id', '查询订单地址列表', '查询地址实体列表', 'LIST', 0, NULL, 0, NULL, 'admin', 1),
(1022, 'POST', '/', NULL, '新增订单地址', '自动新增一条地址实体', 'CREATE', 1, 'shop_address', 1, 'id', 'admin', 1),
(1022, 'PUT', '/', NULL, '修改订单地址', '请求体须包含 id，自动修改地址实体', 'UPDATE', 1, 'shop_address', 0, 'id', 'admin', 1),
(1022, 'DELETE', '/{id}', 'DELETE FROM shop_address WHERE id = ?', '删除订单地址', '按主键删除地址实体', 'DELETE', 0, NULL, 0, 'id', 'admin', 1),

-- 1023：报表相关接口
(1023, 'GET', '/{id}', 'SELECT * FROM shop_address WHERE id = ?', '查询报表地址详情', '按主键查询单个地址实体', 'INFO', 0, NULL, 0, 'id', 'admin', 1),
(1023, 'GET', '/list', 'SELECT * FROM shop_address ORDER BY id', '查询报表地址列表', '查询地址实体列表', 'LIST', 0, NULL, 0, NULL, 'admin', 1),
(1023, 'POST', '/', NULL, '新增报表地址', '自动新增一条地址实体', 'CREATE', 1, 'shop_address', 1, 'id', 'admin', 1),
(1023, 'PUT', '/', NULL, '修改报表地址', '请求体须包含 id，自动修改地址实体', 'UPDATE', 1, 'shop_address', 0, 'id', 'admin', 1),
(1023, 'DELETE', '/{id}', 'DELETE FROM shop_address WHERE id = ?', '删除报表地址', '按主键删除地址实体', 'DELETE', 0, NULL, 0, 'id', 'admin', 1);
