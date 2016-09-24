<%@page import="com.agilecrm.util.VersioningUtil"%>
<%@page import="com.agilecrm.account.util.AccountPrefsUtil"%>
<%@page import="com.agilecrm.account.AccountPrefs"%>
<%@page import="org.json.JSONObject"%>
<%@page import="org.json.JSONArray"%>
<%@page import="java.util.ArrayList"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="com.agilecrm.util.NamespaceUtil"%>
<%@page import="java.net.URL"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.user.util.OnlineCalendarUtil"%>
<%@page import="com.agilecrm.user.OnlineCalendarPrefs"%>
<%@page import="com.agilecrm.user.DomainUser"%>
<%@page import="com.agilecrm.projectedpojos.DomainUserPartial"%>
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="com.agilecrm.document.util.DocumentUtil"%>
<%@page import="com.agilecrm.document.Document"%>
<%@page import="com.agilecrm.contact.DocumentNote"%>
<%@page import="com.agilecrm.contact.util.DocumentNoteUtil"%>
<%@page import="com.agilecrm.contact.util.ContactUtil"%>
<%@page import="com.agilecrm.contact.Contact"%>

<%@page import="java.util.Set"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Calendar"%>
<%@page import="java.util.HashSet"%>
<%@page import="java.util.TreeSet"%>
<%@page import="java.util.LinkedHashSet"%>
<%@page import="java.util.Arrays"%>

<%
String url = request.getRequestURL().toString();
String[] ar=url.split("/");
String sNoteSubject="";

String user_name = null;
String domain_name=null;
Long user_id = 0L;
Long agile_user_id = 0L;


String htmlContent="";
String docTitle="";
String sDocumentId="";
String _AGILE_VERSION ="";
String d_name="";
String sContactId="";
String sContactName="";
String bDocumentFound="0";
List<DocumentNote> notes=null;
Long dDocumentId=0L;
Long dContactId=0L;
Document document=null;
try{
URL ur=new URL(url);
d_name=domain_name= NamespaceUtil.getNamespaceFromURL(ur);
_AGILE_VERSION = SystemProperty.applicationVersion.get();
String baseUrl=VersioningUtil.getStaticFilesBaseURL();
sDocumentId=ar[ar.length-2];
sContactId=ar[ar.length-1];
dDocumentId= Long.parseLong(sDocumentId);
dContactId= Long.parseLong(sContactId);
document =DocumentUtil.getDocument(dDocumentId);


if(document!=null)
{

	 bDocumentFound="1";
	 notes= DocumentNoteUtil.getDocumentsNotes(sDocumentId,0,null);
	 if(notes!=null)
	 {
	 	for(DocumentNote note:notes){
	 		String description=note.description;
	 	};
	 } 
	 htmlContent=document.text;
	 docTitle=document.name;
	 sNoteSubject=docTitle; 
	 Contact contact = ContactUtil.getContact(dContactId);
	 if(contact!=null)
	 	sContactName=contact.first_name + " " + contact.last_name;
	

	DomainUserPartial domainUser =document.getOwner();
	AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);

	UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
	System.out.println("userPrefs " + userPrefs.pic);
	user_name = domainUser.name;
	user_id = domainUser.id;
	agile_user_id = agileUser.id;
}
}catch(Exception e)
{

}
finally{
	
}


ObjectMapper mapper = new ObjectMapper();

%>
<!DOCTYPE html>
<meta name="viewport" content="width=device-width, initial-scale=1">
<%@page import="com.google.appengine.api.utils.SystemProperty"%>
<%@ page contentType="text/html; charset=UTF-8" %>
<html>
<head>

<title>Document Viewer</title>
<link rel="stylesheet" href="../../../css/web-calendar-event/bootstrap.min.css">
<link rel="stylesheet" href="../../../css/web-calendar-event/style.css?_=<%=_AGILE_VERSION%>">
<link rel="stylesheet" type="text/css" href="../../../css/agile-css-framework.css?_=<%=_AGILE_VERSION%>">
<link rel="stylesheet" type="text/css" href="/flatfull/css/core/2-app.css">
<!-- <link rel="stylesheet" href="../../css/web-calendar-event/font-awesome.min.css"> -->
<link rel="stylesheet" href="//netdna.bootstrapcdn.com/font-awesome/4.1.0/css/font-awesome.min.css">


