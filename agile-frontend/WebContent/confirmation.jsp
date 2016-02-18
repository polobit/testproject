<!DOCTYPE html>
<%@page import="com.twilio.sdk.resource.instance.Trigger"%>
<%@page import="com.agilecrm.workflows.triggers.util.EmailTrackingTriggerUtil"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="com.campaignio.tasklets.agile.util.AgileTaskletUtil"%>
<%@page import="com.agilecrm.util.email.SendMail"%>
<%@page import="com.agilecrm.workflows.Workflow"%>
<%@page import="java.util.HashMap"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.contact.Contact"%>
<%@page import="com.agilecrm.contact.util.ContactUtil"%>
<%@page
	import="com.agilecrm.workflows.unsubscribe.UnsubscribeStatus.UnsubscribeType"%>
<%@page import="com.agilecrm.workflows.unsubscribe.UnsubscribeStatus"%>
<%@page import="com.agilecrm.workflows.unsubscribe.util.UnsubscribeStatusUtil"%>
<%@page import="com.agilecrm.workflows.status.CampaignStatus.Status"%>
<%@page import="com.agilecrm.workflows.status.util.CampaignStatusUtil"%>
<%@page import="com.campaignio.cron.util.CronUtil"%>
<%@page import="com.thirdparty.mandrill.Mandrill" %>
<%@page import="com.agilecrm.user.DomainUser" %>
<%@page import="com.agilecrm.user.util.DomainUserUtil" %>
<%@page import="com.agilecrm.workflows.triggers.Trigger.Type" %>
<%@page import="com.agilecrm.account.util.EmailTemplatesUtil" %>
<%@page import="com.agilecrm.account.EmailTemplates" %>
<%@page import="java.util.regex.Matcher" %>
<%@page import="java.util.regex.Pattern" %>
<%@page import="org.jsoup.Jsoup" %>

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

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

.field-group {
	float: none;
	margin: 3px 0 15px 0;
	padding: 5px;
	border-style: solid;
	background: -moz-linear-gradient(top, rgba(255, 255, 255, 0),
		rgba(255, 255, 255, .25) );
	background-image: -webkit-gradient(linear, left top, left bottom, color-stop(0, rgba(255,
		255, 255, 0) ), color-stop(1, rgba(255, 255, 255, .25) ) );
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00ffffff',
		endColorstr='#3fffffff' );
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

