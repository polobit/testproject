<%@page import="com.agilecrm.session.SessionManager"%>
<%@page import="java.util.HashSet"%>
<%@page import="com.agilecrm.db.ObjectifyGenericDao"%>
<%@page import="com.agilecrm.user.util.DomainUserUtil"%>
<%@page import="com.agilecrm.workflows.Workflow"%>
<%@page import="java.util.List"%>
<%@page import="com.agilecrm.workflows.util.WorkflowUtil"%>
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

//Add this in session manager
	SessionManager.set((HttpServletRequest) request);

/**
 * Initialize DataAccessObject.
 */
ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(Workflow.class);

Long userId = DomainUserUtil.getCurentUserId();
List<Workflow> workflowList = workflowList =  dao.ofy().query(Workflow.class).order("name").list();

for(Workflow workflow : workflowList){
	workflow.save();
}

if(true)
	return;

if(userId == null){
	workflowList =  dao.ofy().query(Workflow.class).order("name").list();
	out.println("userId = " + userId);
}
	
else {
	Set set = new HashSet();
	set.add(1L);
	set.add(userId);
	
	out.println("set = " + set);
	
	workflowList =  dao.ofy().query(Workflow.class).filter("access_level IN", set).order("name").list();
}

	out.println(workflowList);
%>