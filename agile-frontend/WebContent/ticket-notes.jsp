<%@page import="org.json.JSONArray"%>
<%@page import="org.json.JSONObject"%>
<%@page import="com.agilecrm.ticket.utils.TicketNotesUtil"%>
<%@page import="com.agilecrm.ticket.entitys.TicketNotes"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
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
	JSONObject outputString = null;
	if(type != null && type.equalsIgnoreCase("html")){ 
		out.println(notes.html_text);
	}else{

		try{
			outputString = new JSONArray(notes.mime_object).getJSONObject(0);
		}catch(Exception e){
		}
		
	}
	%>

	<pre id="original_message" class="original_message"></pre>

	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.10.2/jquery.min.js">
	</script>
	<script type="text/javascript">
		
		var mime = '<%= outputString%>';

		if(mime &&  mime != null && mime != "undefind"){

			mime = mime.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

			var mimeobj = JSON.parse(mime);

			$(".original_message").html(JSON.stringify(mimeobj, null, 4));

		}
		
	</script>
</body>

</html>