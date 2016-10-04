package com.agilecrm.util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class HTMLUtil
{
	 /*Removes Script from html 
	  * @params String html
	  * */	
	 public static String removeScriptFromPlaintext(String html)
	{
	
		 html = html.replaceAll("\n", "_br2n_");
		 
		 Document doc = Jsoup.parseBodyFragment(html);
		 doc.select("script").remove();
		
		 Elements all = doc.select("*");
			
			for (Element el : all)
			{
				for (Attribute attr : el.attributes())
				{
					String attrKey = attr.getKey();
					if (attrKey.startsWith("on"))
					{
						el.removeAttr(attrKey);
					}
				}
			}

			html = doc.body().toString().replaceAll("_br2n_", "\n");
			
			return html;
		
	}
	 public static String removeScriptFromHtmltext(String html)
		{
			 Document doc = Jsoup.parseBodyFragment(html, "UTF-8");
			 doc.select("script").remove();
			
			 Elements all = doc.select("*");
				
				for (Element el : all)
				{
					for (Attribute attr : el.attributes())
					{
						String attrKey = attr.getKey();
						if (attrKey.startsWith("on"))
						{
							el.removeAttr(attrKey);
						}
					}
				}
				
				html = doc.body().html();
		
			 return html;
			
		}
	
}
