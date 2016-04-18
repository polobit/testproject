<%@page import="java.net.URLDecoder"%>
<%@page import="com.livily.util.util.URLUtil"%>
<%@page import="com.livily.util.util.JSONUtil"%>
<%@page import="com.ticket.TicketDomain"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	// Checks if it is being access directly and not through servlet
	if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
		response.sendRedirect("/help/register");
		return;
	}


	String error = request.getParameter("error");
	
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
	
	<div class="login-page middle-align">

		
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

				<form name='helpcenter' id="helpcenter" method='post'
					onsubmit="return isValid();">

					<%
						if (!StringUtils.isEmpty(error)) {
					%>
					<div class="alert alert-error login-error">
						<a class="close" data-dismiss="alert" href="#">&times;</a><%=error%>
					</div>
					<%
						}
					%>
					
					<div class="login-wrap">
					
						<div class="text-center">Sign in to your Account</div>
						
						<div class="form-group login-userid">
							<input class="input-xlarge required name form-control field"
								name="name" type="text" maxlength="50" minlength="1"
								placeholder="Name" autocapitalize="off">
						</div>
						
						<div class="form-group login-userid">
							<input class="input-xlarge required email form-control field"
								name="email" type="text" maxlength="50" minlength="6"
								placeholder="Email" autocapitalize="off">
						</div>

						<div class="form-group">
							<input class="input-xlarge required form-control field "
								maxlength="16" minlength="4" name="password" type="password"
								placeholder="Password" autocapitalize="off">
						</div>

						<div align="center">
							
							<button type="submit"
								class="btn btn-large logBtn btn-primary agile_btn">
								Register</i>
							</button>
						</div>
						<div class="registration">
						
						<input type="hidden" name="command" value="register" />
								
							 <a href="/help/login"
								class="log-text-underline">Login</a> 

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

			jQuery.validator
			.addMethod(
					"password",
					function(value, element) {
						
						return (value.indexOf(" ") === -1)
						
					}, "Spaces not allowed");

			
			jQuery.validator.setDefaults({
				debug : true,
				success : "valid"
			});

			// Submits the clickdesk form to LoginServlet
			$("#helpcenter").validate({
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
			$("#helpcenter").validate();
			return $("#helpcenter").valid();
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