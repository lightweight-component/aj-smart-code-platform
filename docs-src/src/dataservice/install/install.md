---
title: Installation and Configuration
subTitle: 2024-12-05 by Frank Cheung
description: Installation and Configuration
date: 2022-01-05
tags:
  - Installation
  - Configuration
layout: layouts/docs.njk
permalink: /dataservice/install/install/
---
# Installation and Configuration

## System Requirements

- Java 8 or later and Spring 5.0 or later.
- MySQL 8 or later. The current configuration supports MySQL only, although the SQL executed by the service is not limited to MySQL.
- The service is lightweight and has modest system requirements; a single-core machine with 512 MB of RAM is sufficient.

## Download and Source Code

AJ DataService is lightweight: the JAR is just over 200 KB, including its dependencies.

Add the following dependency to your Maven project:

```xml
<!-- AJ DataService -->
<dependency>
  <groupId>com.ajaxjs</groupId>
  <artifactId>ajaxjs-data</artifactId>
  <version>1.2.1</version>
</dependency>
```

DataService depends on the SqlMan library, another open-source project by the author. Visit the [SqlMan website](https://sqlman.ajaxjs.com) for more information.

## Initialize the Database

DataService uses the `ds_common_api` and `ds_project` tables to store configuration. Create these tables in your database before starting the service. The `ds_common_api` table has the following schema:

```sql
CREATE TABLE `ds_common_api` (
    `id` INT(10) NOT NULL AUTO_INCREMENT COMMENT 'Primary key; auto-incrementing',
    `pid` INT(10) NULL DEFAULT '-1' COMMENT 'Parent ID; use -1 or NULL for a top-level node',
    `name` VARCHAR(90) NULL DEFAULT NULL COMMENT 'Description',
    `namespace` VARCHAR(50) NOT NULL COMMENT 'Namespace identifier',
    `table_name` VARCHAR(45) NULL DEFAULT NULL COMMENT 'Table name',
    `type` VARCHAR(10) NULL DEFAULT NULL COMMENT 'Type: SINGLE or CRUD',
    `clz_name` VARCHAR(10) NULL DEFAULT NULL COMMENT 'Entity class reference name',
    `id_field` VARCHAR(10) NULL DEFAULT 'id' COMMENT 'Primary key field name',
    `sql` TEXT NULL DEFAULT NULL COMMENT 'Single SQL statement',
    `info_sql` TEXT NULL DEFAULT NULL COMMENT 'SQL for retrieving a record (optional)',
    `list_sql` TEXT NULL DEFAULT NULL COMMENT 'SQL for retrieving a list (optional)',
    `create_sql` TEXT NULL DEFAULT NULL COMMENT 'SQL for creating a record (optional)',
    `update_sql` TEXT NULL DEFAULT NULL COMMENT 'SQL for updating a record (optional)',
    `delete_sql` TEXT NULL DEFAULT NULL COMMENT 'SQL for deleting a record (optional)',
    `del_field` VARCHAR(100) NULL DEFAULT 'stat' COMMENT 'Deletion field name',
    `has_is_deleted` TINYINT(1) NULL DEFAULT '1' COMMENT 'Whether a logical deletion flag is present',
    `tenant_isolation` TINYINT(3) UNSIGNED NULL DEFAULT NULL COMMENT 'Whether tenant data isolation is enabled',
    `id_type` TINYINT(3) UNSIGNED NULL DEFAULT NULL COMMENT '1 = auto-increment; 2 = Snowflake; 3 = UUID',
    `stat` TINYINT(3) UNSIGNED NULL DEFAULT '0' COMMENT 'Status dictionary value',
    `creator` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Creator name (may be denormalized)',
    `creator_id` INT(10) NULL DEFAULT NULL COMMENT 'Creator ID',
    `create_date` DATETIME NOT NULL DEFAULT (now()) COMMENT 'Creation date',
    `updater` VARCHAR(50) NULL DEFAULT NULL COMMENT 'Updater name (may be denormalized)',
    `updater_id` INT(10) NULL DEFAULT NULL COMMENT 'Updater ID',
    `update_date` DATETIME NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP COMMENT 'Update date',
    PRIMARY KEY (`id`) USING BTREE,
    UNIQUE INDEX `id_UNIQUE` (`id`) USING BTREE
)
COMMENT='Configuration for generic, universal API endpoints'
COLLATE='utf8mb4_unicode_ci';
```

After creating the tables, insert two new records to load the configuration.