<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>

<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="../../../lib/jquery.validate.min.js"></script>
<script type="text/javascript" src="../../../lib/jquery.timeago.js"></script>
<script type="text/javascript" src="../../../lib/date-formatter.js"></script>
<script>
var User_Name = <%=mapper.writeValueAsString(user_name)%>;
var User_Id = <%=mapper.writeValueAsString(user_id)%>;
var Agile_User_Id = <%=mapper.writeValueAsString(agile_user_id)%>;
var SELECTED_DOMAIN_USER="";
var domainname=<%=mapper.writeValueAsString(domain_name)%>;
var d_name=<%=mapper.writeValueAsString(d_name)%>;
var contact_id=<%=mapper.writeValueAsString(sContactId)%>;
var contact_name=<%=mapper.writeValueAsString(sContactName)%>;
var document_id=<%=mapper.writeValueAsString(sDocumentId)%>;
var sDocumentFound=<%=bDocumentFound%>;
var subject=<%=mapper.writeValueAsString(sNoteSubject)%>
 </script>
<style type="text/css">
.page-header {
  height: 52px;
  padding: 0 24px;
  box-shadow: 0 1px 0 rgba(132, 132, 132, 0.35);
  background: #f4f4f4;
}
.panelviewer {
  position: absolute;
}
.panel--top {
  top: 0;
  right: 0;
  bottom: auto;
  left: 0;
  z-index: 1020;
}
.p-l-4
{
	padding-left: 4px;
}
.p-r-4
{
	padding-right: 4px;
}
.page__wrap {
  position: relative;
  box-shadow: -300px 0 0 #2e2f35;
  transition: -webkit-transform 0.22s cubic-bezier(0.055, 0.465, 0.425, 1.085);
  transition: transform 0.22s cubic-bezier(0.055, 0.465, 0.425, 1.085);
  transition: transform 0.22s cubic-bezier(0.055, 0.465, 0.425, 1.085), -webkit-transform 0.22s cubic-bezier(0.055, 0.465, 0.425, 1.085);
  /* custom */
}
.h100 {
    height: 100%;
}
.document {
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  height: 100%;
  position: relative;
}
.document__zoom-pad {
    padding-top: 20px;
}
</style>
</head>

<body onload="bodyLoad();" style="width:100%;height:100%;overflow:hidden;" >
	<div class="document-empty" style="display:none;">
			<h1><center>Document Not Available</center></h1>
	</div>		
	<div class="wrapper-md lter bg-light b-b document-content">
	           <div class="row">
	               <div class="col-md-12 col-sm-12 col-xs-12" id="document-add">
	                       <h3 class="pull-left font-thin h3"><%=docTitle%></h3>
	                      
	               </div>
	           </div>
	</div>
		<div class="hbox hbox-auto-xs bg-light  ng-scope document-content" >
		  <!-- column -->
			 <div class="col" style="height:90%;">
			   <div class="vbox">
			     <div class="row-row">
			       <div class="cell" style="height:90%;">
			         <div class="cell-inner">
			           <div class="wrapper-md">
			            <div class="col-md-8 col-sm-12 col-xs-12 container panel panel-default col-md-offset-2">
							<!-- Container Div -->
							<div class="panel-body">
							<!-- Left Div -->
							<div class="col-md-12">
							<%=htmlContent%>
							</div>
							<!-- Right Div -->
							<div class="col-md-4"></div>
							</div>
							</div>
			           </div>
			         </div>
			       </div>
			     </div>
			   </div>
			 </div>
			 <!-- /column -->

			  <!-- column -->
			 <div class="col w-xl lter b-l" style="height:90%;">
				   <div class="vbox" style="height:85%;">
					     <div class="wrapper b-b b-light">
					       <div class="font-thin h4" style="margin-left:8px;">Comments</div>
					     </div>
					     <div class="row-row">
						       <div class="cell">
						         <div class="cell-inner">
						           <div class="wrapper-md comments-history">
										<% if(notes!=null ){ for(DocumentNote note:notes){ %>
										             <ul class="list-group" style="margin-bottom:10px;">
										<li class="list-group-item document-notes"><p class="b-b b-light line-clamp line-clamp-3 activity-tag" style="word-wrap: break-word;overflow:hidden;" title="<%=note.description %>" ><%=note.description %></p>
											<small class="block text-muted"> 
							                    	<div class="m-b-none text-flow-ellipsis line-clamp">by <%=note.getcommenter_name()%><small class="pull-right text-muted"><i class="fa fa-fw fa-clock-o"></i> <time 	class="timeago" datetime="<%=note.created_time %>"><%=note.created_time%></time></small></div>
							                    	
						                    </small>
										
										</li>
										</ul>
										<%};} %>
						           </div>
						         </div>
						       </div>
					     </div>
					     <div class="padder b-t  text-center">
						       <div class="m-t-sm"><div class="row">
						       		<textarea class="inputtext " rows="6" id="comments" name="notes" placeholder="Add Comments"></textarea>
									<text id="contact_id" name="subject" type="hidden" value="<%=sContactId%>"></text>
									<text id="subject" name="subject" type="hidden" value="<%=sNoteSubject%>"></text>
								</div>
								<div class="row">
									<a  class="text-info" id="send-comments"><i class="icon-envelope-alt"></i> Send </a>
								</div>
								<span class="doc-comment-error-status  " style="color:#d9534f;"></span>
						</div>
				    </div>
			   </div>
			</div>
	
 <!-- /column -->
 <!-- /column -->
