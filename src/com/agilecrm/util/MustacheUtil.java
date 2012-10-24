package com.agilecrm.util;

import java.io.StringReader;
import java.io.StringWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.MappingJsonFactory;
import org.json.JSONObject;

import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;

public class MustacheUtil
{

    private static final JsonFactory JSON_FACTORY = new MappingJsonFactory();

    public static Object toObject(final JsonNode node)
    {
	if (node.isArray())
	{
	    return new ArrayList()
	    {
		{
		    for (JsonNode jsonNodes : node)
		    {
			add(toObject(jsonNodes));
		    }
		}
	    };
	}
	else if (node.isObject())
	{
	    return new HashMap()
	    {
		{
		    for (Iterator<Map.Entry<String, JsonNode>> i = node
			    .getFields(); i.hasNext();)
		    {
			Map.Entry<String, JsonNode> next = i.next();
			Object o = toObject(next.getValue());
			put(next.getKey(), o);
		    }
		}
	    };
	}
	else if (node.isBoolean())
	{
	    return node.getBooleanValue();
	}
	else if (node.isNull())
	{
	    return null;
	}
	else
	{
	    return node.asText();
	}
    }

    public static String compile(String template, JSONObject json)
    {
	try
	{
	    // Convert Object into Map
	    JsonParser parser = JSON_FACTORY.createJsonParser(json.toString());
	    JsonNode jsonNode = parser.readValueAsTree();
	    Object object = toObject(jsonNode);

	    // Compile Source
	    MustacheFactory mf = new DefaultMustacheFactory();
	    Mustache mustache = mf.compile(new StringReader(template),
		    "example");

	    // Execute
	    StringWriter out = new StringWriter();
	    mustache.execute(out, object);
	    return out.toString();
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    return null;
	}
    }

    public static void main(String[] args) throws Exception
    {
	JSONObject json = new JSONObject();
	json.put("name", "Mustache");

	String template = "{{name}}, {{feature.description}}!";
	System.out.println(MustacheUtil.compile(template, json));
    }
}
