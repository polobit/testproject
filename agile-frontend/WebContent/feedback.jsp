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
String feedback_rating = feedback;


if(!StringUtils.isEmpty(feedback) || note_id == null )
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

label{
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 15px;
    font-family: Arial;
}


.text-white {
	color: #fff !important;
}

input {
	color: #000 !Important;
}

a:hover {
	text-decoration: none;
}

.error {
	color: red !important;
}

.text-area {
	height: 117px;
	width: 444px;
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
.well {
    border-radius: 0px !important;
    border-radius: 4px;
    background-color: #FDFBFB !important;
    -webkit-box-shadow: inset 0 0px 0px rgba(0,0,0,0.05);
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2), 0 3px 10px 0 rgba(0, 0, 0, 0.19);
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
<div class="container">

		
		<div class="row"></div><br>

		<!-- Already have an account -->
		<div  style="margin-top:25px;">
		<div class="col-sm-6 col-sm-offset-3">
		<!--<h5 class="ac">Already have an account? <small>Enter your details</small></h5>-->
		<div class="well" id="addfeedback-message">

		<form role="form" id="agile-form" class="form-horizontal"  onsubmit="saveTicketFeedback(event)">
			 <div class="form-group m-t m-b-none" style="text-align:center;background-color:#FDFBFB;vertical-align: middle;margin-top: 0px;margin-bottom: 14px !important;">			 
				<img  src="/img/agile-crm-logo.png">			
			</div>
			<div class="line line-lg " style="margin-top: 11px;border-bottom: 1px solid #E2DCDC"></div>
			<div style="display: table;width: 70%;margin: 0 auto;">
			<div class="form-group" style="margin-top:10px;">
			<label class="label-opacity" >How would you rate the support recived?</label>
                             	

			<div class="input-group">
				<input type="image" src="/img/star-off.png" style="width:24px;float:left" class="transperantbutton" id="1_Image" value="1"  onclick="changeFeedback(event,this);"/>
                             	<input type="image" src="/img/star-off.png" style="width:24px;float:left" class="transperantbutton" id="2_Image" value="2"  onclick="javascript:return changeFeedback(event,this)"/> 
                             	<input type="image" src="/img/star-off.png" style="width:24px;float:left" class="transperantbutton" id="3_Image" value="3"  onclick="changeFeedback(event,this)";/>
                             	<input type="image" src="/img/star-off.png" style="width:24px;float:left" class="transperantbutton" id="4_Image" value="4"  onclick="changeFeedback(event,this);"/>
                             	<input type="image" src="/img/star-off.png" style="width:24px;float:left" class="transperantbutton" id="5_Image" value="5"  onclick="changeFeedback(event,this);"/>

			</div>
			</div>
			
			<div class="form-group">
				<label class="label-opacity" for="inputEmail">Comments:</label>
				
				<textarea class="text-area" id="myTextarea" name='comment' style="padding-top:5px;padding-left:10px;font-size:14px;"></textarea>
			</div>
			
			<div>
				<div class="col-sm-4"></div>
			<div class="col-sm-8" style="margin-left: 296px;margin-bottom: 18px;">
            <div>                      
               
               <!-- <input type='button'  style="width: 15%;float:left; margin-right:15px;margin-left:274px;"
						class='btn btn-sm btn-primary btn-block ' onclick="functioncancel()" value="Cancel"/>
					<input type='submit'  style="width: 15%; margin-left: 34px;"
						class='btn btn-sm btn-primary btn-block '> -->
            	<button onclick="functioncancel()" data-dismiss="modal" class="btn btn-sm btn-default">Cancel</button>
            	<button id="create-ticket"  class="btn btn-sm btn-primary save" data-loading-text="Create">Submit</button>
            </div>
            </div>
            </div>
        	</div>
            <div class="line line-lg " style="margin-top: 11px;border-bottom: 1px solid #E2DCDC"></div>

           	<div>

			<div class="col-sm-4"></div>
			<div class="col-sm-6">
			<a target="_blank" href="https://www.agilecrm.com" class="text-muted">Powerd by AgileCRM</a>
			</div>
			</div>
			<div class="row"></div>

		</form>
		</div>
		</div>
		</div>
	</div>					
					
<script>
 feedback = "<%=feedback%>";
feedback_rating = "<%=feedback_rating%>";
for(var i=1;i<=feedback_rating;i++){
	var image = document.getElementById(i+"_Image")
	if(image.src.includes("star-off.png") )
	image.src="/img/star-on.png";		
		}
if(feedback_rating < 3)
{
	var d = document.getElementById("myTextarea");
	d.required = true;
}

function functioncancel(){
document.getElementById("addfeedback-message").innerHTML = "<div style=font-size:20px;padding-left:40px;text-align:center;>No feedback was submitted!</div>";

}

function changeFeedback(e,objButton){
	e.preventDefault();
	feedback_rating = ""+objButton.value;
	var d = document.getElementById("myTextarea");
	d.required = false;
	if(feedback_rating < 3)
	d.required = true;
	if(objButton.src.includes("star-off.png") ){
		for(var i=1;i<=feedback_rating;i++){
			var image = document.getElementById(i+"_Image")
			if(image.src.includes("star-off.png") )
				image.src="/img/star-on.png";		
		}
	}	
	else{
		
		for(i=5;feedback_rating<i;i--){
			var image = document.getElementById(i+"_Image")
			if(image.src.includes("star-on.png") )
				image.src="/img/star-off.png";		
			
		}
	}	
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
			json.feed_back = feedback_rating;
			 var data = decodeURI(data);
			data.replace(new RegExp("\\+","g"),' ');
			json.feedback_comment = data;
			$.ajax({ type : 'POST', 
				url : 'feedbackapi/api/tickets/notes/feedback-comment/'+id, 
				data : json,
				success:function(){
					console.log(json);	
					document.getElementById("addfeedback-message").innerHTML = "<div style=font-size:20px;padding-left:40px;text-align:center;>Your feedback submitted successfully!</div>";
				},
				error:function(){
					document.getElementById("addfeedback-message").innerHTML = "<div style=font-size:20px;padding-left:40px;text-align:center;>Sorry, Cannot submit you feedback!</div>";
				}
				
		});
			
			
		}	
			
		    
		</script>
</body>
</html>