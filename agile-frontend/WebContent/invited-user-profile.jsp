<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.util.RegisterUtil"%>
<%@page import="com.agilecrm.user.RegisterVerificationServlet"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page contentType="text/html; charset=UTF-8"%>
<%@page import="com.agilecrm.ipaccess.IpAccessUtil"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.RegistrationGlobals"%>
<%@page import="com.agilecrm.core.api.UsersAPI"%>
<%@page import="com.agilecrm.user.DomainUser" %>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>


<%
	if (request.getAttribute("javax.servlet.forward.request_uri") == null) {
    	response.sendRedirect("/inviteuser");
	}
	String _AGILE_VERSION = SystemProperty.applicationVersion.get();

	String CSS_PATH = "/";
	String FLAT_FULL_PATH = "flatfull/";
	String CLOUDFRONT_TEMPLATE_LIB_PATH = VersioningUtil.getCloudFrontBaseURL();
	System.out.println(CLOUDFRONT_TEMPLATE_LIB_PATH);

	String CLOUDFRONT_STATIC_FILES_PATH = VersioningUtil.getStaticFilesBaseURL();
	CSS_PATH = CLOUDFRONT_STATIC_FILES_PATH;
	if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
		CLOUDFRONT_STATIC_FILES_PATH = FLAT_FULL_PATH;
		CLOUDFRONT_TEMPLATE_LIB_PATH = "";
		CSS_PATH = FLAT_FULL_PATH;
	}
	String errorMessage = "";

	String error = request.getParameter("error");
	System.out.println("Error = "+error);
	String successMsg = request.getParameter("success");
	System.out.println("success = "+successMsg);

	String id = request.getParameter("v");
	
	
%>

