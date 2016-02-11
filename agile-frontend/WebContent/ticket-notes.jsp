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
	%>
	<%= notes.html_text %>
</body>
</html>