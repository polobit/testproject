<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.activities.util.WebCalendarEventUtil"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="com.agilecrm.activities.util.EventUtil"%>
<%@page import="com.agilecrm.activities.Event"%>
<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.agilecrm.util.NamespaceUtil"%>
<%@page import="java.net.URL"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>

<%
            String url = request.getRequestURL().toString();
			System.out.println(url);
			String[] ar = url.split("/");
			String event_id = ar[ar.length - 1];
			String event_title=null;
			boolean appointment_cancel_info = false;

			String user_name = null;
			String timezone = null;
			String event_start = null;
			 URL ur = new URL(url);
			 String namespace = NamespaceUtil.getNamespaceFromURL(ur);
			String calendar_url=null;
			String domain_url=VersioningUtil.getHostURLByApp(namespace);
			 Long eventid=Long.parseLong(event_id);
			Event event = EventUtil.getEvent(eventid);

			DomainUser dom_user = null;
			Long duration=null;;
			if (event != null) {
			    duration=(event.end-event.start)/60;
			    event_title=event.title;
			    dom_user=event.eventOwner();
			    user_name = dom_user.name;
				timezone = UserPrefsUtil.getUserTimezoneFromUserPrefs(dom_user.id);
				if (StringUtils.isEmpty(timezone))
				{
				    timezone = dom_user.timezone;
				   
				}
				calendar_url=dom_user.getCalendarURL();
				appointment_cancel_info = true;
				event_title=event_title.substring(0,event_title.indexOf("with")).trim();
				event_start = WebCalendarEventUtil
						.getGMTDateInMilliSecFromTimeZone(timezone,
								event.start * 1000, new SimpleDateFormat(
										"EEE, MMMM d yyyy, h:mm a (z)"));
				System.out.println(event_start);
			}

			
			if (StringUtils.isEmpty(timezone)) {
				timezone = AccountPrefsUtil.getAccountPrefs().timezone;
				if (StringUtils.isEmpty(timezone))
					timezone = "UTC";
			}

			
			ObjectMapper mapper = new ObjectMapper();
%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<style type="text/css">
body {
	font: 14px/20px 'Helvetica', Arial, sans-serif;
	margin: 0;
	padding: 75px 0 0 0;
	text-align: center;
}

p {
	padding: 0 0 10px 0;
}

textarea {
	font: 12px/18px 'Helvetica', Arial, sans-serif;
}

h2 {
	font-size: 22px;
	line-height: 28px;
	margin: 0 0 10px 0;
}

h3 {
	margin: 0 0 5px 0;
	padding: 0;
}

.wrapper {
	width: 600px;
	margin: 0 auto 10px auto;
	text-align: left;
}

.container {
	position: relative;
	border-width: 0 !important;
	border-color: transparent !important;
	margin: 0;
	text-align: left;
	-moz-box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	-webkit-box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
	box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

label {
	float: none;
	clear: both;
	display: block;
	width: auto;
	margin-top: 8px;
	text-align: left;
	font-weight: bold;
	position: relative;
}

label.error {
	color: red;
	font-weight: normal;
	font-size: 12px;
	display: none;
}

.field-group {
	float: none;
	margin: 3px 0 15px 0;
	padding: 5px;
	border-style: solid;
	background: -moz-linear-gradient(top, rgba(255, 255, 255, 0),
		rgba(255, 255, 255, .25));
	background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, rgba(255,
		255, 255, 0)), color-stop(1, rgba(255, 255, 255, .25)));
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffffff',
		endColorstr='#3fffffff');
	-ms-filter:
		"progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffffff', endColorstr='#3fffffff')";
}

.field-group input {
	display: block;
	margin: 0;
	padding: 5px;
	border: 0;
	background: none;
	width: 98%;
}

.radiogroup input {
	width: auto;
}

.radio-group input, .checkbox-group input {
	width: auto;
	display: inline-block;
	margin-right: 5px;
}

.field-group label {
	clear: none;
}

.field-group textarea {
	background: none;
	border: none;
	width: 525px;
	height: 150px;
	margin: 0;
	overflow: auto;
}

select {
	width: 300px;
	margin: 5px;
}

.button, .button-small {
	display: inline-block;
	font-family: 'Helvetica', Arial, sans-serif;
	width: auto;
	white-space: nowrap;
	height: 32px;
	margin: 5px 5px 0 0;
	padding: 0 22px;
	text-decoration: none;
	text-align: center;
	font-weight: bold;
	font-style: normal;
	font-size: 15px;
	line-height: 32px;
	cursor: pointer;
	border: 0;
	-moz-border-radius: 4px;
	border-radius: 4px;
	-webkit-border-radius: 4px;
	vertical-align: top;
}

.button-small {
	float: none;
	display: inline-block;
	height: auto;
	line-height: 18px !important;
	padding: 2px 15px !important;
	font-size: 11px !important;
}

.button span {
	display: inline;
	font-family: 'Helvetica', Arial, sans-serif;
	text-decoration: none;
	font-weight: bold;
	font-style: normal;
	font-size: 15px;
	line-height: 32px;
	cursor: pointer;
	border: none;
}

.rounded6 {
	-moz-border-radius: 6px;
	border-radius: 6px;
	-webkit-border-radius: 6px;
}

