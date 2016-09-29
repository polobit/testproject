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
		 Document doc = Jsoup.parseBodyFragment(html.replaceAll("\n", "_br2n_"), "UTF-8");
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
			
			html = doc.body().text().replaceAll("_br2n_", "\n");
	
		 return html;
		
	}
	
}
