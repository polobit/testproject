<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.session.SessionManager"%>
<%@page import="com.agilecrm.session.UserInfo"%>

<%
	UserInfo userInfo = SessionManager.getFromRequest(request);
	if (userInfo == null) {
		out.println(
				"Seems something went wrong. You may <a href='#' onclick='window.close();return false;'>close this window</a> and continue browsing AgileCRM Dashboard. Please try again after some time.");
		return;
	}

	JSONObject userJSON = new JSONObject();
	userJSON.put("name", userInfo.getName());
	userJSON.put("email", userInfo.getEmail());
	userJSON.put("password", request.getAttribute("password"));
	userJSON.put("domain", NamespaceManager.get());
%>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Please Wait</title>

<script type="text/javascript">

window.opener.agileRegisterSuccessCallback(<%=userJSON%>);
window.close();

</script>

</head>


<body>
	Please wait while register
</body>
</html>