<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="java.io.FileInputStream"%>
<%@page import="org.apache.commons.io.IOUtils"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.File"%>
<%@page import="org.json.JSONObject"%> 
<%@page import="org.json.JSONArray"%>
<%@page import="com.agilecrm.util.HTTPUtil"%>
<%@page import="com.agilecrm.util.CacheUtil"%>

<%
    // Get Catalog
    String[] EMAIL_CATALOG = {"json/nodes/email/addons/send_email.jsp","json/nodes/email/addons/ab.js", "json/nodes/email/addons/clicked.js","json/nodes/email/addons/opened.js","json/nodes/email/addons/replied.js"};
  	String[] UTILITIES_CATALOG = {"json/nodes/common/addons/wait.js","json/nodes/common/addons/wait_till.jsp","json/nodes/crm/addons/has_deal.js","json/nodes/common/addons/check_tags.js", "json/nodes/crm/addons/transfer.jsp","json/nodes/common/addons/time.js","json/nodes/developers/addons/new_condition.js","json/nodes/crm/addons/notify.js","json/nodes/crm/addons/check_campaign.js", "json/nodes/crm/addons/has_event.js","json/nodes/crm/addons/update_deal.js"};
    String[] MOBILE_CATALOG = { "json/nodes/sms/addons/sendmessage.js", "json/nodes/email/addons/clicked.js"};
		   /* ,"json/nodes/sms/getmessage.js", "json/nodes/sms/menusms.js" };  */
    String[] DEVELOPERS_CATALOG = { "json/nodes/developers/addons/jsonio.js", "json/nodes/developers/addons/new_condition.js","json/nodes/developers/addons/set_property.js"};
    String[] CRM_CATALOG = {"json/nodes/crm/addons/tags.js",  "json/nodes/crm/addons/set_owner.jsp","json/nodes/developers/addons/set_property.js", "json/nodes/common/addons/score.js","json/nodes/crm/addons/adddeal.jsp","json/nodes/crm/addons/addtask.jsp","json/nodes/crm/addons/addnote.js","json/nodes/common/addons/add_case.js","json/nodes/common/addons/change_deal_milestone.js","json/nodes/common/addons/close_case.js","json/nodes/common/addons/Unsubscribe.js","json/nodes/crm/addons/close_task.js", "json/nodes/crm/addons/add_event.js", "json/nodes/crm/addons/territory.js"};
    String[] SOCIAL_CATALOG = {"json/nodes/social/addons/tweet.js"};
    String[] WEB_CATALOG = {"json/nodes/common/addons/url.js"};

    // Download Each Catalog
    JSONArray jsonArray = new JSONArray();

    String[] target = {};

    String type = request.getParameter("type");

    if (type != null)
		type = type.toLowerCase().replace("addons", "");

    System.out.println("Type  " + type);
    
    String domain = NamespaceManager.get();
    
    /* try
	{
        
		String cachedAddons = (String) CacheUtil.getCache(domain + "_addons_" + type);

		if(cachedAddons != null)
		{
		    System.out.println("Addon nodes obtained from cache...");

		    jsonArray = new JSONArray(cachedAddons);
		    out.println(jsonArray);
		    return;
		}
	}
	catch (Exception e)
	{
	    e.printStackTrace();
	    System.err.println("Exception occured while getting addon nodes from cache... " + e.getMessage());
	} */
    
    
    if (type.equalsIgnoreCase("crm"))
		target = CRM_CATALOG;
    else if (type.equalsIgnoreCase("mobile"))
		target = MOBILE_CATALOG; 
    else if (type.equalsIgnoreCase("email"))
		target = EMAIL_CATALOG;
    else if (type.equalsIgnoreCase("web"))
		target = WEB_CATALOG;
    else if (type.equalsIgnoreCase("social"))
		target = SOCIAL_CATALOG;
    else if (type.equalsIgnoreCase("utilities"))
	    target = UTILITIES_CATALOG;
    else if (type.equalsIgnoreCase("developers"))
	    target = DEVELOPERS_CATALOG;

    String contents = "";
    InputStream is = null;
    
    // Request URL and URI
    String URL = request.getRequestURL().toString();
    String URI = request.getRequestURI();
    
    for (String path : target)
    {
        // Read each path locally from context
        File f = new File(application.getRealPath("/")+ "/" + path);
		is = new FileInputStream(f);
		    
		contents = IOUtils.toString(is, "UTF-8");
        
		try
		{
		    JSONObject nodeData = new JSONObject(contents);

		    jsonArray.put(new JSONObject().put("jsonsrc", "/" + nodeData.getString("path")).put(
			    "json", nodeData));
		}
		catch(Exception e)
		{
		    System.err.println("Error in catalog " + e.getMessage());
		}
		finally
		{
		    if(is != null)
			IOUtils.closeQuietly(is);
		}
		
    }

   /*  try
   	{
   	    // Add nodes array to cache
   	 	CacheUtil.setCache(domain + "_addons_" + type, jsonArray.toString(), 3600000);
   	}
   	catch (Exception e)
   	{
   	    e.printStackTrace();
   	    System.err.println("Exception occured while setting addon nodes in cache... " + e.getMessage());
   	} */
      
    out.println(jsonArray);
%>