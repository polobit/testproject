<%@page import="com.agilecrm.ticket.entitys.TicketNotes"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.ticket.utils.TicketNotesUtil"%>
<%@page import="java.lang.*"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%@page import="com.campaignio.urlshortener.util.Base62;"%>

<%
//flatfull path
String flatfull_path="/flatfull";

String error = "", success = "";
System.out.println(success);
String feedback = request.getParameter("feedback");
System.out.println(feedback+"feedback");

String[] split = feedback.split("-");

Long note_id = Base62.fromOtherBaseToDecimal(62,split[1]);
 
TicketNotes tn = TicketNotesUtil.getTicketNotesByID(note_id);
Boolean note_exists = Boolean.TRUE;
if(tn == null){
 note_exists = Boolean.FALSE;
}
String feedback_rating = split[0];

// Users can show their company logo on login page. 
AccountPrefs accountPrefs = AccountPrefsUtil.getAccountPrefs();
String logo_url = accountPrefs.logo;

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

<!-- Include ios meta tags -->
<%@ include file="ios-native-app-meta-tags.jsp"%>
</head>

<script>
var id = <%=note_id%>
</script>
<head>
      <meta http-equiv="content-type" content="text/html;charset=utf-8" />
      <title>Form 6</title>
       <link rel="stylesheet" type="text/css" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
	   <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
       <script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
	   <script>
		$(document).ready(function(){
			$('[data-toggle="tooltip"]').tooltip(); 
		});
		</script>
        <style>
        @import url(https://fonts.googleapis.com/css?family=Open+Sans:400,300,300italic,400italic,600,600italic,700,700italic,800,800italic);
        @media screen and (max-width: 768px){
      .form-container {
        width: 100% !important;
      }
      body{
        padding: 0px 10px !important;
      }
      .agile-crm-logo{
        width: 100% !important;
      }
      .agile-crm-logo img{
        max-width: 100% !important;
        /*height: auto;*/
      }
      .form-body{
        width: 100% !important;
      }
      .footer-logo img{
        width: 80px !important;
        height: 25px !important;
      }
      .p-t-40{
          padding-top: 40px !important;
          }
    }

        body {
        font-family: 'Open Sans', sans-serif;
        color: #676767;
        font-size: 14px;
        font-weight: 400;
        }
        .form-container {
        letter-spacing: 0;
        width: 450px;
        background: #fff;
        border-radius: 4px;
        box-shadow: 0 0px 10px 0px rgba(0, 0, 0, 0.2);
        -webkit-box-shadow: 0 0px 10px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0 0px 10px 0px rgba(0, 0, 0, 0.2);
        margin: auto;
        }
        .form-body {
          padding: 30px 30px 25px 30px;
        }
        .logo{
        width: 93px;
        height: auto;
        margin-bottom: 15px;
    }
    .footer-logo img{
        width: 80px !important;
        height: 25px !important;
    }
        .text-center{ text-align: center;}
        
        .button{
        color: #fff;
        text-decoration: none;
        padding: 10px 12px;
        display: block;
        text-align: center;
        border-radius: 3px;
        font-weight: 600;
        box-sizing: border-box;
        }
        .submit-button{
        background-color: #23b7e5;
        border-color: #23b7e5;
        margin-top: 20px;
        line-height: 23px;
        }
        .submit-button:hover{
        background-color: #19a9d5;
        border-color: #189ec8;
        }
        p{ margin: 0;}
        .m-t-xs {
        margin-top: 5px;
        }

        .m-t-sm {
        margin-top: 10px;
        }

        .m-t {
        margin-top: 15px;
        }
        .m-b-xs {
        margin-bottom: 5px;
        }

        .m-b-sm {
        margin-bottom: 10px;
        }

        .m-b {
        margin-bottom: 15px;
        }
        .text-sm{ font-size: 13px;}
        .clearfix{ clear: both;}
        .text-xs{ font-size: 12px;}
        .text-light{ color: #777;}
        .form-group{margin-bottom: 15px;}
        .form-group label{ display: block; font-size:14px; font-weight: 100; 
        margin-bottom: 5px;}
        .text-xxs{
          font-size: 30px;
        }
        .p-t-80{
          padding-top: 80px;
        }
        .rounded {
        border-radius: 50px;
        -webkit-border-radius: 50px;
        -moz-border-radius: 50px;
        }
       .bg-light{ background-color: #f6f6f6;}
       .pull-left{ float: left;}
       .pull-right{float: right;}
       .m-r-xlg{ margin-right: 60px;}
       .f-w-600{
        font-weight: 600;
       }
	   .m-r-5{
		margin-right:5px;
	   }
	   w-40{
		width :40px;
	   }
       .rating {
      unicode-bidi: bidi-override;
      direction: ltr;
    }
    .rating > span {
      display: inline-block;
      position: relative;
    }
	
    
</style>
</head>
   <body>
   	<div id="successmessage">

   	<%if(note_exists){%>
      <div class="agile-crm-logo p-t-80 p-t-40" style="margin: 0px auto;text-align: center;width: 125px;border-radius: 3px">
      	<%if(logo_url != null){%>
        <img class="logo" alt="AgileCRM" src=<%=logo_url%>>
      	<%}%>
      </div>
        <form class="form-container"  onsubmit="saveTicketFeedback(event)">
        <div class="form-body m-t-sm">
          <div class="text-center" style="width:100%;border-radius: 3px;padding: 10px;margin-bottom: 20px;border-bottom:1px solid #f6f6f6">
            <div class="f-w-600" style="margin-bottom:10px">How do you rate our service?</div>
            <div class="rating">
				
				<span class="m-r-5"  data-toggle="tooltip" title="Unacceptable" data-placement="bottom">
					<img value="1" id="1" style="width:40px" src="/img/agile-emoj1.png" onmouseover="changefeedbackimg(event,this)" onmouseout="changefeedbackimg(event,this)" onclick ="changeFeedback(event,this)"/></span>
				
				<span class="m-r-5"  data-toggle="tooltip" title="Can Improve" data-placement="bottom">
					<img id="2" value="2" style="width:40px" src="/img/agile-emoj2.png" onmouseover="changefeedbackimg(event,this)" onmouseout="changefeedbackimg(event,this)"
          onclick ="changeFeedback(event,this)"/></span>
				
				<span class="m-r-5"  data-toggle="tooltip" title="Acceptable" data-placement="bottom">
					<img  id="3" value="3" style="width:40px" src="/img/agile-emoj3.png" 
          onmouseover="changefeedbackimg(event,this)" onmouseout="changefeedbackimg(event,this)" onclick ="changeFeedback(event,this)"/></span>
				
				<span class="m-r-5" data-toggle="tooltip" title="Meets Expectations" data-placement="bottom">
					<img id="4" value="4" style="width:40px" src="/img/agile-emoj4.png" onmouseover="changefeedbackimg(event,this)" onmouseout="changefeedbackimg(event,this)" onclick ="changeFeedback(event,this)"/></span>
				
				<span data-toggle="tooltip" title="Exceptional" data-placement="bottom">

					<img style="width:40px" value="5" id="5" src="/img/agile-emoj5.png" onmouseover="changefeedbackimg(event,this)" onmouseout="changefeedbackimg(event,this)" onclick ="changeFeedback(event,this)"/></span>
			</div>
          </div>
          <div style="padding-bottom: 5px" class="f-w-600">Comments:</div>
          <textarea style="width:100%;height:100px;border:1px solid #ccc;border-radius: 3px;margin-bottom: 20px;font-size: 14px;resize:vertical;" id="myTextarea"></textarea>
          <div style="width: 100%;height: 40px">
          <button type="submit" value="submit" class="btn btn-primary btn-md" style="width: 48%;float: right">Submit</button>
          </div>
          
        </div>
        <div class="footer-logo" style="float: right;margin-top: 5px"><span style="font-family: sans-serif;font-size: 10px">Powered By</span>
          <a href="https://www.agilecrm.com/" target="_blank"> 
            <img alt="AgileCRM" src="https://doxhze3l6s7v9.cloudfront.net/img/agile-crm-logo-1.png">
          </a>
          </div>
        </form>
    </div>    
   </body>
					
<script>
 	feedback = "<%=feedback%>";
	feedback_rating = "<%=feedback_rating%>";

	var image = document.getElementById(feedback_rating)
		image.src = "/img/agile-emoj"+feedback_rating+"-1.png";	

function functioncancel(){
document.getElementById("addfeedback-message").innerHTML = "<div style=font-size:20px;padding-left:40px;text-align:center;>No feedback was submitted!</div>";

}

function changefeedbackimg(e,objButton){
    
    e.preventDefault();
    
    var i = objButton.id;
    
      var image = document.getElementById(i);

      if(image.className == "selected")
        return;

      if(image.src.includes("/img/agile-emoj"+i+"-1.png")){ 
        
        image.src = "/img/agile-emoj"+i+".png";
    
    }   
    else{

        image.src = "/img/agile-emoj"+i+"-1.png"
    }
    
}
      
              

function changeFeedback(e,objButton){
 
  	e.preventDefault();
 
  	var i = objButton.id; 	
  	feedback_rating = ""+objButton.id;

  	var j;
  	for(j=1;j<=5;j++){
  	
      image = document.getElementById(j);
  		
    if(j == i){	
      image.src = "/img/agile-emoj"+i+"-1.png";

      image.className = "selected";
  	}		
  	else{
			image.src = "/img/agile-emoj"+j+".png"
  	   
      image.className = ""; 
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
					document.getElementById("successmessage").innerHTML = "<div style=font-size:20px;padding-left:40px;padding-top:40px;text-align:center;>Your feedback submitted successfully!</div>";
				},
				error:function(){
					document.getElementById("successmessage").innerHTML = "<div style=font-size:20px;padding-left:40px;padding-top:40px;text-align:center;>Sorry, cannot submit your feedback as the URL expired!</div>";
				}
				
		});
			
			
		}	
			
		    
</script>
<%}else{%>

 <div style=font-size:20px;padding-left:40px;padding-top:40px;text-align:center;>Sorry, cannot submit your feedback as the URL expired!</div></div>
<% }%>
</body>
</html>