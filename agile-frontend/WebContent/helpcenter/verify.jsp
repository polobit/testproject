<%@page import="java.net.URLDecoder"%>
<%@page import="com.livily.util.util.JSONUtil"%>
<%@page import="com.livily.helpcenter.users.HelpCenterVerifyUsers"%>
<%@page import="com.ticket.TicketDomain"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.livily.util.util.URLUtil"%>
<%@page import="com.livily.user.util.Verification"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	// Get userkey and token
	String token = request.getParameter("token");
	String email = request.getParameter("email");

	String message = "", status = "success";
	
	// Get domain name
			String domainName = URLUtil.getDomainNameFromRequest(request);

			// Add domain JSON to request scope
			String domainInfo = (String) request.getAttribute("domain_info");
	
	// Domain JSON
			JSONObject domainJSON = (StringUtils.isBlank(domainInfo)) ? TicketDomain.getDomainJSON(domainName)
					: new JSONObject(domainInfo);

	try
	{

		if (StringUtils.isBlank(token) || StringUtils.isBlank(email))
			throw new Exception("Invalid Parameters");

		if (domainJSON == null)
			throw new Exception("Invalid Domain");

		JSONObject customerJSON = HelpCenterVerifyUsers.verifyUser(email, token, domainJSON);

		// Send welcome email
		HelpCenterVerifyUsers.sendWelcomeEmail(customerJSON, domainJSON);

		message = "Your email has been successfully verified.";

	}
	catch (Exception e)
	{
		message = e.getMessage();

		if (message.startsWith("Your account has already been verified"))
			status = "success";
		else
			status = "error";

	}

	// 	if (StringUtils.equalsIgnoreCase(status, "error"))
	// 		request.setAttribute("error", message);
	// 	else
	// 		request.setAttribute("mssg", message);

	// 	// Return to Login Page
	// 	request.getRequestDispatcher("/help/login.jsp").forward(request, response);
	
	// Company Logo
	String logoURL = JSONUtil.getJSONValue(domainJSON,
			TicketDomain.TICKET_DOMAIN_DB_COMPANY_LOGO_URL);

	// Reset message
	logoURL = (logoURL == null) ? "" : logoURL;
	// Replace http with https
	logoURL = URLDecoder.decode(logoURL, "UTF-8").replace("http://",
			"https://");

	String CSS_PATH = "//d1gwclp1pmzk26.cloudfront.net/agent-panel/";
	
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Agent Panel Invalid Login</title>

<!-- Le HTML5 shim, for IE6-8 support of HTML elements -->
<!--[if lt IE 9]>
			<script src="js/html5.js"></script>
<![endif]-->

<!-- Le styles -->
<link
	href="https://d1gwclp1pmzk26.cloudfront.net/css/bootstrap-blue.min.css"
	rel="stylesheet" />
<link
	href="https://d1gwclp1pmzk26.cloudfront.net/css/bootstrap-responsive.min.css"
	rel="stylesheet" />
<!-- <link href="https://d1gwclp1pmzk26.cloudfront.net/css/signin.css"
	rel="stylesheet" /> -->
	
<link rel="stylesheet" href="<%=CSS_PATH%>css/signin.css">
<link rel="stylesheet" href="<%=CSS_PATH%>new-css/custom-login.css" />

<style type="text/css">
@media ( min-width : 900px) {
	body {
		padding-top: 30px;
	}
	.navbar-search {
		padding-left: 10%
	}
}

.field {
	height: 30px !important;
	margin: 8px 0px !important;
	padding-left: 10px !important;
}

.error {
	color: red;
}
</style>
</head>

<body class="logpages">

	<div class="row login-page">
		<div class='account-container'>
			<div class="content">
				<div class="logtophead text-center">
				   <%
						logoURL = (logoURL
								.contains("contactuswidget.appspot.com/images/clickdesklogo.png"))
								? "/img/signin/cd-logo.png"
								: logoURL;
					%>
					<img src="<%=logoURL %>" />
				</div>
			<div class="login-wrap">
				<div class="alert <%if(status.equalsIgnoreCase("success")){ %>alert-success login-success<%}else{%>alert-error login-error<%}%>" style="width: 240px;margin: 0px;text-align: center;padding: 10px 22px;">
					<a class="close" data-dismiss="alert" href="#"></a><%=message %>
				</div>
				<div style="text-align: center;text-decoration: underline;font-size: 12px;"><a href="/help/login">Login</a></div>
			</div>
			</div>
		</div>
	</div>

</body>
</html>