<script type="text/javascript">
function bodyLoad()
		{
			
		}
</script>
<script type="text/javascript">
		

		
		
		$(document).ready(
				function()
				{
					if(sDocumentFound=="0"){
						$(".document-empty").css("display","block");
						$(".document-content").css("display","none");
					}
					$(".document-notes").each(function(){
								var sEpochTime =$("time", this).attr("datetime")
								var format = "mmm dd yyyy HH:MM:ss"
								if ((sEpochTime / 100000000000) > 1)
								{
									console.log(new Date(parseInt(sEpochTime)).format(format));
									return new Date(parseInt(sEpochTime)).format(format, 0);
								}
								// date form milliseconds
								var d = new Date(parseInt(sEpochTime) * 1000).format(format);
								$("time", this).attr("datetime",d)	
						$("time", this).timeago();
					});
					
					$("body").on("click","#send-comments",function (e){
						e.preventDefault();
						var jsonreq=[];
						var sCommentsVal=$("#comments").val();
						if(!sCommentsVal.trim())
						{
							$(".doc-comment-error-status").html("Comments is required.")
							return;
						}
						else
							$(".doc-comment-error-status").html("")
						var doc_json={"description":$("#comments").val(),
							"contact_id": contact_id,
								"commenter_id": contact_id,
							"commenter_name": contact_name,
							"document_id":document_id,
							"subject":subject,
							"owner_id" : User_Id,
							"agileUserId" : Agile_User_Id,
							"d_name" : d_name,
							"domainname" : domainname,
							};
						
						$.ajax({
							url : '/core/api/documentviewer',
							type : 'PUT',
							contentType : 'application/json; charset=utf-8',
							data : JSON.stringify(doc_json),
							dataType : '',
							complete : function(res, status)
							{

							},
							success:function(res){
								var d = new Date();
								var sSeconds = d.getTime() / 1000;
								var sComments=$("#comments").val();
								var sHTML='<ul class="list-group"><li class="list-group-item document-notes"><p class="b-b b-light line-clamp line-clamp-3 activity-tag" style="display:-moz-box;word-wrap: break-word;overflow:hidden;">'+ sComments +'</p><small class="block text-muted"><div class="m-b-none text-flow-ellipsis line-clamp">by ' + contact_name + '<small class="pull-right text-muted"><i class="fa fa-fw fa-clock-o"></i> <time class="timeago" datetime="Feb 19 2016 19:02:53" title="'+ sSeconds + '">less than a minute ago</time></small></div></small></li></ul>'
								$(".comments-history").prepend(sHTML)
								$("#comments").val("")
								$('#comments').focus();
							}	
						});			
					});

					setTimeout(function(){
						$('#comments').focus();
					},1000);
				}
				
			);

		
	</script>
</body>

</html>