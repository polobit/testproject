package com.agilecrm.util.email;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.TimeZone;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.codehaus.jackson.JsonFactory;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.JsonParser;
import org.codehaus.jackson.map.MappingJsonFactory;
import org.json.JSONObject;

import com.agilecrm.account.util.AccountPrefsUtil;
import com.agilecrm.util.FileStreamUtil;
import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Template;

public class HandlebarsUtil {
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
     *            template file having handlebars keywords.
     * @param json
     *            JSONObject that replaces mustaches.
     * @return replaced template.
     **/
    public static String compile(String template, JSONObject json)
    {
	try
	{
		long start_time = System.currentTimeMillis();
		
	    // Convert Object into Map
	    JsonParser parser = JSON_FACTORY.createJsonParser(json.toString());
	    JsonNode jsonNode = parser.readValueAsTree();
	    Object object = toObject(jsonNode);
	    System.out.println(object);
	    
	    Handlebars handlebars = defaultHandlebars();
	    Template temp = handlebars.compileInline(template);
	       
	    String out =  temp.apply(object).toString();
	    long end_time = System.currentTimeMillis();
	    System.out.println("time for handlebars compilation"+(end_time-start_time)+"ms");
	    return out;

	}
	catch (Exception e)
	{
		System.out.println(ExceptionUtils.getFullStackTrace(e));
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
    
    /**
     * it works as initiate loop to add one by one custom handlebar helpers
     * to the Handlebars
     * 
     * @return
     *        
     */
    
    public static Handlebars newHandlebarsWithLoopSupport(){
    	Handlebars handlebars = new Handlebars();
    	handlebars.infiniteLoops(true);
    	return handlebars;
    }
    
    /**
     * 
     * @param handlebars
     * 
     * @return
     *       -custom handlebar helpers 
     */
    
    public static Handlebars withHelpers(Handlebars handlebars){
    	handlebars.registerHelper("safeVal", HandlebarsHelpers.firstNameHelper());
    	handlebars.registerHelper("safeStr", HandlebarsHelpers.safeStringHelper());
    	return handlebars;
    }
    /**
     * 
     * @return
     *        -including all custom handlebar helpers
     */
    public static Handlebars defaultHandlebars() { 
        return withHelpers(newHandlebarsWithLoopSupport()); 
      } 

    /** Example */
    public static void main(String[] args) throws Exception
    {
	JSONObject json = new JSONObject();
	json.put("first_name", "santhosh");
	
	String template = "{{first_name}}";
	System.out.println(compile(template, json));
    }

}
