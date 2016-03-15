<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.ipaccess.IpAccessUtil"%>
<%

boolean ipcheck = IpAccessUtil.isValidIpOpenPanel(request);
	if(ipcheck==true){
		//response.sendRedirect("/login");
	}	
	else{
		
	}
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

<!-- <link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet"> -->


<link rel="stylesheet" type="text/css" href="/css/bootstrap.v3.min.css" /> 

<!-- <link type="text/css" rel="stylesheet" href="/css/agilecrm.css"/> -->

<link type="text/css" rel="stylesheet" href="/css/openid-min.css"/>
<link type="text/css" rel="stylesheet" href="/css/signin.css"/>
<link type="text/css" rel="stylesheet" href="/css/register.css"/>


<style>
@media (min-width: 900px) {



body {
	padding-top: 20px;
	overflow-x:hidden;
	overflow-y:scroll;
	}
	
.navbar-search{
 	padding-left: 10%
}
	
}
label{
	display:block!important;
}

.error {
	color: #ff604f;
	font-weight:normal;
}
.close
{
color:#000!important;
text-decoration:none!important;
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
::-moz-placeholder
{
	color:#999;
	opacity:0.5;
}
::-webkit-input-placeholder
{
	color:#999;
	opacity:0.5;
}
</style>


 <!-- JQUery Core and UI CDN -->
<script type='text/javascript' src='/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>
<script type='text/javascript' src='/lib/jquery-new/jquery.steps.min.js'></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>
 

<script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;

//override jquery validate plugin defaults
$.validator.setDefaults({
    highlight: function(element) {
        $(element).closest('.form-group').addClass('has-error');
    },
    unhighlight: function(element) {
        $(element).closest('.form-group').removeClass('has-error');
    },
    errorElement: 'span',
    errorClass: 'help-block',
    errorPlacement: function(error, element) {
        if(element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else {
            error.insertAfter(element);
        }
    }
});
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

<body class="logpages reg-page-bg">

	
	<div class="row login-page">
		<div class='regpage-container'>
			<div class="regpage-content clearfix">
			<div  align="center">
			  <h1 class="regpage-logHead"><img src="img/signin/cloud-logo.png"> Register your free Agile account</h1>
			  <div class="reg-info">No credit card required </div>
			  </div>
				 
				
				<form id='oauth' name='oauth' method='post' class="pad-top-10"> 
				
				 
			
				
			<!-- 	<div id="openid_btns" class="login-social-btns">
				        <h3><small>Sign up u</small></h3>
						
				 
					<input type='hidden' name='type' value='oauth'></input>
					<input type='hidden' name='server' id='oauth-name' value=''></input>
					<a title="log in with Google" data='google' href='#'  class="google"><i class="fa fa-google"></i> Register with Google</a>
					<a title="log in with Yahoo" data='yahoo' href="#"	 class="yahoo" style="margin-right:0;"><i class="fa fa-yahoo"></i>  Register with Yahoo</a>
				  </div> -->
				
				
				</form>
			
				
				<div class="clearfix"></div>
				
				<form name='agile' id="agile" method='post' class="regpage-fieldview" onsubmit="return isValid();"> 
				    <fieldset>
				<!--  <h3 class="log-subhead"><small>Or Fill out the form below</small></h3>	 -->
				<div id="openid_btns">
					<input type='hidden' name='type' value='agile'></input>
					<div class="form-group login-userid" >
					<span class="regpage-uname"></span>
					<input class="input-xlarge field required form-control" name='name' type="text" maxlength="50" minlength="3" placeholder="Full Name" autocapitalize="off" autofocus>
                   </div>
                    <div class="form-group login-email">
                    <span class="regpage-mail"></span>
                    <input class="input-xlarge field required email form-control" id="login_email" name='email' type="text" maxlength="50" minlength="6" placeholder="Email Address (User ID)" autocapitalize="off">
                    </div>
                    <div class="form-group ">
                    <span class="regpage-password"></span>
                    <input class="input-xlarge field required form-control" maxlength="20" minlength="4" name='password' type="password" placeholder="Password" autocapitalize="off">
					</div>
					<div class="form-group">
						<div  class="input-prepend input-append input-group">
	          				<input id='subdomain' type="text" placeholder="Company"
							   	   name="subdomain" class="required  domainLength commonDomain domainCharacters domain_input_field input-medium form-control" autocapitalize="off">
							   	   <span class="add-on field_domain_add_on input-group-addon regpage-domain" id="app_address">.agilecrm.com</span>
							   	  <!--  <span style="color:#999"></span>
							   	   -->
					   </div>
				   </div>
				   	   <div align="center" class="regpage-signup">
				  <input type='submit' id="register_account"  value="Sign up" class='btn btn-large btn-primary  regpage-btn'>
				</div>

					<div class="form-group regpage-options log-terms" style="margin-bottom:0px;">

					  <!-- <label class="checkbox" style="display:inline-block;">I agree with the <a href="https://www.agilecrm.com/terms.html" target="_blank">Terms and conditions</a><input type="checkbox" checked="checked" name="agree" class="required"></label> -->
					  By clicking sign up, I agree to  AgileCRM  <a href="https://www.agilecrm.com/terms.html" target="_blank" class="log-text-underline">Terms of service</a>
				  </div>
			
				 
				</div>
				 </fieldset>
				  <fieldset>
				  	 <legend>Profile Information</legend>
 
        <label for="name-2">First name *</label>
        <input id="name-2" name="name" type="text" class="required">
        <label for="surname-2">Last name *</label>
        <input id="surname-2" name="surname" type="text" class="required">
        <label for="email-2">Email *</label>
        <input id="email-2" name="email" type="text" class="required email">
        <label for="address-2">Address</label>
        <input id="address-2" name="address" type="text">
        <label for="age-2">Age (The warning step will show up if age is less than 18) *</label>
        <input id="age-2" name="age" type="text" class="required number">
        <p>(*) Mandatory</p>
				  </fieldset>
				</form>
					
				 <%-- commented code for choose domain company <form name='choose_domain' id="choose_domain" method='post' onsubmit="return validateAndSubmit();"  class="pad-top-15">
				 
						
						<% if(!StringUtils.isEmpty(error)){%>
					 <div class="alert alert-error login-error">
						<a class="close" data-dismiss="alert" href="#">×</a><%=error%> 
					</div>
					<%}%>
					
					 <% if(!StringUtils.isEmpty(success)){%>
					<div class="alert alert-success login-success">
						<a class="close" data-dismiss="alert" href="#">×</a><%=success%> 
					</div>
					 <%}%>
					 <!-- <h3><small>Select your domain at Agile CRM</small></h3> -->
    
					 <div  class="input-prepend input-append input-group">
          				<input id='subdomain' type="text" placeholder="Company"
						   	   name="subdomain" class="required domainLength commonDomain domainCharacters domain_input_field input-medium form-control" autocapitalize="off">
						   	   <span class="add-on field_domain_add_on input-group-addon" id="app_address">.agilecrm.com</span>
						   	  <!--  <span style="color:#999"></span>
						   	   -->
				   </div>
				</form> --%>
				
				<div class="clearfix"></div>
				
				</div>
					
			</div>
		<!-- 	<div style="text-align: center;line-height: 19px;">
	                 Already have an account? <a href="/enter-domain?to=login">Login</a><br/>
	                 Forgot <a href="/enter-domain?to=forgot-password">Password?</a> <a href="/forgot-domain">Domain?</a>
            </div> -->
		</div>
		
		
		<script type="text/javascript">
		$(document).ready(function() {	
			
			var form = $("#agile").show();
			 
			form.steps({
			    headerTag: "h3",
			    bodyTag: "fieldset",
			    transitionEffect: "slideLeft"
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
		  //  $("#choose_domain").validate();
		    return  $("#agile").valid();
		    }
		
		function checkAndCreateUser(url, form)
		{
			 $("#register_account").attr("disabled", "disabled");
				$.ajax({
					  type: "POST",
					  url: url,
					  dataType : "json",
					  success: function(data){
						
						
						  
						  if(data && data.error)
							{
							
							
							// If error block is removed, it is added again into DOM 
							  var error_block = $("#domain-error");
							
							  if(error_block.length)
								  $("#domain-error").html("<a class='close' data-dismiss='alert' href='#'>&times</a> " + data.error).show();
							  else

								  $("#agile").prepend('<div id="domain-error" class="alert alert-error login-error" ><a class="close" data-dismiss="alert" href="#">&times</a>'+ data.error+'</div');

						
							  
							  $("#register_account").removeAttr("disabled");
							  return;
							  
							}
						  
						  // Hides error message if any 
						  $("#domain-error").hide();
						  
						// Read domain
						 var domain = $("#subdomain").val();
						
						  // Form data is posted to its subdomain 
						 $(form).attr('action', "https://" + domain + ".agilecrm.com/register");
						  // $(form).attr('action', "http://localhost:8888/register");
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
