package com.agilecrm.util.email;

import java.io.StringReader;
import java.io.StringWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.TimeZone;

import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.MappingJsonFactory;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.util.FileStreamUtil;
import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;

/**
 * <code>MustacheUtil</code> is the base to compile Mustache templates.
 * MustacheUtil merges array of JSONObjects into single JSONObject. Uses
 * mustache compiler to compile mustache templates. JSONObject is converted to
 * JSONNode using JSONFactory inorder to convert JSONObject into Map Object.
 * 
 * @author Manohar
 * 
 */
public class MustacheUtil
{

    /**
     * The main factory class of Jackson package, used to configure and
     * construct reader (aka parser, JsonParser) and writer (aka generator,
     * JsonGenerator) instances.
     */
    private static final JsonFactory JSON_FACTORY = new MappingJsonFactory();

    /**
     * Gets template file using Util class and compiles template with
     * JSONObject.
     * 
     * @param path
     *            path of the template file.
     * @param emailJson
     *            Merged JSONObject.
     * @return replaced template file.
     * @throws Exception
     *             FileNotFoundException - if file cannot read from given path.
     */
    @SuppressWarnings("unused")
    public static String templatize(String path, JSONObject emailJson) throws Exception
    {
	// Read from path
	String emailTemplate = FileStreamUtil.readResource(SendMail.TEMPLATES_PATH + path);
	String value = null;
	if (emailTemplate == null)
	    return null;

	// Compile
	return compile(emailTemplate, emailJson);
    }

    /**
     * Replaces mustache values with respective json values.
     * 
     * @param template
     *            template file having mustache keywords.
     * @param json
     *            JSONObject that replaces mustaches.
     * @return replaced template.
     **/
    public static String compile(String template, JSONObject json)
    {
	try
	{
	    // Convert Object into Map
	    JsonParser parser = JSON_FACTORY.createJsonParser(json.toString());
	    JsonNode jsonNode = parser.readValueAsTree();
	    Object object = toObject(jsonNode);

	    // Compile Source using mustache compiler
	    MustacheFactory mf = new DefaultMustacheFactory();
	    Mustache mustache = mf.compile(new StringReader(template), "example");

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

    public static String convertDate(String format, Long epoch)
    {
	String timezone = AccountPrefsUtil.getAccountPrefs().timezone;
	if (format == null)
	    format = "EEE, MMM dd, yyyy";
	if (epoch > 0)
	{
	    Date d = new Date(epoch * 1000);
	    SimpleDateFormat df = new SimpleDateFormat(format);
	    df.setTimeZone(TimeZone.getTimeZone(timezone));
	    return df.format(d);
	}
	return "";
    }

    /**
     * Converts JSONNode into Map object. If JSONNode is array, it iterates
     * through the array and adds each object to map.
     * 
     * @param node
     *            JSONNode that is converted to map.
     * @return Map object of JsonNode.
     */
    @SuppressWarnings({ "unchecked", "serial", "rawtypes" })
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
		    for (Iterator<Map.Entry<String, JsonNode>> i = node.getFields(); i.hasNext();)
		    {
			Map.Entry<String, JsonNode> next = i.next();
			Object o = toObject(next.getValue());
			if (next.getKey().indexOf("time") > -1 || next.getKey().indexOf("date") > -1)
			{
			    try
			    {
				if (next.getValue().isNumber())
				{
				    Object d = convertDate("dd MMM, HH:mm", next.getValue().asLong());
				    put(next.getKey() + "_string", d);
				}
			    }
			    catch (Exception e)
			    {
				System.out.println("Exception in generating map for mustache - " + e.getMessage());
			    }

			}
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

    /** Example */
    public static void main(String[] args) throws Exception
    {
	JSONObject json = new JSONObject();
	json.put("name", "Mustache");

	String template = "{{name}}, {{feature.description}}!";
	System.out.println(MustacheUtil.compile(template, json));
    }
}