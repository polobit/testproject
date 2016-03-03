<%@page import="com.agilecrm.contact.util.ContactUtil"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.google.appengine.api.datastore.RawValue"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.Iterator"%>
<%@page import="com.google.appengine.api.datastore.Entity"%>
<%@page import="java.util.List"%>
<%@page
	import="com.google.appengine.api.datastore.DatastoreServiceFactory"%>
<%@page import="com.google.appengine.api.datastore.DatastoreService"%>
<%@page import="com.google.appengine.api.datastore.PropertyProjection"%>
<%@page import="com.google.appengine.api.datastore.Query"%>
<%
  String id = request.getParameter("id");

  out.println( ContactUtil.getContact(Long.parseLong(id)));
%>