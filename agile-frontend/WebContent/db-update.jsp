<%@page import="com.agilecrm.workflows.util.WorkflowUtil"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.agilecrm.activities.Activity.ActivityType"%>
<%@page import="com.agilecrm.activities.Activity.ActivityType"%>
<%@page import="com.agilecrm.activities.util.ActivityUtil"%>
<%@page import="com.agilecrm.activities.Activity"%>
<%@page import="java.util.List"%>
<%@page import="com.agilecrm.workflows.Workflow"%>
<%@page import="com.agilecrm.db.ObjectifyGenericDao"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%
	out.println(WorkflowUtil.getAllWorkflows(20, null, null));
%>