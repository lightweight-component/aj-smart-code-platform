---
title: Features
subTitle: 2024-12-05 by Frank Cheung
description: Features
date: 2022-01-05
tags:
  - Features
layout: layouts/docs.njk
---
# Features
<section>
    <a name="point"></a>
    <ul>
        <li>Supports databases accessible through JDBC, including MySQL, Oracle, SQL Server, PostgreSQL, H2, HSQLDB, SQLite, MariaDB, DB2, Firebird, Derby, Sybase, Informix, and Microsoft SQL Server.</li>
        <li>Supports dynamic SQL, similar to MyBatis dynamic SQL, including calls to Java functions from SQL, as well as SQL editing, execution, and debugging.</li>
        <li>Creates APIs dynamically: APIs can be created, edited, taken offline, and deleted; changes take effect without a restart.</li>
        <li>Supports composing multiple SQL statements, transactions, and switching between multiple data sources.</li>
        <li>Provides Java access to the data service without making HTTP API calls, much like the traditional Service-to-DAO (Data Access Object) pattern.</li>
        <li>Offers extensible plugins for caching, data transformation, and failure alerts (TODO).</li>
        <li>Supports generating API documentation and importing and exporting it (TODO).</li>
        <li>Lightweight by design: it can run standalone or integrate with a Spring application.</li>
    </ul>
</section>

<section>
    <a name="start"></a>
    <h2>Background</h2>
    <p>
        Enterprise application development involves many form-based workflows and the database tables behind them. Although some operations and business logic involve complex relationships between tables, much of the work is repetitive: in short, CRUD operations. On the backend, a unified CRUD service can coexist with complex and changing business requirements: abstract what can be standardized, and leave the rest open. Write operations (create or update) are often easy to standardize, while some query behavior (SELECT), such as pagination, can also be abstracted. We need a practical, efficient set of application conventions to achieve this goal. For the frontend, the backend assembles a complete SQL statement from the submitted parameters, executes it, and returns the result as JSON. The frontend may call different API endpoints, while the backend can route requests through a single API entry point based on the URL path.
    </p>
    <p>
        Frontend forms do not always need to be designed individually. The balance between customization and consistency should depend on development costs. With a consistent design, automatically generating form interfaces becomes important. Form and list UI generators are covered separately.
    </p>
    <p>
        A frontend form can use a shared CRUD component; its field names only need to match those on the backend. It can then submit the parameters as JSON to the unified CRUD service.
    </p>
    <p>
        The same applies to frontend list components. The key challenge is building queries with different combinations of conditions for complex SELECT queries. One simple approach is to have the frontend send a SQL WHERE clause to the backend. This is only a SQL fragment, not a complete statement, and is safer (though the backend must still check for SQL injection and similar issues).
    </p>
    <p>
        Even without a unified CRUD API, the data service can be used as an ORM tool, or as a further layer over MyBatis. The author uses it this way extensively. This is another mode of the data service: the DAO pattern (Data Access Object). Backend developers are already familiar with DAO, so using the data service purely on the backend feels natural and requires little intrusion. The main change is that SQL statements previously written in MyBatis XML are now stored in the database. You do not need to edit SQL directly in the database; instead, edit it in the data service's GUI, where changes take effect immediately without a restart. SQL is managed in a new environment, while MyBatis remains underneath and backend code continues to use the familiar DAO pattern. Another benefit is that Java callers can use typed Bean entities for ORM instead of Maps (though Maps are also available when appropriate).
    </p>
</section>

<h2>Similar Products</h2>
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
