---
title: 特点
subTitle: 2024-12-05 by Frank Cheung
description: 特点
date: 2022-01-05
tags:
  - 特点
layout: layouts/docs-cn.njk
---
# 特点
<section>
    <a name="point"></a>

    <ul>
        <li>支持所有 JDBC 协议的数据库，包括
            MySQL、Oracle、SQLServer、PostgreSQL、H2、HSQLDB、SQLite、MariaDB、DB2、Firebird、Derby、Sybase、Informix、Microsoft
            SQL</li>
        <li>支持动态 SQL，类似 MyBatis 的动态 SQL，支持 SQL 调用 Java 函数、支持 SQL 编辑、运行、调试</li>
        <li>动态创建 API，支持 API 动态创建、编辑、下线、删除，API 动态发布，不需要重启</li>
        <li>支持多 SQL 组合、事务、支持多数据源可自由切换</li>
        <li>提供 Java 调用数据服务，无须经过 HTTP 调用 API，如同传统 Service 调用 DAO（Data Access Object） 模式那样子</li>
        <li>丰富的插件扩展，支持缓存、数据转换、失败告警（TODO）</li>
        <li>支持生成 API 接口文档，导入导出（TODO）</li>
        <li>轻量级设计，既可独立运行，也可整合到 Spring 程序中。</li>
    </ul>
</section>

<section>
    <a name="start"></a>
    <h2>缘起</h2>
    <p>
        企业级的开发中包含大量的表单应用，与之对应的是数据库的表。虽然也包含关联表的较复杂操作和逻辑，但总体来说存在大量的重复工作——简而化之就是 CRUD 操作。首先是后台的业务操作，必须明确，抽象一个统一的 CRUD
        服务与复杂多变的业务需求并不矛盾：能抽象的就抽象，不能抽象统一的就开放，无他尔。特别是写入操作（创建 or
        更新）往往是可以做到统一的，而查询（SELECT）某种程度也能抽象（如分页，等等）。这就需要我们制定一套合理、高效的应用规则，实现上述设计之目标。与前端的关系，就是根据前端传入的参数来组装一条完整的
        SQL，执行完毕把结果以
        JSON 形式返还给前端。对于前端而言，虽然看到不同的 API 接口，但对于后端而言，只是一个 API 接口的入口，然后根据不同 URL 目录作分发而已。
    </p>
    <p>
        前端的表单界面，实际没必要单独定制。在个性化跟统一化两边应要根据开发成本决定的。当采用统一化设计的时候，自动化生成表单界面变得很重要了。关于表单、列表 UI 生成器我们另外专题再讲。
    </p>
    <p>
        前端表单做成统一的 CRUD 组件，字段名跟后端一致即可，提交参数为 JSON 传给后端统一的 CRUD 服务即可。
    </p>
    <p>
        前端列表组件也是，关键在于复杂的 SELECT Query 查询，不同情况下组合的条件查询。甚至有种简单直接的办法，就是前端直接生成 SQL WHERE 语句传到后端，这并不是完整的 SQL，而是 SQL
        片断，安全性更高（当然后端也要做好诸如 SQL 注入等的检查）。
    </p>
    <p>
        退一万步讲，即使不使用统一的 CRUD 接口，也可以把数据服务作为一个 ORM 工具，或者说对 MyBatis 的进一步封装。实际上本作者也是大量这么使用的。这就是数据服务的另外一种模式：DAO 模式（Data
        Access Object）。DAO 后端开发人员都不陌生，在后端纯粹使用数据服务也是非常自然，无太大入侵的。最大的变化，则是之前在 MyBatis XML 写的 SQL 语句，如今却是放到数据库中保存 SQL
        了，当然你不需要进入数据库修改 SQL（当然也不是不可以），而是在数据服务提供 GUI 中编辑 SQL，即时生效无需重启。有一套新的环境管理 SQL，底层仍是 MyBatis，而后端代码仍是程序员熟悉的
        DAO。另外一点好处，就是既然在 Java 了，肯定是带类型的 Bean 实体 ORM，而不是 Map（当然用 Map 也是可以，看需要）。
    </p>
</section>

<h2>同类产品</h2>
<p> <span class="external-link">
        <span>↗</span>
    </span>
    <a href="https://www.51dbapi.com/" target="_blank">DBAPI</a> | 
    <span class="external-link">
        <span>↗</span>
    </span>
    <a href="https://crudapi.cn/" target="_blank">crudapi</a> | 
    <span class="external-link">
        <span>↗</span>
    </span>
    <a href="https://www.ssssssss.org/" target="_blank">magic-api</a>
</p>