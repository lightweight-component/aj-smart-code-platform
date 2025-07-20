---
title: 特点
subTitle: 2024-12-05 by Frank Cheung
description: 特点
date: 2022-01-05
tags:
  - 特点
layout: layouts/docs-cn.njk
---

# 数据服务 AJ DataService 简介

<a name="intro"></a>
<h4>只需写 SQL 业务逻辑（甚至零代码不写！），即可快速搭建 CRUD 接口服务</h4>
<p style="text-align: right;font-style: italic;">——最简单的方式：零代码，在页面上配置好参数，自动生成 SQL 并且直接转化成 HTTP API。</p>
<img class="content" style="border: 1px solid #ccc;" src="../imgs/ds.jpg" title="管理主界面" />
<p style="text-align: center;"><a href="../../../demo/data-service" target="_blank">进入演示</a>，账号：admin，密码：123123</p>
<p>
Java 企业级开发中，要写 Model、DAO、Service 和 Controller 代码是一件非常繁琐的事情，里面存在着大量的重复工作，DataService
就是为了解决这个问题而生的。按照业务复杂程度的递进，可分为以下三种 DataService 的应用模式：
</p>
<ul>
  <li>大量的基础数据。这类数据表的特点是没什么或少量常见的业务逻辑，采用 DataService 创建通用的 CRUD 服务即可完成。</li>
  <li>自定义的业务逻辑，并非简单的 CRUD，但通过 SQL 仍能实现，不用额外写 Java 的业务代码，尤其适用于 BI 报表、数据可视化大屏的后端接口开发。</li>
  <li>复杂的业务逻辑，需 Java+SQL 协力完成。这时 DataService 仍能作为一种 ORM 机制出现，相当于一个 Data Access Object，返回 Java Bean 实体。
  </li>
</ul>

<p>DataService 不是代码生成器，更直观地说它是把一切常见 CRUD 工作抽象化，然后使之可配置化的快速业务开发工具。</p>

<section>
  <a name="point"></a>
  <h2>特点</h2>
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

## 源代码

本项目采用 Apache License 协议开源。

- GitHub
  地址：[https://github.com/lightweight-component/aj-security](https://github.com/lightweight-component/aj-security)
- GitCode
  地址（适合中国用户快速访问）：[https://gitcode.com/lightweight-component/aj-security](https://gitcode.com/lightweight-component/aj-security)

## 相关链接

[用户手册](https://security.ajaxjs.com) | [JavaDoc](https://javadoc.io/doc/com.ajaxjs/aj-security) | [DeepWiki 页面](https://deepwiki.com/lightweight-component/aj-security)

