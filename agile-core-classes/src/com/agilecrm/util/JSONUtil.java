package com.agilecrm.util;

import java.util.Iterator;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;

public class JSONUtil
{
	public static String getJSONValue(JSONObject obj, String keyName)
    {
		try {
			if(obj.has(keyName))
				  return obj.getString(keyName);
		} catch (Exception e) {
		}
		
		return null;
	
    }
	
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

    /**
     * Merges array of JSONObjects into a single JSONObject.
     * 
     * @param objs
     *            Array of JSONObjects (not JSONArray).
     * @return single merge JSONOobject.
     */
    @SuppressWarnings("rawtypes")
    public static JSONObject mergeJSONs(JSONObject[] objs)
    {
	JSONObject merged = new JSONObject();
	try
	{
	    for (JSONObject obj : objs)
	    {
		Iterator it = obj.keys();
		while (it.hasNext())
		{
		    String key = (String) it.next();
		    merged.put(key, obj.get(key));
		}
	    }
	}
	catch (Exception e)
	{
	    System.out.println("Exception in mergeJSON");
	}

	return merged;
    }
}