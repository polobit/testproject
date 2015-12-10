package com.agilecrm.account;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * <code>NavbarConstants</code> contains menu navbars options with heading,
 * anchor link and icon to be shown
 * 
 * @author Yaswanth
 * 
 */
public enum NavbarConstants
{

    CONTACT("Contacts", "#contacts", "icon-user", "contactsmenu"),

    CALENDAR("Calendar", "#calendar", "icon-calendar", "calendarmenu"),

    DEALS("Deals", "#deals", "icon-money", "dealsmenu"),

    CAMPAIGN("Campaigns", "#workflows", "icon-sitemap", "workflowsmenu"),

    CASES("Cases", "#cases", "icon-folder-close", "casesmenu"),

    SOCIAL("Social", "#social", "icon-comments", "socialsuitemenu"),

    WEBRULE("Web Rules", "#web-rules", "icon-globe", "web-rules-menu"),

    DOCUMENT("Documents", "#documents", "icon-file", "documentsmenu"),
    
    ACTIVITY("Activities", "#activities", "icon-cogs", "activitiesmenu"),

    REPORT("Reports", "#reports", "icon-bar-chart", "reportsmenu");

    public String heading = null;
    public String href = null;
    public String icon = null;
    public String id = null;

    private NavbarConstants(String heading, String href, String icon, String id)
    {
	this.heading = heading;
	this.href = href;
	this.icon = icon;
	this.id = id;
    }

    public static List<NavbarConstants> customValues()
    {
	List<NavbarConstants> defaultScopes = new ArrayList<NavbarConstants>(Arrays.asList(NavbarConstants.values()));
	// defaultScopes.remove(NavbarConstants.CONTACT);

	return defaultScopes;
    }
}
