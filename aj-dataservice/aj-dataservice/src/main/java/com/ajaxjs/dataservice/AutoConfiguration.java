package com.ajaxjs.dataservice;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "com.ajaxjs.dataservice")
public class AutoConfiguration implements ApplicationContextAware {
    /**
     * Spring 上下文
     */
    public static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext context) throws BeansException {
        AutoConfiguration.context = context;
    }

    /**
     * 获取上下文
     *
     * @return 上下文对象
     */
    public static <T> T getBean(Class<T> clz) {
        return context.getBean(clz);
    }
}
