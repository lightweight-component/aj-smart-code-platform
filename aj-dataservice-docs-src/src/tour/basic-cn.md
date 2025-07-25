---
title: 基本概念
subTitle: 2024-12-05 by Frank Cheung
description: 基本概念
date: 2022-01-05
tags:
  - 基本概念
layout: layouts/docs-cn.njk
---

# 基本概念

 <section>
  <p style="font-style: italic;">前言: DataSerivce 务求一切操作简单化，不创造过多概念，但一些前提的概念是必须的，——请放心，哪怕你是个 CRUD Boy 都会觉得很简单：）</p>
  <h3>命名空间 Namespace</h3>
  <p>DataService 中的一个服务就是可配置的最基础单元，“命名空间 Namespace”表示其名字，也是构成 HTTP API URL 上面的一部分。不确切地说，它相对应于 SQL 中的一张表，
      当然这种类比不是强耦合的，例如：
  <ul>
      <li>如果你选择的是自定义 SQL，那么这个命名空间仅仅是名字而已，跟具体哪张表没有确切联系，——因为你全写在 SQL 了，爱怎么样怎么样；</li>
      <li>如果你选择默认的 CRUD 模式，那么你必须在另外一个字段
          <span class="c">table_name</span> 给出真实的表名，靠这个表名自动创建一系列的功能（此时 <span class="c">namespace</span>
          字段仍然是名字的意思，
          于是很多时候 <span class="c">table_name</span> 与 <span class="c">namespace</span> 是一致的）。
      </li>
  </ul>

  <p>一个服务（或者说“一个命名空间”）可以有一个或多个 SQL 操作，对应一个或多个 HTTP API 地址，比如说一个服务默认有 CRUD 四个的 SQL 操作（一般都是围绕一张表操作的），对应着四个 API 入口；但也可以只有一个（自定义的
      SQL）。CRUD 不够可以扩展，一个命名空间下可允许有多个子命名空间。当前最多两级的命名空间结构。</p>

  <p>DataService 并不会负责业务实体的建模、建表等操作，但是会从现有的数据表中获取相关的信息来进行配置。
      建模的方法论与传统的关系型数据库开发模式一致，前期仍是分析、设计（ER 图/UML）、建表等的流程。</p>
  </p>
  <h3>CRUD</h3>
  <p>数据实体（Entity）有四种基础的操作：增删改查 CRUD。在 DataService 中它们的关系如下表所示。</p>
  <table>
      <tbody>
          <tr>
              <th></th>
              <th>创建实体 Create</th>
              <th>查询实体 Read</th>
              <th>更新实体 Update </th>
              <th>删除实体 Delete </th>
          </tr>
          <tr>
              <td>HTTP 方法</td>
              <td>POST</td>
              <td>GET</td>
              <td>PUT</td>
              <td>DELETE</td>
          </tr>
          <tr>
              <td>
                  SQL 命令</td>
              <td>INSERT INTO</td>
              <td>SELECT
              </td>
              <td>UPDATE
              </td>
              <td>DELTETE/UPDATE（逻辑删除）
              </td>
          </tr>
          <tr>
              <td rowspan="3" colspan="1">DataService
                  操作</td>
              <td rowspan="3" colspan="1">根据提交的数据转化为
                  INSERT INTO 语句去操作 </td>
              <td>获取单笔详情</td>
              <td rowspan="3" colspan="1">根据提交的数据转化为
                  UPDATE SQL 语句去操作
              </td>
              <td rowspan="3" colspan="1">删除逻辑或物理删除</td>
          </tr>
          <tr>
              <td>
                  获取多行列表（不分页）</td>
          </tr>
          <tr>
              <td>获取多行分页列表</td>
          </tr>
          <tr>
              <td>API 入参</td>
              <td>标准表单或 JSON 数据</td>
              <td>Path 参数或 QueryString 参数</td>
              <td>标准表单或 JSON 数据</td>
              <td>Path 参数或 QueryString 参数，只须 id 参数</td>
          </tr>
          <tr>
              <td>API 出参</td>
              <td>新建实体的 id</td>
              <td>单笔详情 <span class="c">{}</span> 对象<br>
                  列表 <span class="c">[]</span> 数组</td>
              <td>是否成功</td>
              <td>是否成功</td>
          </tr>
      </tbody>
  </table>

  <p>
      DataService 各项功能围绕 CRUD 展开，上述的“SQL 命令”与“DataService 操作”两部分，不仅提供默认通用的 CRUD 操作，而且如果不满足的话，还可以自定义 SQL 逻辑（下小节详述）。
      
      不论哪种方式，均采用约定好的固定搭配请求服务，假设<span class="c">/common_api</span>为数据服务的专属 API 前缀、
      <span class="c">foo</span>为命名空间，则有以下固定的请求操作。
  </p>

  <ul>
      <li>
          GET <span class="c">/common_api/foo/1234</span> 获取单笔详情记录，其中 1234 是 Path 参数，即格式如 <span
              class="c">/common_api/{namespace}/{id}</span>
      </li>
      <li>
          GET <span class="c">/common_api/foo/list</span> 获取多行列表记录，最后是 /list 结尾的，即格式如 <span
              class="c">/common_api/{namespace}/list</span>
      </li>
      <li>
          GET <span class="c">/common_api/foo/page</span> 获取多行列表分页记录，最后是 /page 结尾的，即格式如 <span
              class="c">/common_api/{namespace}/page</span>，并要传相关的分页参数
      </li>SQL
  </ul>

  <h2>默认 CURD v.s 自定义 SQL</h2>
</section>