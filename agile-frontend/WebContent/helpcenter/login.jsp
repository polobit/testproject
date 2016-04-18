<%@page import="com.livily.util.util.JSONUtil"%>
<%@page import="com.livily.util.util.URLUtil"%>
<%@page import="com.ticket.TicketManager"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.ticket.TicketDomain"%>
<%@page import="java.net.URLDecoder"%>

<%
	// Checks if it is being access directly and not through servlet
	if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
		response.sendRedirect("/help/login");
		return;
	}

	// Gets User Name
	String email = request.getParameter("email");
	if (email != null) {
		email = email.toLowerCase();
		request.setAttribute("clickdesk_agent_email", email);
	}

	// Gets Error Info
	String loginError = request.getParameter("error");
	loginError = (loginError == null) ? "" : loginError;

	// Gets Logout Warning Message
	String logOutMssg = request.getParameter("mssg");
	logOutMssg = (logOutMssg == null) ? "" : logOutMssg;

	// Gets session logout message
	if (StringUtils.isNotBlank((String) request.getSession()
			.getAttribute("logout_message"))) {
		logOutMssg = (String) request.getSession().getAttribute(
				"logout_message");
		request.getSession().removeAttribute("logout_message");
	}

	// Reset message
	logOutMssg = (logOutMssg == null) ? "" : logOutMssg;

	// Get domain name from request
	String domainName = URLUtil.getDomainNameFromRequest(request);

	// Add domain JSON to request scope
	String domainInfo = (String) request.getAttribute("domain_info");

	// Domain JSON
	JSONObject domainJSON = (StringUtils.isBlank(domainInfo))
			? TicketDomain.getDomainJSON(domainName)
			: new JSONObject(domainInfo);

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

<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Knowledge Base</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
          <script src="lib/ie/html5.js"></script>
        <![endif]-->

<!-- Load from cloud -->
<link href="<%=CSS_PATH%>css/bootstrap-blue.min.css" rel="stylesheet" />
<link href="<%=CSS_PATH%>css/bootstrap-responsive.min.css"
	rel="stylesheet" />
<link rel="stylesheet" href="<%=CSS_PATH%>css/signin.css">
<link rel="stylesheet" href="<%=CSS_PATH%>new-css/custom-login.css" />
<!-- End of Load from cloud -->

<!-- Le fav and touch icons -->
<link rel="shortcut icon"
	href="<%=CSS_PATH%>agent-panel/img/getfavicon.png" />