<style>
* {
	font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

.well {
	border-radius: 0px !important;
	border-radius: 4px;
	background-color: #FDFBFB !important;
	-webkit-box-shadow: inset 0 0px 0px rgba(0, 0, 0, 0.05) !important;
	box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0
		rgba(0, 0, 0, 0.19) !important;
}



.line-dashed {
	background-color: transparent;
	border-style: dashed !important;
	border-width: 0;
}

.line-lg {
	margin-top: 15px;
	margin-bottom: 15px;
}

.line {
	width: 100%;
	height: 2px;
	margin: 10px 0;
	overflow: hidden;
	font-size: 0;
}

.alert {
	margin-bottom: 0px !important;
}

.alert-warning {
	background-color: #F7F4F4 !important;
	border-color: #DCDCDC !important;
	color: black !important;
}

.label-opacity {
	opacity: 0.75;
}

.text-muted {
	color: #98a6ad;
}
/*@media screen and (min-width:768px) {
	#settings_help {
  		margin-left:295px !important;
	}
	}*/
.btn-block {
	display: block !important;
	width: 100% !important;
	font-weight: bold !important;
	padding-bottom: 10px !important;
	opacity: .78 !important;
	padding-top: 10px !important;
}

.p {
	margin: 18px 0 10px !important;
}
.error-top-view {
  	position: fixed;
    background-color: rgb(199, 73, 73);
    width: 100%;
    top: 0;
    height: 50px;
    color: #fff;
    text-align: center;
    padding-top: 15px;
    display: none;
    padding-bottom: 15px;
    z-index: 9
}
.success-top-view{
  	position: fixed;
    background-color: #3c763d;
    width: 100%;
    top: 0;
    height: 50px;
    /* color: #fff; */
    text-align: center;
    padding-top: 15px;
    display: none;
    background-color: #dff0d8;
    color: #3c763d;
    z-index: 9
}
.body-style{
	font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 14px;
    line-height: 1.42857143;
    color: #333;
    background-color: #fff;
 }
.body-style {
   content: "";
    position: absolute;
   /* background-image: url('flatfull/img/add-user-bg.png');*/
   background-color: #fdfbfb;
    background-repeat: repeat-x;
    background-size: 100%;
    filter: alpha(opacity=75);
    height: 100%;
    width: 100%;
}
.modal-content{
	-webkit-box-shadow: none !important;
	 box-shadow: none !important;
}
.input-style{
	background-color: #fff !important;
    border: 1px solid #cdcfd2 !important;
    border-radius: 3px !important;
    color: #1b2432 !important;
    font-size: .875em !important;
    height:34px !important;
    margin: 0 !important;
    padding: 0 !important;
    padding-left: 10px !important;
    transition: .15s !important;
    width: 100% !important;
}
.modal-header{
	border-bottom: none !important;
	text-align: center;
}
.intl-tel-input {

	  width: 100%;
}

.intl-tel-input .selected-flag {

	  height: 31px!important;
}

.custom-error {
	color: rgb(199, 73, 73);
	display: none;
}
.help-inline{
	color: red;
}
.field_req{
	  color: red;
}

</style>
<head>
<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery-validate/1.15.0/jquery.validate.min.js"></script>
<script src="/flatfull/lib/bootstrap.v3.min.js"></script>
<link rel="stylesheet" type="text/css"
	href="<%=CSS_PATH%>css/bootstrap.v3.min.css" />
<link type="text/css" rel="stylesheet" href="/css/phonenumber-lib/intlTelInput.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />
<script type="text/javascript" src="/lib/phonenumber-lib/intlTelInput.js"></script>
<script type='text/javascript' src='//cdn.jsdelivr.net/fingerprintjs2/1.1.2/fingerprint2.min.js'></script>

</head>
<html style="background-color: white !important;">
<body class="body-style" style="overflow-y:hidden;">
	<div id="error-area" class="error-top-view">
		<%if(StringUtils.isNotEmpty(error)){
			if(!error.equals("Already Updated")){
        		out.println(error);
        	}
    	}%>
	</div>
	<div id="success-area" class="success-top-view">
		<%if(StringUtils.isNotEmpty(successMsg)){
        out.println(successMsg);
    	}%>
	</div>
	
	<div class="image">
	<div class='container' style="overflow-y:hidden;">
		
		<div class="row" style="margin-top:50px;">
		<div class='col-sm-5' style="float:none !important;margin:0 auto;">
			<div class='well'>
				 <div class=" m-b-none" style="text-align:center;">			 
					<img src='flatfull/img/agile-crm-logo.png'>			
				</div>
				<div class="line line-lg " style="margin-top: 11px;border-bottom: 1px solid #E2DCDC"></div>
				<div  class="email-add">
					<% 
					if(StringUtils.isNotEmpty(error) && error.equals("Already Updated")) {
					 response.sendRedirect("/login?v="+id);
					 return;
					} else {%>
		    			


		    	
				<div style="font-size:16px;margin-bottom:12px;text-align:center;padding-bottom:10px">Please start by completing your profile.</div>


			<form role="form" id='agile-useradd-form' class="form-horizontal newuserform" method='post' action="/inviteuser">
					<input type='hidden' name='v' id='v' value='<%=request.getParameter("v")%>'>

					<div class="control-group form-group">
					<label class="control-label col-sm-3">Name<span class="field_req">*</span></label>
					<div class="control-group col-sm-8"> 
									         <span class="controls">
									         	<input name="name" type="text" required  class="form-control field_length input-style" max_len="100" id="cname" placeholder="Name" value="${requestScope.userName}">
									          </span> 
					</div>
					</div>
					
					<div class="control-group form-group">
					<label class="control-label col-sm-3">Email<span class="field_req">*</span></label>
					<div class="control-group col-sm-8"> 
					<input name="default-email" type="hidden" class=" form-control field_length input-style"      max_len="100" id="eaddress" placeholder="Email" value="${requestScope.user_email}" >

									         <span class="controls"> <input name="email" type="email" required class=" form-control field_length input-style" max_len="100" id="eaddress" placeholder="Email" value="${requestScope.user_email}"> </span> 
					</div>
					</div>
					<!--<input name="email" type="hidden" value="${requestScope.user_email}">-->

					<div class="control-group form-group">
					<label class="control-label col-sm-3">Password<span class="field_req">*</span></label>
					<div class="control-group  col-sm-8" > 
									         <span class="controls"> <input required class="input-large form-control input-style required"  name="password" type="password" id="password" placeholder="Password"> </span> 
					</div>
					</div>
					

					<div class="control-group form-group">
					<label class="control-label col-sm-3">Phone</label>
					<div class="control-group col-sm-8"> 
									         <span class="controls"> 
									         	<input type="text" id="cphone" class="allow-char-phone input-large form-control input-style" name="cphone" placeholder="Phone Number" autocapitalize="off" autocomplete="off" style="padding-left: 44px !important;margin-left: 0 !important;">			      
												<div class='custom-error'>Please enter valid number</div>
									          </span> 
					</div>
					</div>
					<div class="control-group form-group">
					<label class="control-label col-sm-3">Role</label>
					<div class="control-group col-sm-8"> 
									         <span class="controls"> 

									         	<select class="form-control  role-option"   name="role" style="height:34px !important;">
													<option value="" selected disabled>Role</option>
													<option value="CEO">CEO</option>
													<option value="VP">VP</option>
													<option value="VP, Sales">VP, Sales</option>
													<option value="VP, Marketing">VP, Marketing</option>
													<option value="Customer Success Manager" title="Customer Success Manager">Customer Success Manager</option>
													<option value="Sales Manager">Sales Manager</option>
													<option value="Marketing Manager">Marketing Manager</option>
													<option value="Consultant">Consultant</option>
													<option value="Reseller">Reseller</option>
													<option value="Recruiter">Recruiter</option>
													<option value="Developer">Developer</option>
													<option value="Other">Other</option>
													
						    </select>
									          </span> 
					</div>
					</div>
						<div class="control-group form-group">	

	            	<label class="control-label col-sm-3"></label> 
	            	<div class="control-group  col-sm-8">           
	              <button id="send-user-request" type="submit" style="font-size:14px;padding: 10px 0px 10px 0px;border-radius: 5px;font-weight:normal !important;" class="btn btn-md btn-block btn-primary text-xs">Update & Login</button>
					</div>
            
            	</div>
					<div class="block">
							<input class="hide" id="location_hash" name="location_hash"></input>
						</div>
						<input class="hide" id="finger_print" name="finger_print"></input>
						<input class="hide" id="ip_validation" name="ip_validation"></input>
						<input class="hide" id="browser_Name" name="browser_Name"></input>
						<input class="hide" id="browser_version" name="browser_version"></input>
						<input class="hide" id="browser_os" name="browser_os"></input>
						<input type='hidden' name='account_timezone' id='account_timezone' value=''></input>

					</form>
					
					<%}%>
				</div>

			
			

			</div>
			</div>
		</div>
		</div>
	</div>
	</div>
</body>
</html>
<script type="text/javascript">
function isValidForm(form) {
	 $(form).validate({
        rules : {
          atleastThreeMonths : true,
          multipleEmails: true,
          email: true,
          checkedMultiSelect: true,
          phone: true
        },
        debug : true,
        errorElement : 'span',
        errorClass : 'help-inline',
        ignore: ':hidden:not(.checkedMultiSelect)',
        // Higlights the field and addsClass error if validation failed
        highlight : function(element, errorClass) {
          $(element).closest('.controls').addClass('single-error');
        },
        // Unhiglights and remove error field if validation check passes
        unhighlight : function(element, errorClass) {
          $(element).closest('.controls').removeClass('single-error');
        },
        invalidHandler : function(form, validator) {
          var errors = validator.numberOfInvalids();
        },
        errorPlacement: function(error, element) {
            if (element.hasClass('checkedMultiSelect')) {
               error.appendTo($(element).parent());
              } else {
                  error.insertAfter(element);
              }
        }
      });
	  return $(form).valid();
}
</script>
<script type="text/javascript">
			// localStorage setup
			var _agile_storage = {
				key : "_agile_user_fingerprint",
				get : function(key){
					if(!key)
						key = this.key;

					if(!this.is_strorage_supports())
						 return;
					return localStorage.getItem(key);
				},
				set :  function(val, key){
					if(!key)
						key = this.key;

					if(this.is_strorage_supports())
						localStorage.setItem(key, val);
				},
				is_strorage_supports : function(){
					return (typeof localStorage ? true : false);
				}
			};		
			
			function _agile_get_fingerprint(callback){
					
					// Get stored value
					var finger_print = _agile_storage.get();
					if(finger_print)
						return callback(finger_print);
	
					// Load js and fetch print
					new Fingerprint2().get(function(result, components){
							return callback(result);
					});
			}
	      	
			function randomString(length) {
				length = length || 32;
				var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
			    var result = '';
			    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
			    return result;
			}

      		// Get print value to notify user 
			_agile_get_fingerprint(function(result){
				if(!result)
					 return;

				$("#finger_print").val(result);
				// Reset val
				_agile_storage.set(result);
			});

			
			
		</script>
<script type="text/javascript">
	$(document).ready(function(e) {
		if($("#error-area").text().trim())
    				$("#error-area").slideDown("slow");
    	if($("#success-area").text().trim())
    				$("#success-area").slideDown("slow");

    
		
		
		/*$("#send-user-request").on('click', function(e) {
			e.preventDefault();
			if(!isValidForm($("#agile-useradd-form")))
				return;
			var formjson = getFormData($("#agile-useradd-form"));

			$.ajax({
			 url : '/inviteuser',
			  type:"POST",
			  data:formjson,
			  contentType:"application/x-www-form-urlencoded;",
			  success: function(data){
			   console.log("success");
			   $("#success-area").slideDown("slow").slideDown().html('<%=successMsg%>');
			   setTimeout(function(){
   					$("#success-area").hide();
   				},5000);
			    //window.location.href = redirectHomeURL;
			   	$('input').not("#eaddress").val("")
			  },
			  error: function(error){
			  	console.log("errorMessage");
			  	$("#error-area").slideDown("slow").slideDown().html('<%=errorMessage%>');
			  	setTimeout(function(){
   					$("#error-area").hide();
   				},5000);
			  }
			});
			if($("#error-area").text().trim())
    				$("#error-area").slideDown("slow");
    		if($("#success-area").text().trim())
    				$("#success-area").slideDown("slow");
		});*/
		
		var telInput = $("#cphone");

		telInput.blur(function() { console.log("blur"); console.log($.trim(telInput.val()) + " : " + telInput.intlTelInput("isValidNumber"));
			  if ($.trim(telInput.val()) && telInput.intlTelInput("isValidNumber")) {
			        $(".custom-error").hide();
			  } else {
			     $(".custom-error").show();
			  
		}	});

		$("#cphone").intlTelInput({
				utilsScript: "lib/phonenumber-lib/utils.js",
				responsiveDropdown : true
			});
		
		// Validates the form fields
		function isUserFormValid()
		{
			if( !($('#finger_print').val()) )
			{
				console.log("No value in fingerprint");
				var fingerprint = randomString();
				
				$('#finger_print').val(fingerprint);
				
				_agile_storage.set(fingerprint);
				console.log("Generated fingerprint: " + fingerprint);
			}
			
			return true;
		}

		function getFormData($form) {
			var unindexed_array = $form.serializeArray();
			var indexed_array = {};
			$.map(unindexed_array, function(n, i) {
				indexed_array[n['name']] = n['value'];
			});
			return indexed_array;
		}

		// localStorage setup
		var _agile_storage = {
			key : "_agile_user_fingerprint",
			get : function(key){
				if(!key)
					key = this.key;

				if(!this.is_strorage_supports())
					 return;
				return localStorage.getItem(key);
			},
			set :  function(val, key){
				if(!key)
					key = this.key;

				if(this.is_strorage_supports())
					localStorage.setItem(key, val);
			},
			is_strorage_supports : function(){
				return (typeof localStorage ? true : false);
			}
		};		
		function _agile_get_fingerprint(callback){
				
				// Get stored value
				var finger_print = _agile_storage.get();
				if(finger_print)
					return callback(finger_print);

				// Load js and fetch print
				new Fingerprint2().get(function(result, components){
						return callback(result);
				});
		}

		// Language Detection
		

		var BrowserDetect = {
			init : function() {
				this.browser = this.searchString(this.dataBrowser)
						|| "An unknown browser";
				this.version = this.searchVersion(navigator.userAgent)
						|| this.searchVersion(navigator.appVersion)
						|| this.searchMobileVersion(navigator.userAgent)
						|| "An unknown version";
				this.OS = this.searchString(this.dataOS) || "unknown";
			},
			searchString : function(data) {
				for ( var i = 0; i < data.length; i++) {
					var dataString = data[i].string;
					var dataProp = data[i].prop;
					var match = data[i].match;
					this.versionSearchString = data[i].versionSearch
							|| data[i].identity;

					if (match && dataString.match(match))
						return data[i].identity;

					if (dataString) {
						if (dataString.indexOf(data[i].subString) != -1)
							return data[i].identity;
					} else if (dataProp)
						return data[i].identity;
				}
			},
			searchMobileVersion : function(dataString) {

				try {
					match = dataString.match(/Mobile Safari\/([\d.]+)/);
					if (match)
						return parseFloat(match[1]);
				} catch (e) {
				}

			},
			searchVersion : function(dataString) {

				var index = dataString.indexOf(this.versionSearchString);
				if (index == -1)
					return;
				return parseFloat(dataString.substring(index
						+ this.versionSearchString.length + 1));
			},
			dataBrowser : [ {
				string : navigator.userAgent,
				subString : "Chrome",
				identity : "Chrome"
			}, {
				string : navigator.userAgent,
				subString : "OmniWeb",
				versionSearch : "OmniWeb/",
				identity : "OmniWeb"
			}, {
				string : navigator.vendor,
				subString : "Apple",
				identity : "Safari",
				versionSearch : "Version"
			}, {
				prop : window.opera,
				identity : "Opera"
			}, {
				string : navigator.vendor,
				subString : "iCab",
				identity : "iCab"
			}, {
				string : navigator.vendor,
				subString : "KDE",
				identity : "Konqueror"
			}, {
				string : navigator.userAgent,
				subString : "Firefox",
				identity : "Firefox"
			}, {
				string : navigator.vendor,
				subString : "Camino",
				identity : "Camino"
			}, { // for newer Netscapes (6+)
				string : navigator.userAgent,
				subString : "Netscape",
				identity : "Netscape"
			}, {
				// For IE11
				string : navigator.userAgent,
				match : /Trident.*rv[ :]*11\./,
				identity : "Explorer"
			}, {
				string : navigator.userAgent,
				subString : "MSIE",
				identity : "Explorer",
			}, {
				string : navigator.userAgent,
				match : /Mobile Safari\/([\d.]+)/,
				identity : "Mobile Safari",
				versionSearch : "/AppleWebKit\/([\d.]+)/",
			}, {
				string : navigator.userAgent,
				subString : "Gecko",
				identity : "Mozilla",
				versionSearch : "rv"
			}, { // for older Netscapes (4-)
				string : navigator.userAgent,
				subString : "Mozilla",
				identity : "Netscape",
				versionSearch : "Mozilla"
			} ],
			dataOS : [ {
				string : navigator.platform,
				subString : "Win",
				identity : "Windows"
			}, {
				string : navigator.platform,
				subString : "Mac",
				identity : "Mac"
			}, {
				string : navigator.userAgent,
				match : /Android\s([0-9\.]*)/,
				subString : "Android",
				identity : "Android"
			}, {
				string : navigator.userAgent,
				subString : "iPhone",
				identity : "iPhone/iPod"
			}, {
				string : navigator.platform,
				subString : "Linux",
				identity : "Linux"
			}

			]

		};
		BrowserDetect.init();
		$('#browser_os').val(BrowserDetect.OS);
		$('#browser_Name').val(BrowserDetect.browser);
		$('#browser_version').val(BrowserDetect.version);
});
		
	
		
</script>
</html>