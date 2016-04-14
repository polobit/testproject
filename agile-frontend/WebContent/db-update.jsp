<%@page import="com.agilecrm.core.api.JSAPI"%>
<%@page import="com.agilecrm.contact.js.JSContact"%>
<%@page import="org.codehaus.jackson.map.ObjectMapper"%>
<%@page import="com.agilecrm.util.JSAPIUtil"%>
<%@page import="com.agilecrm.contact.Contact"%>
<%@page import="com.agilecrm.contact.util.ContactUtil"%>
<%@page import="com.agilecrm.account.util.APIKeyUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.google.appengine.api.taskqueue.TaskOptions"%>
<%@page import="com.google.appengine.api.taskqueue.QueueFactory"%>
<%@page import="com.google.appengine.api.taskqueue.Queue"%>
<%@page
	import="com.campaignio.servlets.deferred.DomainUserAddPicDeferredTask"%>
<%@page import="com.agilecrm.util.NamespaceUtil"%>
<%@page import="java.util.Set"%>
<%
    String email = request.getParameter("email");
    if(email == null)
    	   return;
    
	out.println(new JSAPI().getContact(email));
%>