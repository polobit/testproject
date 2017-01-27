<%@page import="java.util.HashSet"%>
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
<%@page import="java.util.ArrayList" %>

<%
	String _AGILE_VERSION = SystemProperty.applicationVersion.get();

	System.out.println("In new JSP file");

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

	String redirectHomeURL = (String)request.getSession().getAttribute("RedirectionHomeURL");
	//String redirectHomeURL = request.getParameter("redirectionurl");
	System.out.println("After JSP code in new file");
	//List<String> restrictedDomains = new List<String>();
	//restrictedDomains.add("zoho").add("yandex").add("hotmail").add("yahoo").add("");
	String[] restrictedDomains = {"zoho","yandex","hotmail","yahoo","aol","outlook","rossbergercom","fastmail","usa.gov","yopmail","gmail"};
	String email = (String)request.getSession().getAttribute("Email");
	//String email="hi@yopmail.com";
	boolean is_restricted= false;
	String email_domain="";
	if(email != null){
	  email_domain = (email.split("@")[1]).split("\\.")[0];
	}
	
	for(int k =0;k<restrictedDomains.length;k++){
		if(StringUtils.equalsIgnoreCase(restrictedDomains[k], email_domain)){
			  is_restricted = true;
			  break;
		}
	}
	
	

%>
<!DOCTYPE html>
<html lang="en" style="background-color: white !important;">
<head>
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
/*.imageheight:before{
	 content: "";
    position: absolute;
    background-image: url('flatfull/img/add-user-bg.png');
    background-color: #fdfbfb;
    background-repeat: repeat-x;
    background-size: 100%;
    opacity: 0.75;
    filter: alpha(opacity=75);
    width: 100%;
    height: 100%
}*/
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
.help-inline{
	color: red;
}
.text-11{
font-size : 11px;
}
.field_req {
    color: red;
}
.align-center{
	text-align: center;
}
a{
	color: #428bca !important;
}
@media all and (max-width: 768px) {
	.add-user{
		padding-right: 0px !important;
	}
}
.removeUser .remove-user{
	 visibility:hidden;
}
.removeUser:hover .remove-user{
	visibility:visible;
}


</style>

<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.min.js'></script>
<script type="text/javascript" src="flatfull/lib/jquery.validate.min.js"></script>
<script src="/flatfull/lib/bootstrap.v3.min.js"></script>
<link rel="stylesheet" type="text/css"
	href="<%=CSS_PATH%>css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css" href="/flatfull/css/app.css" />
</head>

