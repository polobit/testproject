<%@page import="java.net.URLDecoder"%>
<%@page import="com.ticket.TicketDomain"%>
<%@page import="com.livily.util.util.JSONUtil"%>
<%@page import="com.livily.helpcenter.util.HelpCenterUtil"%>
<%@page import="com.livily.helpcenter.users.HelpCenterForgotPassword"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.livily.user.util.ForgotPassword"%>
<%@page import="org.json.JSONObject"%>
<%
	/*
	 It checks first if user exists then a mail is sent to that id along with newly generated password 
	 and success message is shown. Else error is shown in the same page.
	 */
	String error = "", success = "";
	//If Email is present
	String email = request.getParameter("email");
	
	JSONObject domainJSON = HelpCenterUtil.getDomainJSON(request);
	
	if (!StringUtils.isEmpty(email)) {

		email = email.toLowerCase();

		System.out.println("email = " + email);

		JSONObject userDetails = null;

		try {
			
			userDetails = HelpCenterForgotPassword.sendUserDetails(email, domainJSON);

			if (userDetails == null) {
				error = "We are not able to find any user";
			} else {
				success = "We have sent you an email";
			}

		} catch (Exception e) {
			error = e.getMessage();
		}

		System.out.println(error + " " + success);
	}
	
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
					
					<div class="login-wrap">
						<div class="text-center">Forgot password</div>
						
						
						<%
						if (!StringUtils.isEmpty(success)) {
					%>
					<div class="alert alert-success login-success">
						<a class="close" data-dismiss="alert" href="#">&times;</a><%=success%>
					</div>
					<%
						}
					%>

						<div class="form-group">
							<input class="input-xlarge required form-control field email"
								maxlength="50" minlength="6" name="email" type="text"
								placeholder="Your Registered Email Address" autocapitalize="off">
						</div>
						
						<div align="center">
							<input type="hidden" name="command" value="login" />
							<button type="submit"
								class="btn btn-large logBtn btn-primary agile_btn">
								Submit</i>
							</button>
						</div>
						<div class="registration">
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