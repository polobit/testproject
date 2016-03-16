<%@page import="com.agilecrm.ticket.entitys.TicketDocuments"%>
<%@page import="java.util.List"%>
<%@page import="org.json.JSONArray"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.ticket.utils.TicketNotesUtil"%>
<%@page import="com.agilecrm.ticket.entitys.TicketNotes"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="org.apache.commons.lang.exception.ExceptionUtils"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Help Desk | Agile CRM</title>
<style type="text/css">
body {
    font-family: "Source Sans Pro","Helvetica Neue",Helvetica,Arial,sans-serif;
    font-size: 13px;
    -webkit-font-smoothing: antialiased;
    line-height: 1.42857143;
    color: #58666e;
    background-color: transparent;
}
</style>
</head>
<body>
	<%
		String notedID = request.getParameter("id");

		if (StringUtils.isBlank(notedID))
		{
			out.print("Notes ID is missing");
			return;
		}

		TicketNotes notes = TicketNotesUtil.getTicketNotesByID(Long.parseLong(notedID));
		
		String type = request.getParameter("type");
	%>

	<%
	String outputString = null;
	if(type != null && type.equalsIgnoreCase("html")){ 
		out.println(notes.html_text);
		out.println();
		out.println();
		out.println();
		
		if(notes.attachments_list != null && notes.attachments_list.size() > 0){
			
			out.println("<h5>Attachments</h5>");
			List<TicketDocuments> documents = notes.attachments_list;
			
			for(TicketDocuments document : documents)
				out.println("<a href="+ document.url +"  target=\"_blank\">" + document.name + "</a>");
		}
	}else{

		try{
			outputString = notes.mime_object;
		}catch(Exception e){
			System.out.println(ExceptionUtils.getFullStackTrace(e));
		}
		
	}
	%>

	<pre id="original_message" class="original_message"></pre>

	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js">
	</script>
	<script type="text/javascript">

		var mime = <%= outputString%>;
		var type = "<%= type%>";

		printMIMEObj(type, mime);

		function printMIMEObj(type, mime){

			if(type && type == "html")
				return;

			if(!mime || mime == null || mime == "undefind")
				return;

			if(typeof mime == "object")
				mime = JSON.stringify(mime);

			mime = mime.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

			var mimeobj = JSON.parse(mime);

			$(".original_message").html(JSON.stringify(mimeobj, null, 4));

			// $(".original_message").html(JSON.stringify(mimeobj, convertHTMLToString, 4));

		}
		
		function convertHTMLToString (key, value) {
			// Replace the html tags
			return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		}
		
	</script>
</body>

</html>