.poweredWrapper {
	padding: 20px 0;
	width: 560px;
	margin: 0 auto;
}

.poweredBy {
	display: block;
}

span.or {
	display: inline-block;
	height: 32px;
	line-height: 32px;
	padding: 0 5px;
	margin: 5px 5px 0 0;
}

.clear {
	clear: both;
}

body {
	-webkit-text-size-adjust: none;
}

input {
	-webkit-appearance: none;
}


body, #bodyTable {
	background-color: #eeeeee;
}

h1 {
	font-size: 28px;
	margin-bottom: 15px;
	padding: 0;
	margin-top: 0;
}

#templateContainer {
	background-color: none;
}

#templateBody {
	background-color: #ffffff;
}

.bodyContent {
	line-height: 200%;
	font-family: Helvetica;
	font-size: 15px;
	color: #333333;
	padding: 20px;
}

a:link, a:active, a:visited, a {
	color: #336699;
}

.button:link, .button:active, .button:visited, .button, .button span,
	.button-small:link, .button-small:active, .button-small:visited,
	.button-small {
	background-color: #336699;
	color: #ffffff;
}

.button:hover, .button-small:hover {
	background-color: #1e5781;
	color: #ffffff;
}





</style>
<title>Online Appointment Cancellation - <%=user_name %></title>
<script type="text/javascript" src="../../lib/web-calendar-event/jquery.js"></script>
<script type="text/javascript" src="../../lib/jquery.validate.min.js"></script>
</head>
<body>
		<%
		    if (appointment_cancel_info == true) {
		%>


		<div class="wrapper rounded6" id="templateContainer">
			<div id="templateBody" class="bodyContent rounded6">
				<h2>Cancel&nbsp;&#39;<%=event_title %>&#39;&nbsp;with&nbsp;<%=user_name%>?</h2>
				
				<div class="start_time">
					Event starts <%=event_start%>&nbsp;(<%=duration %>&nbsp;mins)
				</div>
				<div class="cancel_reason">
					<textarea placeholder="Reason for cancellation" rows="7" cols="75" id="cancel_web_appointment_reason" name="cancel_web_appointment_reason"></textarea>
				</div>
          
				<br /> <a  class="button" id="cancel_appointment_confirmation" href='#'> Cancel Appointment</a>
			</div>
		</div>
		<br />
		<div align="right"
			style="position: absolute; right: 555px;">
			<span
				style="display: inherit; font-style: italic; font-family: Times New Roman; font-size: 10px; padding-right: 71px;">Powered
				by</span> <a
				href="https://www.agilecrm.com?utm_source=powered-by&amp;medium=event_scheduler&amp;utm_campaign=<%=namespace %>'
				rel="nofollow" target="_blank"><img
				src="https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container"
				alt="Logo for AgileCRM"
				style="border: 0; background: white; padding: 0px 10px 5px 2px; height: auto; width: 135px;"></a>
		</div>



		<%
		    } else{
					
		%>
		<div class="wrapper rounded6" id="templateContainer">
			<div id="templateBody" class="bodyContent rounded6">
				<h2>Looks like this appointment is already cancelled.
</h2>
			</div>
		</div>
		<br />
		<div align="right"
			style="position: absolute; right: 555px;">
			<span
				style="display: inherit; font-style: italic; font-family: Times New Roman; font-size: 10px; padding-right: 71px;">Powered
				by</span> <a
				href="https://www.agilecrm.com?utm_source=powered-by&amp;medium=event_scheduler&amp;utm_campaign=<%=namespace %>'
				rel="nofollow" target="_blank"><img
				src="https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container"
				alt="Logo for AgileCRM"
				style="border: 0; background: white; padding: 0px 10px 5px 2px; height: auto; width: 135px;"></a>
		</div>
	<%
		    } 
					
		%>
	
<script type="text/javascript">
var domain_user_name=<%=mapper.writeValueAsString(user_name)%>;
$("#cancel_appointment_confirmation").die().live('click', function(e)
{
	e.preventDefault();
	  var event_id=<%=event_id%>
	 var cancel_reason=$("#cancel_web_appointment_reason").val();
	 
	 $.ajax({ url : '/core/api/webevents/calendar/deletewebevent?event_id=' + <%=event_id%>+'&cancel_reason='+cancel_reason, type : 'GET', success : function(data)
			{
		 var appointment_success_img2 = "/img/appointment_confirmation.png";
		 var ser='<div class="wrapper rounded6" id="templateContainer">'
		         +'<div id="templateBody" class="bodyContent rounded6">'
		         +'<h3 style="border-bottom: 1px solid #ddd;padding-bottom:8px;margin-bottom:15px;">'
		         +'<img style="float: left" src='+appointment_success_img2+'><b style="margin-top: -2px;display: inline-block;margin-left: 9px;"><h3>Appointment Cancelled</h3></b></h3>'
		         +'<div id="appointment">Your appointment with <b>'+domain_user_name+'</b> is cancelled.</div><br/>'
		         +'<a  class="button" href="<%=calendar_url %>"> Schedule new appointment</a></div></div><br />';
		 $("#templateContainer").html(ser);	
		 
			}, error : function(response)
			{

				alert("Something is wrong");
			} });
});
</script>
</body>
</html>