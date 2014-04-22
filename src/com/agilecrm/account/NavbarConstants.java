package com.agilecrm.account;

/**
 * <code>NavbarConstants</code> contains menu navbars options with heading,
 * anchor link and icon to be shown
 * 
 * @author Yaswanth
 * 
 */
public enum NavbarConstants
{

    CONTACT("Contacts", "#contacts", "icon-user"),

    CALENDAR("Calendar", "#calendar", "icon-calendar"),

    DEALS("Deals", "#deals", "icon-money"),

    CAMPAIGN("Campaigns", "#workflows", "icon-sitemap"),

    CASES("Cases", "#cases", "icon-folder-close"),

    SOCIAL("Social", "#social", "icon-comments"),

    WEBRULE("Web Rules", "#web-rules", "icon-globe"),

    DOCUMENT("Documents", "#documents", "icon-file"),

    REPORT("Reports", "#reports", "icon-bar-chart");

    public String heading = null;
    public String href = null;
    public String icon = null;

    private NavbarConstants(String heading, String href, String icon)
    {
	this.heading = heading;
	this.href = href;
	this.icon = icon;
    }
}
