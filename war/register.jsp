<%@page import="org.apache.commons.lang.StringUtils"%>
<%
//Check if it is being access directly and not through servlet
if(request.getAttribute("javax.servlet.forward.request_uri") == null)
{
    response.sendRedirect("/register");
    return;
}

String error = request.getParameter("error");
if(error != null)
    System.out.println(error);
else
    error = "";

%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
 <meta name="globalsign-domain-verification" content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx"/>
<title>Register</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">


<!-- Le styles -->

<link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="/css/openid-min.css">
<link type="text/css" rel="stylesheet" href="/css/signin.css">

<style>
@media (min-width: 900px) {
body {
	padding-top: 20px;
	}
	
.navbar-search{
 	padding-left: 10%
}
	
}
.field {
	height: 30px !important;
	margin: 8px 0px !important;
	padding-left: 10px !important;
}

.field_domain_add_on
{
    height: 30px !important;  
    margin: 8px -4px !important;  
    padding-left: 10px !important;
    line-height: 26px !important;

}

.domain_input_field {
	height: 30px !important;
	margin: 8px 0px !important;
	padding-left: 10px !important;
}


.error {
	color: red;
}

.login-page .openid_large_btn:hover {
margin: 4px 0px 0px 4px;
border: 2px solid #999;
box-shadow: none;
-moz-box-shadow: none;
-webkit-box-shadow: none;
}

/* To move validation slides */
#agile label
{
margin-bottom:0px;
}
</style>


 <!-- JQUery Core and UI CDN -->
<script type='text/javascript' src='/lib/jquery.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
<script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;
</script>
<%
String ua = request.getHeader( "User-Agent" );
boolean isMSIE = ( ua != null && ua.indexOf( "MSIE" ) != -1 );
%>

<% if( isMSIE ){ 
	response.sendRedirect("/error/ie-upgrade.jsp");
} %>
<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>

<body>

	<div class='navbar navbar-fixed-top'> 
    	<div class='navbar-inner'> 
    		<div class='container'> 
    			<a class='brand' href='#dashboard'>Agile CRM</a>
  				<div class="nav-collapse">
					<ul class="nav pull-right">
						<li class="">						
						<a href="http://www.agilecrm.com" class="">
							<i class="icon-chevron-left"></i>
							Back to home-page
						</a>
						</li>
					</ul>
  	    		</div>
			</div>
		</div>
	</div>
	<div class="row login-page">
		<div class='account-container'>
			<div class="content clearfix">
			  <h1 style="font-size:29px;">Create your First User</h1>
				  <form name='choose_domain' id="choose_domain" method='post' onsubmit="return validateAndSubmit();" style="padding:10px 0px 5px;border-top: 1px dotted #CCC;">
				 
<<<<<<< HEAD
						<div id="domain-error" class="alert alert-error login-error hide" ></div>
=======
						
>>>>>>> yaswanth
			<%-- 			<% if(!StringUtils.isEmpty(error)){%>
					 <div class="alert alert-error login-error">
						<a class="close" data-dismiss="alert" href="#">×</a><%=error%> 
					</div>
					<%}%>
					
					 <% if(!StringUtils.isEmpty(success)){%>
					<div class="alert alert-success login-success">
						<a class="close" data-dismiss="alert" href="#">×</a><%=success%> 
					</div>
					 <%}%> --%>
					 <!-- <h3><small>Select your domain at Agile CRM</small></h3> -->
<<<<<<< HEAD
					 <div style="padding-top:10px;">
          				<input id='subdomain' type="text" placeholder="Company"
						   	   name="subdomain" class="input-medium field required domainLength commonDomain domainCharacters" autocapitalize="off"><b> .agilecrm.com</b>
=======
    
					 <div style="padding-top:10px;" class="input-prepend input-append">
          				<input id='subdomain' type="text" placeholder="Company"
						   	   name="subdomain" class="required domainLength commonDomain domainCharacters domain_input_field input-medium" autocapitalize="off">
						   	   <span class="add-on field_domain_add_on" id="app_address">.agilecrm.com</span>
