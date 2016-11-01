package com.agilecrm.util;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Attribute;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class HTMLUtil
{

	/**
	 * Removes Script from HTML content
	 * 
	 * @param html
	 * @return
	 */
	public static String removeScriptFromHtmltext(String html)
	{
		Document doc = Jsoup.parseBodyFragment(html, "UTF-8");
		
		//removes script element from HTML content
		doc.select("script").remove();
		
		//removes onclick events from HTML content
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
