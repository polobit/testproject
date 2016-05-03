<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.activities.util.WebCalendarEventUtil"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.activities.util.GoogleCalendarUtil"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="com.agilecrm.activities.util.EventUtil"%>
<%@page import="com.agilecrm.activities.Event"%>
<%@page import="com.agilecrm.account.util.EmailGatewayUtil"%>
<%@page import="com.agilecrm.contact.Contact"%>
<%@page import="com.agilecrm.contact.Contact.Type"%>
<%@page import="com.agilecrm.contact.ContactField"%>
<%@page import="com.agilecrm.contact.util.ContactUtil"%>
<%@page import="com.agilecrm.util.NamespaceUtil"%>
<%@page import="java.net.URL"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="java.util.List"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>

<%
			String event_id = request.getParameter("event_id");
            String appointment_confirmation_image="/img/appointment_confirmation.png";
            String domain_user_name=null;
            String calendar_url=null;
            String event_start_time=null;
            String event_title=null;
			
			boolean appointment_cancelled=false;
			 Long id=Long.parseLong(event_id);
			Event event = EventUtil.getEvent(id);
            DomainUser domain_user=null;
			try
			{
			    if (event != null)
			    {
				domain_user=event.eventOwner();
				domain_user_name=domain_user.name;
				calendar_url=domain_user.getCalendarURL();
				String timezone = UserPrefsUtil.getUserTimezoneFromUserPrefs(domain_user.id);
				if (StringUtils.isEmpty(timezone))
				{
				    timezone = domain_user.timezone;
				   
				}
				event_start_time=WebCalendarEventUtil
					.getGMTDateInMilliSecFromTimeZone(timezone,
						event.start * 1000, new SimpleDateFormat(
								"EEE, MMMM d yyyy, h:mm a (z)"));
				event_title=event.title;
				Long duration=(event.end-event.start)/60;
				List<Contact> contacts=event.relatedContacts();
				String client_name=contacts.get(0).getContactFieldValue("FIRST_NAME");
				if(StringUtils.isNotEmpty(contacts.get(0).getContactFieldValue("LAST_NAME"))){
				    client_name.concat(contacts.get(0).getContactFieldValue("LAST_NAME"));
				}
				String client_email=contacts.get(0).getContactFieldValue("EMAIL");
				GoogleCalendarUtil.deleteGoogleEvent(event);
				event.delete();
				appointment_cancelled=true;
				String subject="<p>"+client_name+" ("+client_email+") has cancelled the appointment</p><span>Title: "+event_title+" ("+duration+" mins)</span><br/><span>Start time: "+event_start_time+"</span>";
				
				EmailGatewayUtil.sendEmail(null, client_email, client_name, domain_user.email, null, null,
				        "Appointment Cancelled", null, subject, null, null,null,null); 
				        
					
			    }
			   
			}
			catch (Exception e)
			{
			    e.printStackTrace();
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
<title>Online Appointment Cancellation - <%=domain_user_name %></title>
</head>
<body>
<%
		     if(appointment_cancelled){
					
		%>
<div class="wrapper rounded6" id="templateContainer">
			<div id="templateBody" class="bodyContent rounded6">
				<h3 style="border-bottom: 1px solid #ddd;padding-bottom:8px;margin-bottom:15px;"><img style="float: left" src='<%=appointment_confirmation_image%>'><b style="margin-top: -2px;display: inline-block;margin-left: 9px;"><h3>Appointment Cancelled</h3></b></h3> 
				<div id="appointment">
					Your appointment with <b><%=domain_user_name%></b> is cancelled.
				</div>
				<br/><a  class="button" href='<%=calendar_url %>'> Schedule new appointment</a>
			</div>
		</div>
		<br />
		<div align="right"
			style="position: absolute; right: 555px;">
			<span
				style="display: inherit; font-style: italic; font-family: Times New Roman; font-size: 10px; padding-right: 71px;">Powered
				by</span> <a
				href="https://www.agilecrm.com?utm_source=powered-by&amp;medium=event_scheduler&amp;utm_campaign=<%= NamespaceManager.get() %>'
				rel="nofollow" target="_blank"><img
				src="https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container"
				alt="Logo for AgileCRM"
				style="border: 0; background: white; padding: 0px 10px 5px 2px; height: auto; width: 135px;"></a>
		</div>
		<%
		    } else{
			out.println("something went wrong.");
		    }
					
		%>
</body>
</html>