>>>>>>> yaswanth
						   	  <!--  <span style="color:#999"></span>
						   	   -->
				   </div>
				</form>
				
				<form id='oauth' name='oauth' method='post'> 
				
				 <h3><small></small></h3>
			
				
				<div id="openid_btns" style="float: left;padding:5px 0 15px;border-top: 1px dotted #CCC;border-bottom: 1px dotted #CCC;border-right: none;border-left: none;">
				        <!-- <h3><small>Sign up u</small></h3> -->
						
				  <div style="padding-top:10px;">
					<input type='hidden' name='type' value='oauth'></input>
					<input type='hidden' name='server' id='oauth-name' value=''></input>
					<a title="log in with Google" data='google' href='#' style="background: #FFF url(img/signin/openid-logos-register.png); background-position: -1px -1px" class="google openid_large_btn"></a>
					<a title="log in with Yahoo" data='yahoo' href="#"	style="background: #FFF url(img/signin/openid-logos-register.png); background-position: -1px -63px" class="yahoo openid_large_btn"></a>
				  </div>
				</div>
				
				</form>
				
				<div class="clearfix"></div>
				
				<form name='agile' id="agile" method='post' onsubmit="return isValid();" style="margin:0px;padding-top:10px;"> 
				 <h3><small>Or Fill out the form below</small></h3>	
				<div id="openid_btns" style="padding:5px 0 15px;">
					<input type='hidden' name='type' value='agile'></input>
					
					<input class="input-xlarge field required" name='name' type="text" maxlength="50" minlength="3" placeholder="Full Name" autocapitalize="off">
                    <input class="input-xlarge field required email" id="login_email" name='email' type="text" maxlength="50" minlength="6" placeholder="Email Address (User ID)" autocapitalize="off">
                    <input class="input-xlarge field required" maxlength="20" minlength="4" name='password' type="password" placeholder="Password" autocapitalize="off">
					<div style="margin-top:7px;">
					  <label class="checkbox" style="display:inline-block;">I agree with the <a href="https://www.agilecrm.com/terms.html" target="_blank">Terms and conditions</a><input type="checkbox" checked="checked" name="agree" class="required"></label>
					  <input type='submit' id="register_account" style="margin-top:20px;" value="Create  >>" class='btn btn-large btn-primary'>
				  </div>
				</div>
				</form>
				
				<div class="clearfix"></div>
				
				</div>
					
			</div>
			<div style="text-align: center;line-height: 19px;">
	                 Already have an account? <a href="/enter-domain?to=login">Login</a><br/>
	                 Forgot <a href="/enter-domain?to=forgot-password">Password?</a> <a href="/forgot-domain">Domain?</a>
            </div>
		</div>
		
		<script type="text/javascript">
		$(document).ready(function() {			
			
         
			$('.openid_large_btn').click(function(e)
			{
				// Get Data Google/Yahoo and submits to to LoginServlet
				var data = $(this).attr('data');
				$('#oauth-name').val(data);
				
				$("#choose_domain").validate();
				if($("#choose_domain").valid())	
				{
					var domain = $("#subdomain").val();
				
					checkAndCreateUser("/backend/register-check?domain="+domain+"&oauth=true", $("oauth"))
				}
				
				e.preventDefault();
				
			});
			
			jQuery.validator.addMethod("domainLength", function(value, element) {
				var subdomain = value;
				return !(subdomain == null || subdomain == "" || subdomain.length < 4 || subdomain.length > 20)
					
			//	console.log(params);
				
			}, "Domain should be 4 to 20 characters.");
			
			jQuery.validator.addMethod("domainCharacters", function(value, element) {
				return isAlphaNumeric(value);
			//	console.log(params);
				
			}, "Domain should start with an alphabet and special characters are not allowed.");
			
			jQuery.validator.addMethod("commonDomain", function(value, element) {
				return isNotValid(value);
			//	console.log(params);
				
			}, "Common domain cannot be created.");
			
<%-- 			$(".to").click(function(e) {
				e.preventDefault();
				var data = $(this).closest("a").attr('to');
				    <% String redirect;%>
				if(data == "login")
					<% redirect = "login";%>
				else
					<% redirect = "forgot-password";%>
				<%
				request.setAttribute("to", redirect);
				response.sendRedirect("/enter-domain");
				%>
				
			}); --%>
			$("#choose_domain").validate({
				errorPlacement: function(error, element) {
					console.log(error);
					console.log(error.insertAfter($(element).siblings("span")));
					}
			});
			
			// Submits the Agile form to to RegisterServlet
			$("#agile").validate({
				 submitHandler: function(form) {
					 if(isValid())
						{
						 var domain = $("#subdomain").val();
						 var email = $("#login_email").val();
						 
						 checkAndCreateUser("/backend/register-check?domain="+domain+"&email=" + email, form);
						}
					 }
			});
			
		});
		
		function isNotValid(subdomain) {
			subdomain = subdomain.toString();
			var sub_domain = ["my", "agile", "googleapps", "sales", "support", "login", "register", "google", "yahoo", "twitter", "facebook", "aol", "hotmail"];
			for(var key in sub_domain){
				if(sub_domain[key] == subdomain.toLowerCase()){
					return false;
				} 
			}
			return true;
        }

		function isAlphaNumeric(subdomain) {
			subdomain = subdomain.toString();
		  
		  var regularExpression  = new RegExp(/^[A-Za-z][a-zA-Z0-9]{3,20}$/);
		  return regularExpression.test(subdomain);
		}
		
		//validates the form fields
		function isValid(){
			
			// Return if action is already in process 
			if($("#register_account").attr("disabled"))
				return;
			
		    $("#agile").validate();
		    $("#choose_domain").validate();
		    return  $("#choose_domain").valid() && $("#agile").valid();
		    }
		
		function checkAndCreateUser(url, form)
		{
			 $("#register_account").attr("disabled", "disabled");
				$.ajax({
					  type: "POST",
					  url: url,
					  dataType : "json",
					  success: function(data){
						
						
						  $("#register_account").removeAttr("disabled");
						  if(data && data.error)
							{
							
							
							// If error block is removed, it is added again into DOM 
							  var error_block = $("#domain-error");
							
							  if(error_block.length)
								  $("#domain-error").html("<a class='close' data-dismiss='alert' href='#'>&times</a> " + data.error).show();
							  else
								  $("#choose_domain").prepend('<div id="domain-error" class="alert alert-error login-error" ><a class="close" data-dismiss="alert" href="#">&times</a>'+ data.error+'</div');
							  return;
							  
							}
						  
						  // Hides error message if any 
						  $("#domain-error").hide();
						  
						// Read domain
						 var domain = $("#subdomain").val();
						
						  // Form data is posted to its subdomain 
						  $(form).attr('action', "https://" + domain + ".agilecrm.com/register");
						  form.submit();	 
					  },
					  error: function(xhr, status, error)
					  {
						  console.log(error);
					  }
					});
		}
		</script>
	<!-- Clicky code -->
 	<script src="//static.getclicky.com/js" type="text/javascript"></script>
	<script type="text/javascript">try{ clicky.init(100729733); }catch(e){}</script>
</body>
</html>