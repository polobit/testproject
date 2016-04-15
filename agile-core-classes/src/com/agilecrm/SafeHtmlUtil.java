package com.agilecrm;

import java.text.Normalizer;

import jregex.REFlags;
import jregex.Replacer;

public class SafeHtmlUtil {

public static String sanitize(String raw)
{
if (raw==null || raw.length()==0)
return raw;
 
return HTMLEntityEncode(canonicalize(raw));
}
 
 
private static jregex.Pattern scriptPattern = new jregex.Pattern("script", REFlags.IGNORE_CASE);
private static Replacer scriptReplacer = scriptPattern.replacer("&#x73;cript");
 
public static String HTMLEntityEncode(String input)
{
String next = scriptReplacer.replace(input);
 
StringBuffer sb = new StringBuffer();
for ( int i = 0; i < next.length(); ++i )
{
char ch = next.charAt( i );
 
if (ch=='<')
sb.append("&lt;");
else if (ch=='>')
sb.append("&gt;");
else
sb.append(ch);
}
 
return sb.toString();
}
 
 
// "Simplifies input to its simplest form to make encoding tricks more difficult"
// though it didn't do seem to do anything to hex or html encoded characters... *shrug* maybe for unicode?
public static String canonicalize( String input )
{
String canonical = Normalizer.normalize(input, Normalizer.Form.NFC);
return canonical;
}
}