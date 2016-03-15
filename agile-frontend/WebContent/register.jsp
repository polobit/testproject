<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page contentType="text/html; charset=UTF-8" %>
<%@page import="com.agilecrm.ipaccess.IpAccessUtil"%>

<%
	boolean ipcheck = IpAccessUtil.isValidIpOpenPanel(request);
	if(ipcheck==true){
		//response.sendRedirect("/login");
	}	
	else{
		
	}

    //Check if it is being access directly and not through servlet
			if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
				response.sendRedirect("/register");
				return;
			}

			String error = request.getParameter("error");
			if (error != null)
				System.out.println(error);
			else
				error = "";
			
			//flatfull path
			String flatfull_path="/flatfull";
			
%>

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="globalsign-domain-verification"
	content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<title>Register</title>
<meta name="viewport"
	content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">


<!-- Le styles -->

<!-- <link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet"> -->


<link rel="stylesheet" type="text/css" href="/css/bootstrap.v3.min.css" />

<!-- <link type="text/css" rel="stylesheet" href="/css/agilecrm.css"/> -->

<link type="text/css" rel="stylesheet" href="/css/openid-min.css" />
<link type="text/css" rel="stylesheet" href="/css/signin.css" />
<link type="text/css" rel="stylesheet" href="/css/phonenumber-lib/intlTelInput.css" />
<link type="text/css" rel="stylesheet" href="flatfull/css/register.css" />
<link type="text/css" rel="stylesheet" href="/css/signup/bootstrap-select.min.css" />


<style>





	body {
		padding-top: 20px;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	.navbar-search {
		padding-left: 10%
	}


label {
	display: block !important;
}

.error {
	color: #ff604f;
	font-weight: normal;
}

.close {
	color: #000 !important;
	text-decoration: none !important;
}

.login-page .openid_large_btn:hover {
	margin: 4px 0px 0px 4px;
	border: 2px solid #999;
	box-shadow: none;
	-moz-box-shadow: none;
	-webkit-box-shadow: none;
}

/* To move validation slides */
#agile label {
	margin-bottom: 0px;
}

::-moz-placeholder {
	color: #999;
	opacity: 0.5;
}

::-webkit-input-placeholder {
	color: #999;
	opacity: 0.5;
}


</style>


<!-- JQUery Core and UI CDN -->
<script type='text/javascript' src='/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.v3.min.js"></script>
<script type="text/javascript" src="/lib/phonenumber-lib/intlTelInput.js"></script>
<script type="text/javascript" src="/lib/jquery.validate.min.js"></script>


<script type="text/javascript">
var isSafari = (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0);
var isWin = (window.navigator.userAgent.indexOf("Windows") != -1);
if(isSafari && isWin) 
	window.location = '/error/not-supported.jsp';
	
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
    String ua = request.getHeader("User-Agent");
			boolean isMSIE = (ua != null && ua.indexOf("MSIE") != -1);

	// Get the cookie array and find a cross domain cookie from agilecrm site and autofill email in register page
	Cookie[] cookies = request.getCookies();
	String email ="";
	if(cookies != null && cookies.length > 0)
	{
		for(Cookie cookie : cookies)
			if(cookie.getName().equals("registration_email"))
				email = cookie.getValue();
	}
%>

<%
    if (isMSIE) {
				response.sendRedirect("/error/not-supported.jsp");
			}
%>
<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>

