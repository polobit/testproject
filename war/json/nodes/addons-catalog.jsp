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
    String[] EMAIL_CATALOG = {"json/nodes/email/send_email.jsp","json/nodes/email/ab.js", "json/nodes/common/wait.js", "json/nodes/email/clicked.js","json/nodes/email/opened.js"};
    String[] UTILITIES_CATALOG = {"json/nodes/common/close_case.js","json/nodes/crm/has_deal.js","json/nodes/common/change_deal_milestone.js","json/nodes/common/check_tags.js","json/nodes/crm/set_owner.jsp","json/nodes/crm/transfer.jsp"};
    /* String[] MOBILE_CATALOG = { "json/nodes/sms/sendmessage.js",
		    "json/nodes/sms/getmessage.js", "json/nodes/sms/menusms.js" };  */
    String[] DEVELOPERS_CATALOG = { "json/nodes/developers/jsonio.js", "json/nodes/developers/condition.js"};
    String[] CRM_CATALOG = {"json/nodes/crm/adddeal.jsp","json/nodes/crm/addnote.js","json/nodes/crm/addtask.jsp","json/nodes/common/add_case.js","json/nodes/crm/tags.js", "json/nodes/common/score.js", "json/nodes/crm/notify.js"};
    String[] SOCIAL_CATALOG = {"json/nodes/social/tweet.js"};
    String [] WEB_CATALOG = {"json/nodes/common/url.js"};

    // Download Each Catalog
    JSONArray jsonArray = new JSONArray();

    String[] target = {};

    String type = request.getParameter("type");

    if (type != null)
		type = type.toLowerCase().replace("addons", "");

    System.out.println("Type  " + type);
    
    String domain = NamespaceManager.get();
    
    try
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
	}
    
    
    if (type.equalsIgnoreCase("crm"))
		target = CRM_CATALOG;
   /*  else if (type.equalsIgnoreCase("mobile"))
		target = MOBILE_CATALOG; */
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
		// If jsp file, get executed contents
        if(path.contains(".jsp"))
        {
            contents = HTTPUtil.accessURL(URL.replace(URI, "/") + path);
            //System.out.println(contents);
        }
        else
        {
            // Read each path locally from context
            File f = new File(path);
		    is = new FileInputStream(f);
		    
		    contents = IOUtils.toString(is, "UTF-8");
        }
        
		try
		{
		    //JSONObject nodeData = new JSONObject(contents);

		    jsonArray.put(new JSONObject().put("jsonsrc", "/" + path).put(
			    "json", contents));
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

    try
   	{
   	    // Add nodes array to cache
   	 	CacheUtil.setCache(domain + "_addons_" + type, jsonArray.toString(), 3600000);
   	}
   	catch (Exception e)
   	{
   	    e.printStackTrace();
   	    System.err.println("Exception occured while setting addon nodes in cache... " + e.getMessage());
   	}
      
    out.println(jsonArray);
%>