<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.ticket.utils.TicketNotesUtil"%>
<%@page import="java.lang.*"%>
<%
//flatfull path
String flatfull_path="/flatfull";

String error = "", success = "";
System.out.println(success);
String feedback = request.getParameter("feedback");
Long note_id = Long.parseLong(request.getParameter("note"));
DomainUser domainUser = null;
if (!StringUtils.isEmpty(feedback)) {
	TicketNotesUtil.savefeedback(note_id, feedback);
		
	success = "Your Feedback is successfully submmited.Add a comment about the quality of support you received.";
}
else if(!StringUtils.isEmpty(feedback) || note_id == null )
{
    	    error = "Sorry we are not able to save your feedback Please try submitting again";
		
	
			System.out.println(error + " " + success);
}

//Static images s3 path
String S3_STATIC_IMAGE_PATH = VersioningUtil.getStaticFilesBaseURL().replace("flatfull/", "");
%>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="globalsign-domain-verification"
	content="-r3RJ0a7Q59atalBdQQIvI2DYIhVYtVrtYuRdNXENx" />
<title>Feed Back</title>

<meta name="viewport"
	content="width=device-width, initial-scale=1.0 maximum-scale=1">
<meta name="description" content="">
<meta name="author" content="">

<!-- Le styles -->

<!-- <link href="/css/bootstrap-pink.min.css" rel="stylesheet">
<link href="/css/bootstrap-responsive.min.css" rel="stylesheet">
<link type="text/css" rel="stylesheet" href="/css/openid-min.css">
<link type="text/css" rel="stylesheet" href="/css/signin.css"> -->

<link rel="stylesheet" type="text/css"
	href="<%=flatfull_path%>/css/bootstrap.v3.min.css" />
<link rel="stylesheet" type="text/css"
	href="<%=flatfull_path%>/css/font.css" />
<link rel="stylesheet" type="text/css"
	href="<%=flatfull_path%>/css/app.css" />
<link rel="stylesheet"
	href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>

<style>
body {
	background-color: #fff;
}

.text-white {
	color: #fff !important;
}

input {
	color: #000 !Important;
}

a:hover {
	text-decoration: underline;
}

.error {
	color: red !important;
}

.text-area {
	height: 117px;
	width: 532px;
	margin-top: 7px;
    margin-left: 34px;
}

.close {
	color: #000 !important;
}

.alert-success {
	color: #3c763d !important;
}

@media all and (max-width: 767px) {
	body {
		background-size: cover;
	}
}

<!--
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
.transperantbutton{
background: none!important;
    border: none;
    padding: 0!important;
    font: inherit;
    cursor: pointer;
}
-->
</style>

<!-- JQUery Core and UI CDN -->
<!-- <script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
<script type="text/javascript" src="/lib/bootstrap.min.js"></script>

<script type="text/javascript" src="/lib/jquery.validate.min.js"></script> -->
<script type='text/javascript'
	src='<%=flatfull_path%>/lib/jquery-new/jquery-2.1.1.min.js'></script>
<script type="text/javascript"
	src="<%=flatfull_path%>/lib/bootstrap.v3.min.js"></script>

<!--[if lt IE 10]>
<script src="flatfull/lib/ie/placeholders.jquery.min.js"></script>
<![endif]-->
<!-- <script type="text/javascript">
jQuery.validator.setDefaults({
	debug: true,
	success: "valid"
});;
</script> -->

<!-- Le HTML5 shim, for IE6-8 support of HTML5 elements -->
<!--[if lt IE 9]>
      <script src="lib/ie/html5.js"></script>
    <![endif]-->

</head>

