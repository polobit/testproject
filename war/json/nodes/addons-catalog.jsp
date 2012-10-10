<%@page import="java.io.FileInputStream"%>
<%@page import="org.apache.commons.io.IOUtils"%>
<%@page import="java.io.InputStream"%>
<%@page import="java.io.File"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.json.JSONArray"%>
<%
    // Get Catalog
    String[] EMAIL_CATALOG = { "json/nodes/email/send_email.jsp",
		    "json/nodes/email/ab.js", "json/nodes/email/clicked.js",
		    "json/nodes/email/sex.js" };
    String[] UTILITIES_CATALOG = { "json/nodes/common/wait.js",
		    "json/nodes/common/score.js", "json/nodes/common/tags.js",
		    "json/nodes/common/transfer.js",
		    "json/nodes/social/tweet.js" };
    String[] MOBILE_CATALOG = { "json/nodes/sms/sendmessage.js",
		    "json/nodes/sms/getmessage.js", "json/nodes/sms/menusms.js" };
    String[] DEVELOPERS_CATALOG = { "json/nodes/developers/jsonio.js",
		    "json/nodes/developers/condition.js" };
    String[] CRM_CATALOG = { "json/nodes/crm/addnote.js",
		    "json/nodes/crm/updatestatus.js" };

    // Download Each Catalog
    JSONArray jsonArray = new JSONArray();

    String[] target = {};

    String type = request.getParameter("type");

    if (type != null)
		type = type.toLowerCase().replace("addons", "");

    System.out.println("Type  " + type);

    if (type.equalsIgnoreCase("email"))
		target = EMAIL_CATALOG;
    else if (type.equalsIgnoreCase("mobile"))
		target = MOBILE_CATALOG;
    else if (type.equalsIgnoreCase("utilities"))
		target = UTILITIES_CATALOG;
    else if (type.equalsIgnoreCase("developers"))
		target = DEVELOPERS_CATALOG;
    else if (type.equalsIgnoreCase("crm"))
		target = CRM_CATALOG;

    for (String path : target)
    {
		// Read each path locally from context
		// System.out.println(path);
		File f = new File(path);
		InputStream is = new FileInputStream(f);

		try
		{
		    String contents = IOUtils.toString(is, "UTF-8");
		    // System.out.println(contents);

		    JSONObject nodeData = new JSONObject(contents);

		    jsonArray.put(new JSONObject().put("jsonsrc", "/" + path).put(
			    "json", nodeData));
		}
		catch(Exception e)
		{
		    System.err.println("Error in catalog " + e.getMessage());
		}
		finally
		{
		    IOUtils.closeQuietly(is);
		}
		
    }

    out.println(jsonArray);
%>