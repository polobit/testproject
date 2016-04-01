package com.agilecrm.util;

import java.io.UnsupportedEncodingException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

/**
 * Some tools for working with strings. Named so as not to conflict with apache
 * commons StringUtils.
 */
public class StringUtils2
{
    /**
     * Throws exception if value is null or empty or whitespace.
     * 
     * @return the trimmed, safe version of the string
     */
    public static String requireNotBlank(String value)
    {
	if (value == null)
	    throw new IllegalArgumentException("Value cannot be null");

	value = value.trim();

	if (value.length() == 0)
	    throw new IllegalArgumentException("Value cannot be blank");

	return value;
    }

    /**
     * Splits name into words. Normalizes to lower case.
     */
    public static Set<String> breakdownWords(String name)
    {
	String[] tokens = name.toLowerCase().split(" ");
	return new HashSet<String>(Arrays.asList(tokens));
    }

    /**
     * Splits name into words, and then fragments. Normalizes to lower case. For
     * example, the string "Foo Bar" would become: "f", "fo", "foo", "b", "ba",
     * "bar"
     */
    public static Set<String> breakdownFragments(String name)
    {
	Set<String> into = new HashSet<String>(name.length() * 2);

	String[] tokens = name.toLowerCase().split(" ");

	// Split all which are non-words
	// String[] tokens = name.toLowerCase().split("[\\W]");

	for (String token : tokens)
	    for (int i = 1; i <= token.length(); i++)
		into.add(token.substring(0, i));
	
	if (tokens !=null && tokens.length > 1 && name !=null)
	{
		into.add(name.replaceAll(" ", ""));
	}

	return into;
    }

    /**
     * Takes a normal string and turns it into something suitable for a title in
     * a URL. This is all about SEO. Basically, spaces go to dash and anything
     * that isn't URL-friendly gets stripped out.
     */
    public static String makeTitle(String title)
    {
	if (title == null)
	    return "";

	StringBuilder bld = new StringBuilder();

	for (int i = 0; i < title.length(); i++)
	{
	    char ch = title.charAt(i);

	    if (Character.isWhitespace(ch))
		bld.append('-');
	    else if (Character.isLetterOrDigit(ch))
		bld.append(ch);

	    // otherwise skip
	}

	// Strip out any extra -'s that might get generated
	String dedup = bld.toString().replaceAll("-+", "-");
	if (dedup.charAt(dedup.length() - 1) == '-')
	{
	    return dedup.substring(0, dedup.length() - 1);
	}
	return dedup;
    }

    /**
     * Without the stupid exception
     */
    public static byte[] getBytes(String str, String encoding)
    {
	try
	{
	    return str.getBytes(encoding);
	}
	catch (UnsupportedEncodingException ex)
	{
	    throw new RuntimeException(ex);
	}
    }

    /**
     * Without the stupid exception
     */
    public static byte[] getBytesUTF8(String str)
    {
	return getBytes(str, "UTF-8");
    }

    /**
     * Without the stupid exception
     */
    public static String newString(byte[] bytes, String encoding)
    {
	try
	{
	    return new String(bytes, encoding);
	}
	catch (UnsupportedEncodingException ex)
	{
	    throw new RuntimeException(ex);
	}
    }

    /**
     * Without the stupid exception
     */
    public static String newStringUTF8(byte[] bytes)
    {
	return newString(bytes, "UTF-8");
    }

    /**
     * This method is used to check for the null or empty parameters in string
     * array
     * 
     * @param params
     *            {@link String} array of parameters to be checked.
     * @return {@link Boolean} value false if parameters not null and true if
     *         even one parameter is null or empty
     */

    public static boolean isNullOrEmpty(String[] params)
    {

	// Check for null and empty
	for (String item : params)
	{

	    if (item == null || item.equals("null")
		    || item.trim().length() == 0)
		return true;
	}
	return false;
    }

    /**
     * Makes the given set of string as a single string and then splits into
     * words, again into fragments, which are normalized to lower case.
     * 
     * @param strings
     * @return set of fragmented strings
     */
    public static Set<String> getSearchTokens(Set<String> strings)
    {
        StringBuilder sb = new StringBuilder();
        for (String s : strings)
            sb.append(s + " ");
    
        String input = sb.toString();
    
        // Set<String> tokens = tokenize(input);
        return breakdownFragments(input);
    }
    
    /**
     * extracts all numeric characters from a string and return it.
     * mainly used for extracting phone number when there are special characters in that.
     * 
     * @param number
     * @return
     */
    public static String extractNumber(String number) {
		number = number.replaceAll("[^0-9]", "");
		return number;
	}
}