<script>
var id = <%=note_id%>
</script>
<body>

	<div class="app" id="app">
		<div ui-view="" class=" smooth">

			<div class="container w-auto-xs">

				<div id="addfeedback-message" style="margin-left: 0px;">
				<a href="https://www.agilecrm.com/" class="navbar-brand block text-white m-t" style="color: #363f44;">
						<img  src="https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container" style="max-height: 50px;">
					</a>
			<div style="box-shadow: 2px 2px 2px 2px;width: 700px;margin: auto;">

				<form name='feedback_ticket' id="feedback_ticket" method='post'
					 onsubmit="saveTicketFeedback(event)" style="margin-left: 34px;">
					
					<% if(!StringUtils.isEmpty(error)){%>
					<div class="alert alert-danger error login-error m-b-none">
						<a class="close m-t-n-sm" data-dismiss="alert" href="#">&times</a><%=error%>
					</div>
					


					<%}%>
					<% if(!StringUtils.isEmpty(success)){%>
							<table width="60%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 40px;">
                     <tbody>
                         <tr>
                         	<td  width="50%"style="padding-top: 20px;padding-left: 34px;">How would you rate the support recived?</td>
                             <td width="5%" style="padding-left:7px">
								 <span style=" font-size: 130%;padding-left: 8px; visibility:hidden;" id="YAY">&#10004;</span>	
															
                             	<input type="image" src="/flatfull/img/smile.svg" style="line-height: 25px;font-size: 12px; width: 25px;" class="transperantbutton" id="YAY_Image" value="YAY"  onclick="changeFeedback(event,this)"/>
	                         </td>
		                     <td width="5%" style="padding-left:10px">	
		                      <span style="font-size: 130%;padding-left: 8px; visibility:hidden;" id="OK">&#10004;</span>
                             	<input type="image" src="/flatfull/img/speechless.svg" style="line-height: 25px;font-size: 12px; width: 25px;" id="OK_Image" class="transperantbutton" value="OK" onclick="changeFeedback(event,this)"/>
		                     </td>
		                      
		                     <td width="5%" style="padding-left:10px">
                             <span style="font-size: 130%;padding-left: 8px; visibility:hidden;" id="BOO">&#10004;</span>
                             	<input type="image" src="/flatfull/img/angry.svg" style="line-height: 25px;font-size: 12px; width: 25px;" class="transperantbutton" id="BOO_Image" value="BOO" onclick="changeFeedback(event,this)"/>		                     
                             </td>
                         </tr>
                     </tbody>
                 </table>
					
					<%}%>
					<!--  <h3><small>Enter Your Email </small></h3>	 -->
					
					<div class="list-group-sm" style="padding-top: 14px;">

						<span style="color:#2B2929;padding-left:33px;font-size:14px;font-size: 15px;">Add a Comment about the quality of support you received:</span>
						
						<textarea class="text-area" id="myTextarea" name='comment' style="padding-top:5px;padding-left:10px;font-size:14px;"></textarea>

					</div>
					<div>
					<input type='submit'  style="width: 10%; margin-left: 34px;float:left; margin-right:15px;margin-left:412px;"
						class='btn btn-sm btn-primary btn-block '>
					<input type='button'  style="width: 10%; margin-left: 34px;"
						class='btn btn-sm btn-primary btn-block ' onclick="functioncancel()" value="Cancel"/>		
					</div>	 
						<br/>
						<br/>
				</form>
			
			</div>
		</div>
	</div>
	</div>	
<script>
 feedback = "<%=feedback%>";
var thick = document.getElementById(feedback);
thick.style.visibility="visible";
if(feedback == "BOO" || feedback == "OK")
{
	var d = document.getElementById("myTextarea");
	d.required = true;
}

function functioncancel(){
document.getElementById("addfeedback-message").innerHTML = "<div style=font-size:20px;padding-left:40px;text-align:center;>No feedback was submitted!</div>";

}

function changeFeedback(e,objButton){
	e.preventDefault();
	document.getElementById(feedback).style.visibility="hidden";
	document.getElementById(objButton.value).style.visibility="visible";
	feedback = ""+objButton.value;
	var d = document.getElementById("myTextarea");
	d.required = false;
	if(feedback == "BOO" || feedback == "OK")
	d.required = true;
}
</script>
	<script type="text/javascript">		
	var id = <%=note_id%>
	var json = {};
		//saves the feedback commentsto the ticket notes based on notes id. 
		function saveTicketFeedback(e){
			e.preventDefault();
			var data = document.getElementById("myTextarea").value;
			json.id = id;
			json.feed_back = feedback;
			 var data = decodeURI(data);
			data.replace(new RegExp("\\+","g"),' ');
			json.feedback_comment = data;
			$.ajax({ type : 'PUT', 
				url : 'feedbackapi/api/tickets/notes/feedback-comment/'+id, 
				data : json,
				success:function(){
					console.log(json);	
					document.getElementById("addfeedback-message").innerHTML = "<div style=font-size:20px;padding-left:40px;text-align:center;>Your feedback submitted successfully!</div>";
				}
				
		});
			
			
		}	
			
		    
		</script>
</body>
</html>