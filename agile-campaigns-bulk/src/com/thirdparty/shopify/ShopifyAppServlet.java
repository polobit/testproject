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
		redirectURL = new String("https://widgets.agilecrm.com/shopify/index.php?" + request.getQueryString() + "&error=");
	    }
	    else
	    {
		redirectURL = new String("https://widgets.agilecrm.com/shopify/index.php?" + request.getQueryString() + "&error=true");
	    }
	}
	else if (StringUtils.equals(fromAppPreferences, "yes"))
	{
	    redirectURL = new String("https://" + agileDomain + ".agilecrm.com/#web-rules");
	}
	else
	{
	    if (StringUtils.isBlank(agileDomain))
		redirectURL = new String("https://widgets.agilecrm.com/shopify/index.php?" + request.getQueryString());
	    else
	    {
		NamespaceManager.set(agileDomain);
		redirectURL = new String("https://" + agileDomain + ".agilecrm.com/#shopify/" + shopUrl);
	    }
	}
	response.setContentType("text/html");
	response.setStatus(HttpServletResponse.SC_MOVED_TEMPORARILY);
	response.sendRedirect(response.encodeRedirectURL(redirectURL));
	return;
    }
}