<body class="body-style" >
	<div class="imageheight" style="position:relative;">
	<div id="error-area" class="error-top-view"></div>
	<div class='container' >
		<div class="row"></div><br/>
		<div class="row" >
			<div class="align-center m-b-xs"style="font-size:18px;"> Congratulations, you have signed up successfully!</div>
			<div class="align-center m-b-xs text-md">
			  Invite your colleagues for successful CRM implementation.

			</div>
		<div class="col-sm-5" style="float: none !important;margin: 0 auto;">
			<div class='well'>
				 <div class=" m-b-none" style="text-align:center;margin-top:-15px">			 
					<img src='flatfull/img/agile-crm-logo.png' style="margin-bottom:-5px;width:130px">			
				</div>
				<div class="line line-lg " style="margin-top: 11px;border-bottom: 1px solid #E2DCDC"></div>
				<div  class="email-add">
			<form role="form" id='agile-useradd-form' class="form-horizontal newuserform" onsubmit="return false;">
					<div id="Sales_Team">
					<div class="control-group align-center">
					<label style="font-weight: 600;color: #736f6f;">Sales</label>
					<div class="control-group"> 
									      
					</div>
					</div>
					
					<div class="control-group form-group users" >
					<label class="control-label col-sm-3">User <span class="number">1</span></label>
					<div class="control-group col-sm-8 removeUser pos-rlt" id="sales-form-group"> 
									         <span class="controls" > 
									         	<input  name="temp1" type="email" class="form-control input-style"  pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"  placeholder="Email Address"> </span> 
									         	 <a class="remove-user pos-abt hide"   title="Close" data-placement="bottom" style="position:absolute;top:6px;right:0px">&times;</a>
									        
					</div>
					</div>
					
					<div class="control-group form-group users">
					<label class="control-label col-sm-3">User <span class="number">2</span></label>
					<div class="control-group col-sm-8 removeUser pos-rlt"> 
									         <span class="controls"> <input name="temp2"  pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$" type="email" class=" form-control input-style "   placeholder="Email Address"> </span>
									        <a class="remove-user pos-abt"   title="Close" data-placement="bottom" style="position:absolute;top:6px;right:0px">&times;</a>
									        
					</div>

					</div>
					<div id="newuser_sales"></div>
					<a id="another-user-add-sales" class=" add-user text-info text-11 text-right block m-t-n-sm " style="padding-right: 38px;"><img src='flatfull/img/addInviteUser.svg' style="height:12px;margin-top:-4px;"> <span>Add User</span>
	            	</a>
	            	</div>
					<div id="marketing_team">
	            		<div class="control-group align-center m-b-xs">
							<label class="control-label" style="font-weight: 600;color: #736f6f;">Marketing
							</label>
							<div class="control-group "> 
							</div>
						</div>
						<div class="control-group form-group users">
							<label class="control-label col-sm-3">User 
								<span class="number">1</span>
							</label>
							<div class="control-group col-sm-8 removeUser pos-rlt" id="marketing-form-group"> 
								<span class="controls"> 
									<input name="temp5" type="email" class=" form-control input-style" pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"   placeholder="Email Address"> 
								</span> 
								<a class="remove-user pos-abs hide"   title="Close" data-placement="bottom" style="position:absolute;top:6px;right:0px">&times;
								</a>
									        
							</div>
						</div>
						<div class="control-group form-group users">
							<label class="control-label col-sm-3">User 
								<span class="number">2</span>
							</label>
							<div class="control-group col-sm-8 removeUser pos-rlt"> 
								<span class="controls"> 
									<input name="temp6" type="email" class=" form-control input-style" pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"  placeholder="Email Address"> 
								</span>
								<a class="remove-user pos-abs"  title="Close" data-placement="bottom" style="position:absolute;top:6px;right:0px">&times;
								</a>
									        
							</div>
						</div>
						<div id="newuser_marketing">
						</div>
						<a id="another-user-add-marketing" class="add-user  text-info text-11 text-right block m-t-n-sm " style="padding-right: 38px;"><img style="height:12px;margin-top:-4px;" src='flatfull/img/addInviteUser.svg' > <span>Add User</span>
	            		</a>
					</div>
					<div id="support_team">
						<div class="control-group align-center m-b-xs">
							<label class="control-label " style="font-weight: 600;color: #736f6f;">Support
							</label>
							<div class="control-group"> 
							</div>
						</div>
						<div class="control-group form-group users">
							<label class="control-label col-sm-3">User 
								<span class="number">1</span>
							</label>
							<div class="control-group col-sm-8 removeUser pos-rlt" id="support-form-group"> 
								<span class="controls"> 
									<input name="temp3" pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"  type="email" class=" form-control input-style "   placeholder="Email Address"> 
								</span> 
								<a class="remove-user pos-abs hide"   title="Close" data-placement="bottom" style="position:absolute;top:6px;right:0px">&times;
								</a>
									        
							</div>
						</div>
						<div class="control-group form-group users ">
							<label class="control-label col-sm-3">User 
								<span class="number">2</span>
							</label>
							<div class="control-group col-sm-8 removeUser pos-rlt"> 
								<span class="controls"> 
									<input name="temp4"  type="email" class=" form-control input-style " pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"  placeholder="Email Address"> 
								</span>
								<a class="remove-user pos-abs"   title="Close" data-placement="bottom" style="position:absolute;top:6px;right:0px">&times;
								</a>
									         
							</div>
						</div>
						<div id="newuser_support">
						</div>
						<a id="another-user-add-support" class="add-user text-info text-11 text-right block m-t-n-sm" style="padding-right: 38px;"><img style="height:12px;margin-top:-4px;" src='flatfull/img/addInviteUser.svg'> 
							<span>Add User</span>
            			</a>
	            	</div>
					<div class="line line-lg " style="margin-top: 11px;border-bottom: 1px solid #E2DCDC"></div>
					
					 <button id="send-user-request-enter" style="width:40%;padding: 10px 0px 10px 0px;" class="btn btn-lg btn-primary pull-right text-xs hide" tabindex="2" type="submit">Invite Users</button> 
						

					</form>

					 <div style="display:table;width:75%;margin:15px auto;" class="m-b-none">
		              <button id="send-user-request" style="width:40%;padding: 10px 0px 10px 0px;" onclick="track_event('invite user-invited');" class="btn btn-lg btn-primary pull-right text-xs" tabindex="2" type="submit">Invite Users</button> 
		              <a href="<%=redirectHomeURL%>"  tabindex="1" style="padding: 10px 0px 10px 0px;" class="inline-block  redirect-to-panel text-info text-11 pull-right  m-r" id="skip" onclick="track_event('invite user-skip');return false;">Skip</a>


	            	</div>

					 
					
					

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
var redirectHomeURL = '<%=redirectHomeURL%>';
var restricted = '<%=is_restricted%>';
var emailDomain = '<%=email_domain%>';
var email = '<%=email%>';

	$(document).ready(function(e) {
		load_analytics_code();
		$("a.redirect-to-panel").click(function(){
			if($(this).attr("disabled"))
				return false;
			$(this).attr("disabled", "disabled");
			$("#send-user-request").addClass("disabled");

			window.location.href = redirectHomeURL;
		});

		 $('[data-toggle="tooltip"]').tooltip();

		if(restricted == 'false'){
			if(emailDomain != ''){
			console.log($("#sales-form-group"));
			$("#sales-form-group").find('input').val("sales@"+emailDomain+".com");
			$("#support-form-group").find('input').val("support@"+emailDomain+".com");
			$("#marketing-form-group").find('input').val("info@"+emailDomain+".com");
		}
		}

		$("#send-user-request").on("click",function(e){
			$("#send-user-request-enter").trigger("click");
		});

		$("#send-user-request-enter").on('click', function(e) {

			var list = [];
			console.log(restricted);
			console.log(emailDomain);
			
			// Return if action is already in process 
			if($("#send-user-request").hasClass("disabled"))
				return;

			if(!isValidForm("#agile-useradd-form"))
				return;

			var duplicate=false;
    
		    $('input[type^=email]').each(function(){
		        var $this = $(this);
		        if ($this.val()===''){ return;}
		        $('input[type^=email]').not($this).each(function(){
		            if ( $(this).val().toLowerCase() == $this.val().toLowerCase()) {duplicate=true;}
		        });
		    });
		    if(duplicate){
		    	$("#error-area").slideDown("slow").html("Duplicate emails found.");
		    	setTimeout(function(){
	   					$("#error-area").hide();
	   				},5000);
		    	return;
		    }
	
			$("#agile-useradd-form input").each(function(index, ele){
                   if(!$(ele).val())
                   	    return;

                   	list.push({email : $(ele).val()});
			});
			var JSONdata = JSON.stringify(list);

			if(JSONdata.length == 2){
				$("#error-area").slideDown("slow").html("Please enter atleast one email address.");
				setTimeout(function(){
	   					$("#error-area").hide();
	   				},5000);
				return;
			}

			if(list.length > 9){
				$("#error-area").slideDown("slow").html("Sorry, you can invite upto 9 users only.");
				setTimeout(function(){
	   					$("#error-area").hide();
	   				},5000);
				return;
			}

			$("#send-user-request").addClass("disabled");
			$("a.redirect-to-panel").attr("disabled", "disabled");

			$.ajax({
				  url:'core/api/invited-user-emails',
				  type:"POST",
				  data:JSONdata,
				  contentType:"application/json; charset=utf-8",
				  dataType:"json",
				  success: function(){
				    console.log("success");
				    window.location.href = redirectHomeURL;
				    
				  },
				  error: function(error){
				  	$("#send-user-request").removeClass("disabled");
				  	$("a.redirect-to-panel").removeAttr("disabled");
				  	console.log("error");
				  	$("#error-area").slideDown("slow").slideDown().html(error.responseText);
				  	setTimeout(function(){
	   					$("#error-area").hide();
	   				},5000);
				  }
			});
			
		});

		/*function getFormData($form) {
			var unindexed_array = $form.serializeArray();
			var indexed_array = {};

			$.map(unindexed_array, function(n, i) {
				indexed_array[n['name']] = n['value'];
			});

			return indexed_array;
		}*/
	});

	$("body").on('click',".add-user",function(){
		var c =  $("#agile-useradd-form").find(".users");
		var id = $(this).prop("id");
			var g = c[0];
			switch(id){
			case "another-user-add-sales" :
			    var number = $(this).closest("div").find(".users").length;
			    /*if(number == 1){
			    	$(g).find(".removeUser").append('<a class="remove-user pos-abt"   title="Close" data-placement="bottom" style="position:absolute;top:6px;right:0px">&times;</a>');
			    }*/
			    number++;
			    var spanvalue = $(g).find('label span').text();
			    var $el = $(g.outerHTML.replace(spanvalue , number));
			   	$el.find("input").attr('name','sales'+number);
				$("#newuser_sales").append($el);
				var userlength = $("#newuser_sales").find(".users").length;
				if(userlength == 1){
					$("#newuser_sales").find(".users").find(".remove-user").removeClass("hide");
				}
				$("#newuser_sales").find(".users").find(".remove-user").removeClass("hide");
				if(number == 9){
					//$("#another-user-add-sales").remove();
					$("#another-user-add-sales").addClass("hide");
				}
				break;
			case "another-user-add-support" :
			    var number = $(this).closest("div").find(".users").length;
			    number++;
			    var spanvalue = $(g).find('label span').text();
			    var $el = $(g.outerHTML.replace(spanvalue , number));
			   	$el.find("input").attr('name','support'+number);
				$("#newuser_support").append($el);
				var userlength = $("#newuser_support").find(".users").length;
				if(userlength == 1){
					$("#newuser_support").find(".users").find(".remove-user").removeClass("hide");
				}
				$("#newuser_support").find(".users").find(".remove-user").removeClass("hide");
				if(number == 9){
					//$("#another-user-add-support").remove();
					$("#another-user-add-support").addClass("hide");
				}
				break;

			case "another-user-add-marketing":
			    var number = $(this).closest("div").find(".users").length;		   
			    number++;
			    var spanvalue = $(g).find('label span').text();
			    var $el = $(g.outerHTML.replace(spanvalue , number));
			    $el.find("input").attr('name','marketing'+number);
				$("#newuser_marketing").append($el);
				var userlength = $("#newuser_marketing").find(".users").length;
				if(userlength == 1){
					$("#newuser_marketing").find(".users").find(".remove-user").removeClass("hide");
				}
				$("#newuser_marketing").find(".users").find(".remove-user").removeClass("hide");
				if(number == 9){
					//$("#another-user-add-marketing").remove();
					$("#another-user-add-marketing").addClass("hide")
				}
				break;
			}
		

	});


	$('body').on('click','.remove-user',function(e){
		console.log("sfasda");
		var length = $(this).closest("div").closest("div").closest(".users").parent().find(".form-group").length;
		
	
		var id = $(this).closest("div").closest("div").closest(".users").parent().parent().attr("id");
		if(id == "agile-useradd-form"){
			id = $(this).closest("div").closest("div").closest(".users").parent().attr('id');
		}
		/*if(length == 1){
				$(this).closest("div").closest("div").closest(".users").parent().remove();
			}*/
				
			$(this).closest("div").closest("div").closest(".users").remove();

		
		var noOfEmails = $("#"+id).find(".users").length;
		for(m=0;m<noOfEmails;m++){
			var eachEmail = $("#"+id).find(".number")[m];
			$(eachEmail).html(m+1);
		}
		if(noOfEmails < 9){
			switch($("#"+id).attr("id")){
				case "support_team":
						$("#another-user-add-support").removeClass("hide");
						break;
				case "Sales_Team" :
						$("#another-user-add-sales").removeClass("hide");
						break;
				case "marketing_team" :
						$("#another-user-add-marketing").removeClass("hide");
						break;

			}
			
		}
	});
	/** Google analytics code **/
	function load_analytics_code(){

		  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
		  ga('create', 'UA-44894190-1', 'auto');
		  ga('send', 'pageview');
		  ga('create', 'UA-75813054-1', {'name':'b'});
		  ga('b.send', 'pageview');
	}
	function track_event(event){
		if(window.location.href.indexOf("localhost") > 0)
			return;
		ga('b.send', 'event', 'Agile Dashboard', event, email.toLowerCase());
	}

	
		
</script>
</html>