<body class="logpages reg-page-bg">


	<div class="row login-page">
		<div class='regpage-container'>
			<div class="regpage-content clearfix carousel slide">
				<!-- 	<div align="center">
					<h1 class="regpage-logHead">
						<img src="img/signin/cloud-logo.png"> Register your free
						Agile account
					</h1>
					<div class="reg-info">No credit card required</div>
				</div>
 -->

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

				<form name='agile' id="agile" method='post'
					onsubmit="return isValid();">
					<div id="cor" class="carousel slide" data-ride="carousel">
					<div class="carousel-inner" >
						<div class="item active">
							<div align="center">
								<h1 class="regpage-logHead">
									<img src="img/signin/cloud-logo.png"> Register your free
									Agile account
								</h1>
								<div class="reg-info">No credit card required</div>
							</div>
							<fieldset id="agile-fieldset1">
								<!--  <h3 class="log-subhead"><small>Or Fill out the form below</small></h3>	 -->
								<div id="openid_btns" class="regpage-fieldview">
									<input type='hidden' name='type' value='agile'></input>
									<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>
									<div class="form-group login-email">
										<span class="regpage-mail"></span> <input
											class="input-xlarge field required email form-control"
											id="login_email" name='email' type="text" maxlength="50"
											minlength="6" value="<%=email%>" placeholder="Email Address (User ID)"
											autocapitalize="off">
									</div>
									<div class="form-group ">
										<span class="regpage-password"></span> <input
											class="input-xlarge field required form-control"
											maxlength="20" minlength="4" name='password' type="password"
											placeholder="Password" autocapitalize="off">
									</div>
									<div align="center" class="regpage-signup">
										<input type='submit' id="register_account" value="Sign up"
											class='btn btn-large btn-primary  regpage-btn'>
									</div>

									<div class="form-group regpage-options log-terms"
										style="margin-bottom: 0px;">

										<!-- <label class="checkbox" style="display:inline-block;">I agree with the <a href="https://www.agilecrm.com/terms.html" target="_blank">Terms and conditions</a><input type="checkbox" checked="checked" name="agree" class="required"></label> -->
										By clicking sign up, I agree to AgileCRM <a
											href="https://www.agilecrm.com/terms.html" target="_blank"
											class="log-text-underline">Terms of service</a>
									</div>


								</div>
							</fieldset>
						</div>
						<div class="item">
							<div align="center">
								<h1 class="regpage-logHead">
									<img src="img/signin/cloud-logo.png">Choose your domain
								</h1>
								<div class="reg-info"></div>
							</div>
							<fieldset id="agile-fieldset2" class="step2">
								<div class='regpage-fieldview'>
								<!--  	<h4>About your Company</h4>-->
								<!--  	<div class="form-group login-company">
							<!-- 	<div style="display:inline-block;width:50%">  	
										<span class="regpage-company"></span> <input
											class="input-xlarge field required form-control"
											id="login_company" name='company' type="text" maxlength="50"
											placeholder="Company Name" autocapitalize="off">
									</div> -->
									<div class="form-group">
										<div class="input-prepend input-append input-group">
											<input id='subdomain' type="text" placeholder="Company"
												name="subdomain"
												class="required  domainLength commonDomain domainCharacters domain_input_field input-medium form-control"
												autocapitalize="off"> <span
												class="add-on field_domain_add_on input-group-addon regpage-domain"
												id="app_address">.agilecrm.com</span>
											<!--  <span style="color:#999"></span>
							   	   -->
										</div>
									</div>
									<div class="form-group login-plan_type">
									<div class="elements-sibling">
									<select class="form-control required"  name="plan_type" data-width="100%">
											<option value="" selected disabled>Choose Plan</option>
											<option value="Free">Free</option>
											<option value="Starter">Starter</option>
											<option value="Regular">Regular</option>
											<option value="pro">Pro</option>
								 	 </select>
								 	 </div>
								 	 <div class="elements-sibling-last"> <input
											class="input-xlarge field required form-control number" name="users_count"
											type="text" min="1"
											placeholder="Users" autocapitalize="off" autofocus>
								 	 </div>
									</div>
									<div class="clearfix"></div>
									
								 
									
								  </div>
								  <div align="center" class="regpage-signup">
										<input type='submit' id="register_domain" value="Continue"
											class='btn btn-large btn-primary  regpage-btn'>
									</div>
										<div class="form-group regpage-options log-terms"
										style="margin-bottom: 0px;"></div>
										
							</fieldset>
						</div>
						
						<div class="item">
							<div align="center">
								<h1 class="regpage-logHead">
									<img src="img/signin/cloud-logo.png">One last step
								</h1>
								<div class="reg-info"> A little bit about yourself</div>
							</div>
							<fieldset class="step3">
								<div class='regpage-fieldview'>
								<!--  	<h4>About your Company</h4>-->
								<!--  	<div class="form-group login-company">
							<!-- 	<div style="display:inline-block;width:50%">  	
										<span class="regpage-company"></span> <input
											class="input-xlarge field required form-control"
											id="login_company" name='company' type="text" maxlength="50"
											placeholder="Company Name" autocapitalize="off">
									</div> -->
									<div class="form-group login-userid">
										<span class="regpage-uname"></span> <input
											class="input-xlarge field required form-control" name='name'
											type="text" maxlength="50" minlength="3"
											placeholder="Full Name" autocapitalize="off" autofocus>
									</div> 
									<div class="form-group login-company">
								<!--	<div style="display:inline-block;width:49%"> -->
									<select class="form-control required"  name="company_type" data-width="100%">
											<option value="" selected disabled>Company type</option>
											<option value="B2B">B2B</option>
											<option value="SaaS">SaaS</option>
											<option value="Ecommerce">Ecommerce</option>
											<option value="Marketing Agency">Marketing Agency</option>
											<option value="Contact Centers">Contact Centers</option>
											<option value="Realty">Realty</option>
											<option value="Media">Media</option>
											<option value="Technology Consulting">Technology Consulting</option>
											<option value="Other">Other</option>
								  </select>
								  </div>
								 <!--   <h4>About yourself</h4> -->
									<div class="form-group login-company-size">
									 <!--  <div style="display:inline-block;width:50%"> -->
									<select class="form-control required"  name="role">
											<option value="" selected disabled>Role</option>
											<option value="CEO">CEO</option>
											<option value="VP">VP</option>
											<option value="VP, Sales">VP, Sales</option>
											<option value="VP, Marketing">VP, Marketing</option>
											<option value="Customer Success Manager">Customer Success Manager</option>
											<option value="Sales Manager">Sales Manager</option>
											<option value="Marketing Manager">Marketing Manager</option>
											<option value="Consultant">Consultant</option>
											<option value="Reseller">Reseller</option>
											<option value="Recruiter">Recruiter</option>
											<option value="Developer">Developer</option>
											<option value="Other">Other</option>
								  </select>
								  </div>
								  <div class="form-group login-company-size">
								<!--  <div style="display:inline-block;width:49%">-->
										<span class="regpage-phone-number" ></span>
											<div id="phone-block"> <input
											class="input-xlarge field form-control required tel-number"
											id="login_phone_number" name='phone_number' type="text"
											placeholder="Phone Number" autocapitalize="off">
											<span class="error"></span>
											</div>
											</div>
									
									<div class="form-group login-company-size">
										<span class="regpage-plan_type"></span> 
									</div>

									<div align="center" class="regpage-signup">
										<input type='submit' id="confirm_registration" value="Done"
											class='btn btn-large btn-primary  regpage-btn'>
									</div>
										<div class="form-group regpage-options log-terms"
										style="margin-bottom: 0px;"></div>
										</div>
							</fieldset>
						</div>
					</div>
					</div>
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

