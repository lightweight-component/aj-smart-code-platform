CREATE TABLE `ds_datasource` (
	`id` INT NOT NULL AUTO_INCREMENT COMMENT '主键 id，自增',
	`name` VARCHAR(45) NOT NULL COMMENT '名称',
	`url_dir` VARCHAR(50) NOT NULL COMMENT '数据源编码，唯一',
	`type` VARCHAR(50) NOT NULL DEFAULT '' COMMENT '数据源类型',
	`url` VARCHAR(255) NOT NULL COMMENT '连接地址',
	`username` VARCHAR(255) NULL DEFAULT NULL COMMENT '登录用户',
	`password` VARCHAR(255) NULL DEFAULT NULL COMMENT '登录密码',
	`connect_ok` TINYINT(1) NULL DEFAULT NULL COMMENT '是否连接验证成功',
	`stat` TINYINT NOT NULL DEFAULT 0 COMMENT '数据字典：状态',
	`cross_db` TINYINT(1) NULL DEFAULT NULL COMMENT '是否跨库',
	`uid` BIGINT NULL DEFAULT NULL COMMENT '唯一 id，通过 uuid 生成不重复 id',
	`creator` VARCHAR(50) NULL DEFAULT NULL COMMENT '创建人名称（可冗余的）',
	`creator_id` INT NULL DEFAULT NULL COMMENT '创建人 id',
	`create_date` DATETIME NOT NULL DEFAULT (now()) COMMENT '创建日期',
	`updater` VARCHAR(50) NULL DEFAULT NULL COMMENT '修改人名称（可冗余的）',
	`updater_id` INT NULL DEFAULT NULL COMMENT '修改人 id',
	`update_date` DATETIME NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '修改日期',
	PRIMARY KEY (`id`) USING BTREE,
	UNIQUE INDEX `uk_ds_datasource_url_dir` (`url_dir`) USING BTREE
)
COMMENT='数据源'
COLLATE='utf8mb4_unicode_ci'

CREATE TABLE `ds_url_group` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT '主键 id，自增',
    `name` VARCHAR(50) NOT NULL COMMENT '分组名称',
    `url` VARCHAR(100) NOT NULL COMMENT 'URL 路径片段，不包含首尾斜杠',
    `parent_id` INT NOT NULL COMMENT '父节点 id',
    `sort_no` INT NULL COMMENT '排序号',
    `creator` VARCHAR(50) NULL DEFAULT NULL COMMENT '创建人名称（可冗余的）',
    `creator_id` INT NULL DEFAULT NULL COMMENT '创建人 id',
    `create_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建日期',
    PRIMARY KEY (`id`),
    CONSTRAINT `uk_ds_url_group_parent_url` UNIQUE (`parent_id`, `url`)
) COMMENT='URL 分组';

CREATE TABLE `ds_endpoint` (
	`id` INT NOT NULL AUTO_INCREMENT COMMENT '主键 id，自增',
	`group_id` INT NOT NULL COMMENT '所属 URL 分组 id',
	`method` ENUM('GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'PATCH', 'TRACE', 'CONNECT') NOT NULL COMMENT 'HTTP 请求方法',
	`url` VARCHAR(255) NOT NULL COMMENT '相对于所属分组的访问路径',
	`sql` TEXT NULL COMMENT '自定义查询或写入 SQL',
	`name` VARCHAR(45) NOT NULL COMMENT '端点名称',
	`content` VARCHAR(255) NULL COMMENT '说明',
	`action_type` ENUM('VALUE', 'INFO', 'LIST', 'PAGE_LIST', 'CREATE', 'UPDATE', 'DELETE') NOT NULL COMMENT '端点执行动作类型',
	`is_auto_sql` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否自动生成 SQL',
	`table_name` VARCHAR(64) NULL DEFAULT NULL COMMENT '自动 SQL 操作的表名',
	`is_auto_ins` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '新增时是否使用数据库自增主键',
	`id_field` VARCHAR(64) NULL DEFAULT NULL COMMENT '更新或删除操作使用的主键字段名',
	`stat` TINYINT NOT NULL DEFAULT 0 COMMENT '数据字典：状态',
	`creator` VARCHAR(50) NULL DEFAULT NULL COMMENT '创建人名称（可冗余的）',
	`creator_id` INT NULL DEFAULT NULL COMMENT '创建人 id',
	`create_date` DATETIME NOT NULL DEFAULT (now()) COMMENT '创建日期',
	`updater` VARCHAR(50) NULL DEFAULT NULL COMMENT '修改人名称（可冗余的）',
	`updater_id` INT NULL DEFAULT NULL COMMENT '修改人 id',
	`update_date` DATETIME NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT '修改日期',
	PRIMARY KEY (`id`),
	CONSTRAINT `uk_ds_endpoint_group_method_url` UNIQUE (`group_id`, `method`, `url`)
)
COMMENT='动态数据服务端点定义';

CREATE INDEX `idx_ds_endpoint_group_id` ON `ds_endpoint` (`group_id`);
