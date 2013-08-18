package com.agilecrm.util;

import org.codehaus.jackson.map.ObjectMapper;

public class JSONUtil
{
    public static String toJSONString(Object obj)
    {
	ObjectMapper mapper = new ObjectMapper();
	String json;
	try
	{
	    json = mapper.writeValueAsString(obj);
	    return json;
	}
	catch (Exception e)
	{
	    System.out.println(e.getMessage());
	    return "";
	}
    }
}