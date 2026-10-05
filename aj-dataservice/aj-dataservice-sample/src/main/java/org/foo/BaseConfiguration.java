package org.foo;

import com.ajaxjs.dataservice.EndpointMgr;
import com.ajaxjs.dataservice.model.ActionType;
import com.ajaxjs.dataservice.model.Endpoint;
import com.ajaxjs.dataservice.model.Group;
import com.ajaxjs.util.ObjectHelper;
import com.ajaxjs.util.httpremote.model.HttpMethod;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

/**
 * 程序配置
 */
@Configuration
public class BaseConfiguration implements WebMvcConfigurer {
    @Value("${auth.excludes: }")
    private String excludes;

    /**
     * 加入认证拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
//        InterceptorRegistration interceptorRegistration = registry.addInterceptor(authInterceptor());
//        interceptorRegistration.addPathPatterns("/**"); // 拦截所有
//
//        // 不需要的拦截路径
//        if (StringUtils.hasText(excludes)) {
//            String[] arr = excludes.split("\\|");
//            interceptorRegistration.excludePathPatterns(arr);
//        }
    }

    /**
     * 用户全局拦截器
     */
//    @Bean
//    UserInterceptor authInterceptor() {
//        return new UserInterceptor();
//    }

//    @Bean
//    @Qualifier("DS_beforeCreate")
//    public Consumer<Map<String, Object>> beforeCreate() {
//        return Version.isDebug ? BaseCrudPlugins.beforeCreate : DisableWritePlugins.beforeCreate;
//    }
//
//    @Bean
//    @Qualifier("DS_beforeUpdate")
//    public Consumer<Map<String, Object>> beforeUpdate() {
//        return Version.isDebug ? BaseCrudPlugins.beforeUpdate : DisableWritePlugins.beforeUpdate;
//    }
//
//    @Bean
//    @Qualifier("DS_beforeDelete")
//    public BiFunction<Boolean, String, String> beforeDelete() {
//        return Version.isDebug ? BaseCrudPlugins.beforeDelete : DisableWritePlugins.beforeDelete;
//    }
    @Bean
    public EndpointMgr initEndpointMgr() {
        Group group = new Group();
        group.setId(1);
        group.setUrl("/foo");

        List<Group> groups = ObjectHelper.listOf(group);

        Endpoint endpoint = new Endpoint();
        endpoint.setId(1);
        endpoint.setGroupId(1);
        endpoint.setUrl("/bar");
        endpoint.setActionType(ActionType.INFO);
        endpoint.setSql("select * from shop_address where id = #{id}");
        endpoint.setMethod(HttpMethod.GET);

        Endpoint endpoint1 = new Endpoint();
        endpoint1.setId(2);
        endpoint1.setGroupId(1);
        endpoint1.setUrl("/");
        endpoint1.setActionType(ActionType.LIST);
        endpoint1.setSql("select * from shop_address");
        endpoint1.setMethod(HttpMethod.GET);

        Endpoint endpoint2 = new Endpoint();
        endpoint2.setId(3);
        endpoint2.setGroupId(1);
        endpoint2.setUrl("/patch/{id}");
        endpoint2.setActionType(ActionType.INFO);
        endpoint2.setSql("select * from shop_address where id = ?");
        endpoint2.setMethod(HttpMethod.GET);

        Endpoint endpoint3 = new Endpoint();
        endpoint3.setId(4);
        endpoint3.setGroupId(1);
        endpoint3.setUrl("/patch");
        endpoint3.setActionType(ActionType.CREATE);
        endpoint3.setTableName("shop_address");
        endpoint3.setAutoIns(true);
        endpoint3.setAutoSql(true);
        endpoint3.setMethod(HttpMethod.POST);

        Endpoint endpoint4 = new Endpoint();
        endpoint4.setId(5);
        endpoint4.setGroupId(1);
        endpoint4.setUrl("/patch");
        endpoint4.setActionType(ActionType.UPDATE);
        endpoint4.setTableName("shop_address");
        endpoint4.setIdField("id");
        endpoint4.setAutoSql(true);
//        endpoint3.setSql("select * from shop_address where id = ?");
        endpoint4.setMethod(HttpMethod.PUT);

        Endpoint endpoint5 = new Endpoint();
        endpoint5.setId(6);
        endpoint5.setGroupId(1);
        endpoint5.setUrl("/update/{id}");
        endpoint5.setActionType(ActionType.UPDATE);
        endpoint5.setTableName("shop_address");
        endpoint5.setIdField("id");
        endpoint5.setAutoSql(false);
        endpoint5.setSql("UPDATE shop_address SET name = #{name} where id = ?");
        endpoint5.setMethod(HttpMethod.PUT);

        Endpoint endpoint6 = new Endpoint();
        endpoint6.setId(7);
        endpoint6.setGroupId(1);
        endpoint6.setUrl("/create");
        endpoint6.setActionType(ActionType.CREATE);
        endpoint6.setTableName("shop_address");
        endpoint6.setAutoSql(false);
        endpoint6.setAutoIns(true);
        endpoint6.setSql("INSERT INTO shop_address (name, address) VALUES (#{name}, #{address});");
        endpoint6.setMethod(HttpMethod.POST);

        List<Endpoint> endpoints = ObjectHelper.listOf(endpoint, endpoint1,
                endpoint2, endpoint3, endpoint4, endpoint5, endpoint6);

        return EndpointMgr.init(groups, endpoints);
    }
}