</head>
<body class="logpages">
	<!-- <div class='navbar navbar-fixed-top'>
		<div class='navbar-inner'>
			<div class='container'>
				<a class='brand' href='#visitors'>ClickDesk</a>
				<div class="nav-collapse">
					<ul class="nav pull-right clickdesk_site_url">
						<li class=""><a href="https://my.clickdesk.com" class="">
								<i class="icon-chevron-left"></i> Back to Admin Login
						</a></li>
					</ul>
				</div>
			</div>
		</div>
	</div> -->
	<div class="login-page middle-align">

		<%
			if (!StringUtils.isEmpty(logOutMssg)) {
		%>
		<div class="alert alert-error login-success logout-info">
			<a class="close" data-dismiss="alert" href="#">&times;</a><%=logOutMssg%>
		</div>
		<%
			}
		%>

		<div id="incompatible_browser_info" class="alert"
			style="display: none; margin-top: 10px; border: 1px solid #DDDAA6; background: lightYellow; border-radius: 5px; color: #736B4D;">
			<a id="dismiss" class="close" data-dismiss="alert">&times;</a>This
			browser is not fully supported by ClickDesk. Please use <a
				href="https://www.google.co.in/chrome/browser/" target="_blank">Chrome</a>,
			<a href="//www.mozilla.org/en-US/firefox/new/" target="_blank">Mozilla</a>
			or <a href="http://support.apple.com/kb/dl1531" target="_blank">Safari</a>
			for better experience.
		</div>


		<div class="account-container">

			<div class="content clearfix">
				<div class="clearfix"></div>
				<div class="logtophead text-center">
					<!-- <h1 class="logHead">SIGN IN</h1> -->

					<%
						logoURL = (logoURL
								.contains("contactuswidget.appspot.com/images/clickdesklogo.png"))
								? "/img/signin/cd-logo.png"
								: logoURL;
					%>
					<img src="<%=logoURL%>">
				</div>

				<form name='webchat' id="webchat" method='post'
					onsubmit="return isValid();">

					<%
						if (!StringUtils.isEmpty(loginError)) {
					%>
					<div class="alert alert-error login-error">
						<a class="close" data-dismiss="alert" href="#">&times;</a><%=loginError%>
					</div>
					<%
						}
					%>
					<%-- <%
						if (!StringUtils.isEmpty(loginError)) {
					%>
					<div class="alert alert-error login-error alert-message">
						<%=loginError%>
					</div>
					<%
						}
					%> --%>


					<div class="login-wrap">
						<div class="text-center">Sign in to your Account</div>
						<div class="form-group login-userid">
							<input class="input-xlarge required email form-control field"
								name="email" type="text" maxlength="50" minlength="6"
								placeholder="Email" autocapitalize="off"
								<%if (request.getAttribute("clickdesk_agent_email") != null) {%>
								value="<%=request.getAttribute("clickdesk_agent_email")%>" <%}%>>
						</div>

						<div class="form-group">
							<input class="input-xlarge required form-control field "
								maxlength="16" minlength="4" name="password" type="password"
								placeholder="Password" autocapitalize="off">
						</div>

						<div class="form-group role">
							<select class="input-xlarge required form-control field "
								name="role" style="font-size:12px;border-radius:5px;padding:10px;cursor: pointer;">
								<option value="admin">I am an Admin</option>
								<option value="agent">I am an Agent</option>
								<option value="customer">I am a Customer</option>
							</select>
						</div>

						<div align="center">
							<input type="hidden" name="command" value="login" />
							<button type="submit"
								class="btn btn-large logBtn btn-primary agile_btn">
								Login</i>
							</button>
						</div>
						<div class="registration">
							Admin <a href="https://my.clickdesk.com"
								class="log-text-underline">Login</a> </br> <a href="/helpcenter/forgot-password.jsp"
								class="log-text-underline">Forgot Password?</a><br>
								New to <%=domainName %>? <a href="register">Sign Up</a>

						</div>

					</div>
				</form>

			</div>
		</div>

	</div>

	<!-- JQUery Core and UI CDN -->
	<%
		String JS_PATH = "//d1gwclp1pmzk26.cloudfront.net/agent-panel/";
	%>
	<script type='text/javascript'
		src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
	<script type="text/javascript" src="<%=JS_PATH%>lib/bootstrap.min.js"></script>
	<script type="text/javascript"
		src="<%=JS_PATH%>lib/jquery.validate.min.js"></script>
	<script type="text/javascript" src="/js/browser-compatibility.js"></script>

	<script type="text/javascript">
		$(document).ready(function() {

			jQuery.validator.setDefaults({
				debug : true,
				success : "valid"
			});

			// Submits the clickdesk form to LoginServlet
			$("#webchat").validate({
				submitHandler : function(form) {
					form.submit();
				}
			});

			//Check and notify the user about incompatibility
			try {
				clickdesk_initialize_browser_detect(function() {

					$("#incompatible_browser_info").show();
					return;
				});

			} catch (e) {
				// TODO: handle exception
			}

		});

		// Validates Form Fields
		function isValid() {
			$("#webchat").validate();
			return $("#webchat").valid();
		}
	</script>

	<!-- Get Clicky code -->
	<script src="//static.getclicky.com/js" type="text/javascript"></script>
	<script type="text/javascript">
		try {
			clicky.init(100616454);
		} catch (e) {
		}
	</script>
	<noscript>
		<p>
			<img alt="Clicky" width="1" height="1"
				src="//in.getclicky.com/100616454ns.gif" />
		</p>
	</noscript>
	<!-- End of Get Clicky code -->

</body>
</html>