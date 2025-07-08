package org.foo;


import com.ajaxjs.dataservice.crud.CrudService;
import com.ajaxjs.dataservice.jdbchelper.JdbcConn;
import com.ajaxjs.dataservice.jdbchelper.JdbcReader;
import com.ajaxjs.dataservice.jdbchelper.JdbcWriter;
import com.ajaxjs.framework.Version;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.config.annotation.InterceptorRegistration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.sql.DataSource;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Consumer;

/**
 * 程序配置
 */
@Configuration
public class BaseConfiguration implements WebMvcConfigurer {
    @Value("${db.url}")
    private String url;

    @Value("${db.user}")
    private String user;

    @Value("${db.psw}")
    private String psw;

    @Bean(value = "dataSource", destroyMethod = "close")
    DataSource getDs() {
        return JdbcConn.setupJdbcPool("com.mysql.cj.jdbc.Driver", url, user, psw);
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public JdbcWriter jdbcWriter() {
        JdbcWriter jdbcWriter = new JdbcWriter();
        jdbcWriter.setIdField("id");
        jdbcWriter.setIsAutoIns(true);
        jdbcWriter.setConn(JdbcConn.getConnection());

        return jdbcWriter;
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public JdbcReader jdbcReader() {
        JdbcReader jdbcReader = new JdbcReader();
        jdbcReader.setConn(JdbcConn.getConnection());

        return jdbcReader;
    }

    @Bean
    @Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
    public CrudService getCRUD_Service() {
        CrudService crud = new CrudService();
        crud.setWriter(jdbcWriter());
        crud.setReader(jdbcReader());

        return crud;
    }

    @Value("${auth.excludes: }")
    private String excludes;

    /**
     * 加入认证拦截器
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        InterceptorRegistration interceptorRegistration = registry.addInterceptor(authInterceptor());
        interceptorRegistration.addPathPatterns("/**"); // 拦截所有

        // 不需要的拦截路径
        if (StringUtils.hasText(excludes)) {
            String[] arr = excludes.split("\\|");
            interceptorRegistration.excludePathPatterns(arr);
        }
    }

    /**
     * 用户全局拦截器
     */
    @Bean
    UserInterceptor authInterceptor() {
        return new UserInterceptor();
    }

    @Bean
    @Qualifier("DS_beforeCreate")
    public Consumer<Map<String, Object>> beforeCreate() {
        return Version.isDebug ? BaseCrudPlugins.beforeCreate : DisableWritePlugins.beforeCreate;
    }

    @Bean
    @Qualifier("DS_beforeUpdate")
    public Consumer<Map<String, Object>> beforeUpdate() {
        return Version.isDebug ? BaseCrudPlugins.beforeUpdate : DisableWritePlugins.beforeUpdate;
    }

    @Bean
    @Qualifier("DS_beforeDelete")
    public BiFunction<Boolean, String, String> beforeDelete() {
        return Version.isDebug ? BaseCrudPlugins.beforeDelete : DisableWritePlugins.beforeDelete;
    }
}