.radio-group input,.checkbox-group input {
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

.button,.button-small {
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

input[type=checkbox] {
	-webkit-appearance: checkbox;
}

input[type=radio] {
	-webkit-appearance: radio;
}

body,#bodyTable {
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

a:link,a:active,a:visited,a {
	color: #336699;
}

.button:link,.button:active,.button:visited,.button,.button span,.button-small:link,.button-small:active,.button-small:visited,.button-small
	{
	background-color: #336699;
	color: #ffffff;
}

.button:hover,.button-small:hover {
	background-color: #1e5781;
	color: #ffffff;
}

label {
	line-height: 150%;
	font-family: Helvetica;
	font-size: 14px;
	color: #333333;
}

.field-group {
	background-color: #eeeeee;
	border-width: 2px;
	border-color: #d0d0d0;
}

.field-group input,.field-group textarea {
	font-family: Helvetica;
	font-size: 16px;
	color: #333333;
}

html[dir=rtl] .wrapper,html[dir=rtl] .container,html[dir=rtl] label {
	text-align: right !important;
}

@media ( max-width : 601px) {
	body {
		width: 100%;
		-webkit-font-smoothing: antialiased;
		padding: 10px 0 0 0 !important;
		min-width: 300px !important;
	}
}

@media ( max-width : 601px) {
	textarea,select,ul.unsub-options li textarea {
		width: 80% !important;
	}
}

@media ( max-width : 601px) {
	h1 img {
		max-width: 100%;
		height: auto !important;
	}
}

@media ( max-width : 601px) {
	.wrapper,.poweredWrapper {
		width: auto !important;
		max-width: 600px !important;
		padding: 0 10px;
	}
}

}
@media ( max-width : 601px) {
	#templateContainer,#templateBody,#templateContainer table {
		width: 100% !important;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
}
</style>
</head>
<body>
	<div class="wrapper rounded6" id="templateContainer">
		<div id="templateBody" class="bodyContent rounded6">
			<%
			    String campaignId = request.getParameter("cid");
			    String status = request.getParameter("status");
			    String tag = request.getParameter("t");
			    String email = request.getParameter("email");
			    String campaign_name = request.getParameter("c_name");
			    String unsubscribeEmail = request.getParameter("unsubscribe_email");
			    String unsubscribeName = request.getParameter("unsubscribe_name");
			    String unsubscribe_subject = request.getParameter("unsubscribe_subject");
			    System.out.println("Unsubscribe subject"+unsubscribe_subject);
			    // Used to send as from name in confirmation email
			    String company = request.getParameter("company");

			    System.out.println(campaignId + ":" + status + ":" + tag + ":" + email);

			    Contact contact = ContactUtil.searchContactByEmail(email);

			    String msg = "You are successfully unsubscribed. Thank you.";

			    if (contact == null)
			    {
					msg = "The given email does not match any in our database.";
			%>
			<h2>Error</h2>
			<p><%=msg%></p>
			<%
			    } // End of if
			    else
			    {
			%>
			<h2>Confirmation</h2>
			<p><%=msg%></p>
			<%
			    try
					{
					    String contactId = contact.id.toString();

					    // By default CURRENT
					    UnsubscribeType type = UnsubscribeType.CURRENT;

					    // If all
					    if ("all".equals(status))
						type = UnsubscribeType.ALL;

					    boolean isNew = true;
					    
					    // Update older one having same campaign id
						for (UnsubscribeStatus uns : contact.unsubscribeStatus)
						{
						    if (uns == null)
							continue;

						    if (campaignId.equals(uns.campaign_id))
						    {
							uns.unsubscribeType = type;
							isNew = false;
							break;
						    }
						}
					 
					    // First time unsubscribe
					    if (isNew)
					    {
						UnsubscribeStatus unsubscribeStatus = new UnsubscribeStatus(campaignId, type);
						contact.unsubscribeStatus.add(unsubscribeStatus);
					    }

					    contact.save();

					    System.out.println("Tag is " + tag);

					    // Add unsubscribe tag
					    if (!StringUtils.isBlank(tag))
						contact.addTags(AgileTaskletUtil.normalizeStringSeparatedByDelimiter(',', tag).split(","));

					    // Add Removed status to contact
					    CampaignStatusUtil.setStatusOfCampaign(contactId, campaignId, campaign_name, Status.REMOVED);
					    
					    // Delete Related Crons.
					    CronUtil.removeTask(campaignId, contactId);
					    
					    // Send Confirmation email
					    HashMap<String, String> map = new HashMap<String, String>();
						String subjectMessage = "Unsubscribe";
						map.put("unsubscribe_subject",unsubscribe_subject);
						
					    if ("all".equals(status))
						{
							// If company is My company (default), make empty
							if(company.equals("My company"))
								company = "";
							    
							map.put("company", company);
							
							if(!StringUtils.isBlank(unsubscribe_subject))	
							{
								EmailTemplates template_details = EmailTemplatesUtil.getEmailTemplate(Long.valueOf(unsubscribe_subject));
								subjectMessage = template_details.subject ;
								String htmlString = template_details.text;
								System.out.println("htmlString is"+htmlString);
								map.put("unsubscribe_body", htmlString);
							}
							else
							{
								if(StringUtils.isEmpty(company))
								    subjectMessage = "Unsubscribed successfully";
								else
									subjectMessage = "Unsubscribed successfully from "+company+" company";
							}
							
							// Add unsubscribe log
							UnsubscribeStatusUtil.addUnsubscribeLog(campaignId, contactId, "Unsubscribed from all campaigns");
							
						}
					    
					    if("current".equals(status))
						{
					    	/* if(StringUtils.isNotBlank(unsubscribeName) && !StringUtils.equalsIgnoreCase(unsubscribeName, "null"))
					    		map.put("campaign_name", unsubscribeName);
					    	else
					    		map.put("campaign_name", campaign_name); */
					    	
					    	map.put("campaign_name", unsubscribeName);
					    	if(!StringUtils.isBlank(unsubscribe_subject))	
							{
								EmailTemplates template_details = EmailTemplatesUtil.getEmailTemplate(Long.valueOf(unsubscribe_subject));
								subjectMessage = template_details.subject ;
								String htmlString = template_details.text;
								System.out.println("htmlString is"+htmlString);
								map.put("unsubscribe_body", htmlString);
							}
							else
							{
								subjectMessage = "Unsubscribed successfully from Campaign";
							}
							// Add unsubscribe log
							UnsubscribeStatusUtil.addUnsubscribeLog(campaignId, contactId, "Unsubscribed from campaign " + campaign_name);
							
						}
					    
						// Trigger Unsubscribe
						EmailTrackingTriggerUtil.executeTrigger(contactId, campaignId, null, Type.UNSUBSCRIBED);
					 
					    String domain = NamespaceManager.get();
					    String fromEmail = "noreply@agilecrm.com";
					    
					    // From email as given in Workflow
					    if(StringUtils.isNotBlank(unsubscribeEmail) && !StringUtils.equalsIgnoreCase(unsubscribeEmail, "null"))
					    {
					    	fromEmail = unsubscribeEmail;
					    }
					    else
					    {
					    	DomainUser owner = DomainUserUtil.getDomainOwner(domain);
						    
							if(owner != null)
								fromEmail = owner.email;
						}
					    
					    map.put("domain", domain);
					    
					    map.put("campaign_id", campaignId);
					    map.put("email", email);
						 
						if(map.size() != 0)
						   SendMail.sendMail(email, subjectMessage, SendMail.UNSUBSCRIBE_CONFIRMATION , map, StringUtils.isBlank(fromEmail) ? "noreply@agilecrm.com" : fromEmail, company);
					}
					catch (Exception e)
					{
					    e.printStackTrace();
					    System.err.println("Exception occured while confirmation " + e.getMessage());
					}
			
			%>

			<%
			    } // End of else
			%>
		</div>
	</div>
	<br />
	<div>
		<span style="display: inherit;font-style: italic; font-family: Times New Roman; font-size: 10px; padding-right: 85px;">Powered
			by</span> <a href="https://www.agilecrm.com?utm_source=powered-by&utm_medium=unsubscribe&utm_campaign=<%= NamespaceManager.get() %>" rel="nofollow" target="_blank"> <img src="https://s3.amazonaws.com/agilecrm/panel/uploaded-logo/1383722651000?id=upload-container" alt="Logo for AgileCRM" style="border: 0;background: white;padding: 0px 10px 5px 2px;height: auto;width: 120px;">
		</a>
	</div>
</body>
</html>