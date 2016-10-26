package com.thirdparty.shopify;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.agilecrm.shopify.util.ShopifyAppUtil;
import com.google.appengine.api.NamespaceManager;

@SuppressWarnings("serial")
public class ShopifyAppServlet extends HttpServlet
{
	public static final String SHOPIFY_HOST_URL = "https://widgets.agilecrm.com/shopify/index.php";
	
    public void service(HttpServletRequest request, HttpServletResponse response) throws IOException
    {
	String shopUrl = request.getParameter("shop");
	String domainFromURL = request.getParameter("agile_domain");
	String agileDomain = ShopifyAppUtil.getDomainByShop(shopUrl);
	String fromAppPreferences = request.getParameter("pref");
	String fromIndex = request.getParameter("i");
	String redirectURL;

	if (StringUtils.equals(fromIndex, "yes"))
	{
	    String shopFromDb = ShopifyAppUtil.getShopFromDomain(domainFromURL);
	    if (StringUtils.isBlank(shopFromDb))
	    {
		redirectURL = new String("?" + request.getQueryString() + "&error=");
	    }
	    else
	    {
		redirectURL = new String(SHOPIFY_HOST_URL + "?" + request.getQueryString() + "&error=true");
	    }
	}
	else if (StringUtils.equals(fromAppPreferences, "yes"))
	{
	    redirectURL = new String("https://" + agileDomain + ".agilecrm.com/#web-rules");
	}
	else
	{
	    if (StringUtils.isBlank(agileDomain))
		redirectURL = new String(SHOPIFY_HOST_URL + "?" + request.getQueryString());
	    else
	    {
		NamespaceManager.set(agileDomain);
		redirectURL = new String("https://" + agileDomain + ".agilecrm.com/#shopify/" + shopUrl);
	    }
	}
	response.setContentType("text/html");
	response.setStatus(HttpServletResponse.SC_MOVED_TEMPORARILY);
	
	String encodedURL = response.encodeRedirectURL(redirectURL);
	try {
		encodedURL = encodedURL.replaceAll("([;&]jsessionid=\\w+)", "");
		System.out.println("encodedURL = " + encodedURL);
	} catch (Exception e) {
	}
	
	response.sendRedirect(encodedURL);
	return;
    }
}