<script src="//cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js" type="text/javascript"></script>
	<script type="text/javascript">
		$(document).ready(function() {	
			
			// Pre load dashlet files when don is active
			preload_dashlet_libs();

			$('#account_timezone').val(jstz.determine().name());	
			// Initializes phone library
			$("#login_phone_number").intlTelInput({
				utilsScript: "lib/phonenumber-lib/utils.js",
				responsiveDropdown : true
			});
			
			 setSelectCssInSafari();

			
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
			

			jQuery.validator.addMethod("tel-number", function(value, element) {
				
				//return $(element).intlTelInput("isValidNumber");;
				return true;
			//	console.log(params);
				
			}, "Enter valid number.");
			
			
			
			$("#login_phone_number")
			
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
		
			console.log($('#cor'))
			$('#cor').carousel({
				  interval: 100000000
				});
			
			$('#cor').carousel('pause');
			
			/* $('.selectpicker').selectpicker({
			      style: 'none',
			      size: 100
			  }); */
				
			// Submits the Agile form to to RegisterServlet
			$("#agile").validate({
				 submitHandler: function(form) {
					 if(isValid())
						{
						 $(".regpage-container").addClass('regpage-container-fixed-height');
						
						 
						 // Pauses the carousel
						 $('#cor').carousel('pause');
						 
						 var step = $('.carousel').find('.active').index();
						 
						 if(step == 0)
						{
							// removes error message if any
							 $("#email-error").hide();
							 var email = $("#login_email").val(); 
							var url =  "/backend/register-check?email=" + email;
							 isDuplicateAccount(url, form, function(data){
								 $("#register_account").removeAttr("disabled");
								// $('.carousel').find('.active').hide();
								 $('#cor').carousel("next");
								 $('#cor').carousel('pause');
							 })
							 return;
						}else if(step == 1)
						{
							// removes error message if any
							 $("#email-error").hide();
							var domain = $("#subdomain").val();
							var url =  "/backend/register-check?domain="+domain;
							 isDuplicateAccount(url, form, function(data){
								 $("#register_domain").removeAttr("disabled");
								// $('.carousel').find('.active').hide();
								 $('#cor').carousel("next");
								 $('#cor').carousel('pause');
							 })
							 return;
						}
						
						 submitForm(form);
						}
					 else
						 {
							
						 }
					 }
			});
			
		});
		
		function setSelectCssInSafari()
		{
			if(navigator.userAgent.indexOf("Chrome")==-1 && navigator.userAgent.indexOf("Safari")!=-1)
				{
					$("select").addClass('safari-select');
				}
		}
		
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
			if($("#register_account").attr("disabled") || $("#register_domain").attr("disabled"))
				return;
			 $(".regpage-container").removeClass('regpage-container-fixed-height');
			 
		    $("#agile").validate();
		  //  $("#choose_domain").validate();
		    return  $("#agile").valid();
		    }
		
		function isDuplicateAccount(url, form, successCallback, errorCallback)
		{
			var step = $('.carousel').find('.active').index();
			if(step == 0)
			 $("#register_account").attr("disabled", "disabled");
			else if(step == 1)
			 $("#register_domain").attr("disabled", "disabled");
			 
			 $.post(url, {}, function(data){
				 console.log(data);
				  console.log(data.error)
				  
				  $(".regpage-container").addClass('regpage-container-fixed-height');
				 if(data && data.error && data.error.length > 0)
					{
					
					 $(".regpage-container").removeClass('regpage-container-fixed-height');
					 console.log(data.error);
					
					// If error block is removed, it is added again into DOM 
					  var email_error_block = $("#email-error");
					  var domain_error_block = $("#domain-error");
					  if(step == 0)
					  {
						  if(email_error_block.length)
							  $("#email-error").html("<a class='close' data-dismiss='alert' href='#'>&times</a> " + data.error).show();
						  else
							  $("#agile-fieldset1").prepend('<div id="email-error" class="alert alert-error login-error" ><a class="close" data-dismiss="alert" href="#">&times</a>'+ data.error+'</div');
						  $("#register_account").removeAttr("disabled");
					  }else if(step == 1)
					  {
						  if(domain_error_block.length)
							  $("#domain-error").html("<a class='close' data-dismiss='alert' href='#'>&times</a> " + data.error).show();
						  else
							  $("#agile-fieldset2").prepend('<div id="domain-error" class="alert alert-error login-error" ><a class="close" data-dismiss="alert" href="#">&times</a>'+ data.error+'</div');
						  $("#register_domain").removeAttr("disabled");
					  }
					  if(errorCallback && typeof errorCallback === 'function')
						  errorCallback(data);
					  return;
					  
					}
				  
				  // Hides error message if any 
				  $("#email-error").hide();
				  $("#domain-error").hide();
				  
				  if(successCallback && typeof successCallback === 'function')
					  successCallback(data);
				 
			 }, "json");
		}
		
		function submitForm(form)
		{
			
			// Read domain
			 var domain = $("#subdomain").val();
			
			 $("#confirm_registration").attr("disabled", "disabled");
			
			 $("#confirm_registration").attr("disabled", "disabled");
			  // Form data is posted to its subdomain 
			 $(form).attr('action', "https://" + domain + ".agilecrm.com/register");
			 //  $(form).attr('action', "http://localhost:8888/register");

			   $(form).attr('action', getRegisterURL(domain));
			  form.submit();
		}
		
		function getRegisterURL(domain)
		{

			var version = <%="\"" + VersioningUtil.getAppVersion(request) + "\""%>;
			var applicationId = <%="\"" + SystemProperty.applicationId.get() + "\""%>;

			if(version == null || version === "null")
			{
				return  "https://" + domain + ".agilecrm.com/register";
			}
			
			return "https://" + domain + "-dot-" + version + "-dot-"+applicationId + ".appspot.com/register";
		}
			 
		
		function checkAndCreateUser(url, form)
		{
			 $("#register_account").attr("disabled", "disabled");
			 
			  // Form data is posted to its subdomain 
			  $(form).attr('action', getRegisterURL(domain));
			// $(form).attr('action', "https://" + domain + ".agilecrm.com/register");
			// $(form).attr('action', "http://localhost:8888/register");
			  form.submit();
			  return;
			  
			  
			 console.log(url);
				$.ajax({
					  type: "POST",
					  url: url,
					  dataType : "json",
					  success: function(data){
						
						console.log(data);
						  
						  if(data && data.error && data.error.length > 0)
							{
							
							  console.log("error");
							
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
						  
					 
					  },
					  error: function(xhr, status, error)
					  {
						  console.log(xhr);
						  console.log(error);
					  }
					});
		}

		function preload_dashlet_libs(){
			setTimeout(function(){head.load('<%=flatfull_path%>/lib/lib-all.js')}, 5000);
		}

		</script>
	<!-- Clicky code -->
	<script src="//static.getclicky.com/js" type="text/javascript"></script>
	<script type="text/javascript">try{ clicky.init(100729733); }catch(e){}</script>
</body>
</html>