package com.ajaxjs.dataservice.core;

import com.ajaxjs.dataservice.metadata.model.DataSourceInfo;
import com.ajaxjs.framework.spring.DiContextUtil;
import com.ajaxjs.sqlman.JdbcConnection;
import com.ajaxjs.sqlman.util.Utils;
import com.ajaxjs.util.ConvertBasicValue;
import com.ajaxjs.util.Version;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Utils for DataService
 */
@Slf4j
public class DataServiceUtils {
    /**
     * 获取查询字符串参数。
     * 从当前请求中提取查询参数，并将其转换为 Map 形式返回，键为参数名，值为参数值。
     * 如果参数值为数组，则只取第一个值进行处理。处理过程中，会对参数值进行 SQL 注入的防范处理。
     * 如果没有查询参数，则返回 null。
     *
     * @return 包含查询参数的Map，如果不存在查询参数则返回 null
     */
    public static Map<String, Object> getQueryStringParams() {
        HttpServletRequest request = DiContextUtil.getRequest();
        assert request != null;
        Map<String, String[]> parameterMap = request.getParameterMap(); // 获取请求中的所有参数，包括参数名和参数值的数组

        if (ObjectUtils.isEmpty(parameterMap)) // 如果参数Map为空，则直接返回 null
            return null;

        // 初始化一个Map用于存储处理后的参数
        Map<String, Object> params = new HashMap<>();
        // 遍历参数Map，将参数值转换为 Java 基本类型，并处理可能的 SQL 注入
        parameterMap.forEach((key, value) -> params.put(key, value == null ? null : ConvertBasicValue.toJavaValue(Utils.escapeSqlInjection(value[0]))));

        return params;
    }

    /**
     * 执行对象上的指定方法，并返回方法的执行结果。
     *
     * @param obj        要执行方法的对象实例
     * @param methodName 要执行的方法的名称
     * @param clz        期望的返回类型
     * @param <T>        期望的返回类型
     * @return 方法执行的结果，其类型为参数 clz 指定的类型
     * @throws RuntimeException 如果无法找到方法、访问方法失败或方法调用抛出异常，则抛出此运行时异常
     */
    @SuppressWarnings("unchecked")
    public static <T> T executeMethod(Object obj, String methodName, Class<T> clz) {
        try {
            Method method = obj.getClass().getMethod(methodName);// 获取对象的类，然后通过方法名查找并返回方法对象。
            Object result = method.invoke(obj); // 调用方法并获取结果

            return (T) result;// 将结果强制转换为期望的类型并返回
        } catch (NoSuchMethodException e) {
            log.warn("There is NO such method when calling " + methodName, e);
            return null;
        } catch (IllegalAccessException | InvocationTargetException e) {
            throw new RuntimeException(e); // 如果在执行过程中遇到异常，则将其封装并抛出为运行时异常
        }
    }

    /**
     * 获取上下文当前用户
     * IAM 的 SimpleUser 这里不通用于是用反射获取（一个方案是用 map，但麻烦）
     * 该方法会从请求中获取名为"USER_KEY_IN_REQUEST"的属性，该属性预期为一个简单的用户对象。
     * 如果该属性不存在会抛出 NullPointerException。
     *
     * @return 上下文当前用户
     * @throws NullPointerException 如果请求中不存在名为"USER_KEY_IN_REQUEST"的属性，表示用户不存在。
     */
    public static Object getCurrentUser() {
        // 从请求中获取名为"USER_KEY_IN_REQUEST"的属性，确保该属性不为空
//        if (simpleUser == null)
//            throw new NullPointerException("上下文的用户不存在"); // 如果用户对象为空，则抛出异常
        Object user = Objects.requireNonNull(DiContextUtil.getRequest()).getAttribute("USER_KEY_IN_REQUEST");

        if (user == null && Version.isDebug)
            user = new Object();

        if (user == null)
            log.warn("User not found.");

        return user;
    }

    /**
     * 获取当前用户的 ID。
     *
     * @return 当前用户的 ID，类型为 long。
     */
    public static long getCurrentUserId() {
        return executeMethod(getCurrentUser(), "getId", long.class);// 调用用户对象的 getId 方法，返回用户的 ID
    }

    /**
     * 获取当前用户的租户 ID。
     *
     * @return 当前用户的租户 ID，类型为 long。
     */
    public static Integer getCurrentUserTenantId() {
        return executeMethod(getCurrentUser(), "getTenantId", Integer.class);// 调用用户对象的 getId 方法，返回用户的 ID
    }

    /**
     * 初始化参数的封装方法。
     * 这是一个重载方法，调用的是另一个具有三个参数的 initParams 方法，其中最后一个参数默认为 false。
     *
     * @param params 参数集合，以键值对的形式存储不同的参数
     * @return 返回一个初始化后的参数集合 Map
     */
    public static Map<String, Object> initParams(Map<String, Object> params) {
        return initParams(params, false);
    }

    /**
     * 初始化参数
     *
     * @param params           原始参数映射
     * @param isFormSubmitOnly 是否仅处理表单提交的参数
     * @return 处理后的参数映射
     */
    public static Map<String, Object> initParams(Map<String, Object> params, boolean isFormSubmitOnly) {
        if (isFormSubmitOnly) {
            HttpServletRequest req = DiContextUtil.getRequest();
            String queryString = req.getQueryString(); // 获取查询字符串

            // 解码查询字符串并处理参数
            if (StringUtils.hasText(queryString)) {
                queryString = StringUtils.uriDecode(queryString, StandardCharsets.UTF_8);
                String[] parameters = queryString.split("&");

                for (String parameter : parameters) {// 从 params 中移除查询字符串中的参数
                    String[] keyValuePair = parameter.split("=");
                    params.remove(keyValuePair[0]);
                }
            }
        }

        Map<String, Object> _params = new HashMap<>(); // 创建新的参数映射，并将原始参数转换为指定格式
        params.forEach((key, value) -> _params.put(Utils.changeFieldToColumnName(key), ConvertBasicValue.toJavaValue(value.toString())));

        return _params;
    }
}