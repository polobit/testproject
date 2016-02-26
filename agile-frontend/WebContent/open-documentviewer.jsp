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
<%@page import="com.agilecrm.user.util.UserPrefsUtil"%>
<%@page import="com.agilecrm.user.UserPrefs"%>
<%@page import="com.agilecrm.user.AgileUser"%>
<%@page import="com.agilecrm.document.util.DocumentUtil"%>
<%@page import="com.agilecrm.document.Document"%>
<%@page import="com.agilecrm.contact.DocumentNote"%>
<%@page import="com.agilecrm.contact.util.DocumentNoteUtil"%>
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

String _multiple_contact_ids="";
String htmlContent="";
String docTitle="";
String _multiple_leads_ids="";

URL ur=new URL(url);
String d_name=domain_name= NamespaceUtil.getNamespaceFromURL(ur);
String _AGILE_VERSION = SystemProperty.applicationVersion.get();
String baseUrl=VersioningUtil.getStaticFilesBaseURL();
String sDocumentId=ar[ar.length-2];
String sContactId=ar[ar.length-1];
Long dDocumentId= Long.parseLong(sDocumentId);
Document document =DocumentUtil.getDocument(dDocumentId);
List<DocumentNote> notes=null;
if(document!=null)
{

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
	List<String> list=document.getContact_ids();
	
	if(list!=null)
	{
		for(String id : list){
			_multiple_contact_ids+="," + id;
		};
	}

	List<String> list_deals=document.getDeal_ids();
	
	if(list!=null)
	{
		for(String id : list){
			_multiple_leads_ids+="," + id;
		};
	}	 

	DomainUser domainUser =document.getOwner();
	AgileUser agileUser = AgileUser.getCurrentAgileUserFromDomainUser(domainUser.id);

	UserPrefs userPrefs = UserPrefsUtil.getUserPrefs(agileUser);
	System.out.println("userPrefs " + userPrefs.pic);
	user_name = domainUser.name;
	user_id = domainUser.id;
	agile_user_id = agileUser.id;
	domain_name = domainUser.domain;

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
var contactid=<%=mapper.writeValueAsString(sContactId)%>;
var document_id=<%=mapper.writeValueAsString(sDocumentId)%>;
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


<div class="wrapper-md lter bg-light b-b">
           <div class="row">
               <div class="col-md-12 col-sm-12 col-xs-12" id="document-add">
                       <h3 class="pull-left font-thin h3"><%=docTitle%></h3>
                      
               </div>
           </div>
   </div>
<div class="hbox hbox-auto-xs bg-light  ng-scope" >
  
  <!-- column -->
 <div class="col" style="height:90%;">
   <div class="vbox">
     <div class="row-row">
       <div class="cell">
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
 <div class="col w-md lter b-l" style="height:90%;">
   <div class="vbox" style="height:90%;">
     <div class="wrapper b-b b-light">
       <div class="font-thin h4">Comments History</div>
     </div>
     <div class="row-row">
       <div class="cell">
         <div class="cell-inner">
           <div class="wrapper-md comments-history">
<% if(notes!=null ){ for(DocumentNote note:notes){ %>
             <ul class="list-group">
<li class="list-group-item document-notes"><p class="line-clamp line-clamp-3 activity-tag" style="word-wrap: break-word" title="<%=note.description %>" ><%=note.description %></p>
<small class="block text-muted"><i class="fa fa-fw fa-clock-o"></i> <time class="timeago" datetime="<%=note.created_time %>"><%=note.created_time%></time></small>
</li>
</ul>
<%};} %>
           </div>
         </div>
       </div>
     </div>
     <div class="padder b-t  text-center">
       <div class="m-t-sm"><div class="row">
       	<textarea class="inputtext " rows="6" 
id="comments" name="notes" placeholder="Comments"></textarea>
<text id="contact_ids" name="contact_ids" type="hidden" value="<%=_multiple_contact_ids%>"></text>
<text id="deal_ids" name="deal_ids" type="hidden" value="<%=_multiple_leads_ids%>"></text>
<text id="document_ids" name="document_ids" type="hidden" value="<%=sDocumentId%>"></text>
<text id="subject" name="subject" type="hidden" value="<%=sNoteSubject%>"></text>
</div>
<div class="row">
<a  class="text-info" id="send-comments"><i class="icon-envelope-alt"></i> Send Comments</a>
</div></div>
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
						var contactIds=[];
						var dealIds=[];
						/*if($("#contact_ids").val()!=undefined && $("#contact_ids").val()!="")
						{
							contactIds=$("#contact_ids").val();
							var arrcontactIds=contactIds.split(",");
							$.each(arrcontactIds,function(index,value){
								contactIds.push(value);	
							});
							
						
						}
						

						if($("#deal_ids").val()!=undefined && $("#deal_ids").val()!="")
						{
							dealIds=$("#deal_ids").val();
							var arrdealIds=dealIds.split(",");
							$.each(arrdealIds,function(index,value){
								dealIds.push(value);	
							});
						}*/
						contactIds.push(contactid);	
						var doc_json={"description":$("#comments").val(),
							"contact_ids": contactIds,
							"deal_ids": dealIds,
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
								var sComments=$("#comments").val();
								var sHTML='<ul class="list-group"><li class="list-group-item document-notes"><p>'+ sComments +'</p><small class="block text-muted"><i class="fa fa-fw fa-clock-o"></i> <time class="timeago" datetime="Feb 19 2016 19:02:53" title="1455888773">less than a minute ago</time></small></li></ul>'
								$(".comments-history").prepend(sHTML)
								$("#comments").val("")
							}	
						});			
					});
				}
				
			);

		
	</script>
</body>

</html>