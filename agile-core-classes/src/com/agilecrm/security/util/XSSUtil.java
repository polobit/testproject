package com.agilecrm.security.util;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.regex.Pattern;

import javax.ws.rs.core.MultivaluedMap;

import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

public class XSSUtil
{

    public static MultivaluedMap peventXSSOnParamValues(MultivaluedMap map)
    {
	if (map == null || map.isEmpty())
	    return map;

	for (Iterator iterator = map.keySet().iterator(); iterator.hasNext();)
	{
	    String key = (String) iterator.next();
	    List valueList = (List) map.get(key);

	    if (valueList == null || valueList.size() == 0)
		continue;

	    List modifiedList = new ArrayList();
	    for (Iterator iterator2 = valueList.iterator(); iterator2.hasNext();)
	    {
		String object = (String) iterator2.next();
		object = stripXSS(object);
		modifiedList.add(object);
	    }

	    map.put(key, modifiedList);
	}

	return map;

    }

    /**
     * 
     * @param value
     * @return
     */
    public static String stripXSS(String value)
    {
	if (value == null)
	    return null;

	// NOTE: It's highly recommended to use the ESAPI library to
	// avoid encoded attacks.
	try
	{
	    value = Jsoup.clean(value, Whitelist.basic());
	    value = value.replace("<", "&lt;").replace(">", "&gt;");

	}
	catch (Exception e)
	{
	    e.printStackTrace();
	}

	// Avoid anything between script tags
	Pattern scriptPattern = Pattern.compile("<script>(.*?)</script>", Pattern.CASE_INSENSITIVE);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid alerts
	scriptPattern = Pattern.compile("alert(.*?)[(.*?)]", Pattern.CASE_INSENSITIVE);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid confirms
	scriptPattern = Pattern.compile("confirm(.*?)[(.*?)]", Pattern.CASE_INSENSITIVE);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid prompts
	scriptPattern = Pattern.compile("prompt(.*?)[(.*?)]", Pattern.CASE_INSENSITIVE);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid anything in a location='...' type of expression
	scriptPattern = Pattern.compile("location[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE
		| Pattern.MULTILINE | Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid anything in a src='...' type of expression
	scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
		| Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	scriptPattern = Pattern.compile("src[\r\n]*=[\r\n]*\\\"(.*?)\\\"", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
		| Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	// Remove any lonesome </script> tag
	scriptPattern = Pattern.compile("</script>", Pattern.CASE_INSENSITIVE);
	value = scriptPattern.matcher(value).replaceAll("");

	// Remove any lonesome <script ...> tag
	scriptPattern = Pattern.compile("<script(.*?)>", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid eval(...) expressions
	scriptPattern = Pattern.compile("eval\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
		| Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid expression(...) expressions
	scriptPattern = Pattern.compile("expression\\((.*?)\\)", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE
		| Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid javascript:... expressions
	scriptPattern = Pattern.compile("javascript:", Pattern.CASE_INSENSITIVE);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid vbscript:... expressions
	scriptPattern = Pattern.compile("vbscript:", Pattern.CASE_INSENSITIVE);
	value = scriptPattern.matcher(value).replaceAll("");

	// Avoid onload= expressions
	scriptPattern = Pattern.compile("onload(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	return value;
    }

    /**
     * 
     * @param responseMessage
     * @return
     */
    public static String stripXSSToCbk(String value)
    {

	// Avoid javascript:... expressions
	Pattern scriptPattern = Pattern.compile("document.", Pattern.CASE_INSENSITIVE);
	value = scriptPattern.matcher(value).replaceAll("");

	scriptPattern = Pattern
		.compile("location(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	scriptPattern = Pattern.compile("write(.*?)=", Pattern.CASE_INSENSITIVE | Pattern.MULTILINE | Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	scriptPattern = Pattern.compile("window.[\r\n]*=[\r\n]*\\\'(.*?)\\\'", Pattern.CASE_INSENSITIVE
		| Pattern.MULTILINE | Pattern.DOTALL);
	value = scriptPattern.matcher(value).replaceAll("");

	value = value.replace("<", "").replace(">", "").replace("\"", "").replace("'", "").replace("=", "")
		.replace("(", "").replace(")", "");

	return value;

    }

    public static void main(String[] args)
    {
	System.out.println(stripXSSToCbk(Jsoup.parse("<script>alert(123);</script>").toString()));

    }
}
