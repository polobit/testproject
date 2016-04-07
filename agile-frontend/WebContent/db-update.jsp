<%@page import="org.apache.commons.lang.StringUtils"%>
<%@page import="com.google.appengine.api.taskqueue.TaskOptions"%>
<%@page import="com.google.appengine.api.taskqueue.QueueFactory"%>
<%@page import="com.google.appengine.api.taskqueue.Queue"%>
<%@page import="com.campaignio.servlets.deferred.DomainUserAddPicDeferredTask"%>
<%@page import="com.agilecrm.util.NamespaceUtil"%>
<%@page import="java.util.Set"%>
<%

	//Fetches all namespaces
	Set<String> namespaces = NamespaceUtil.getAllNamespacesNew();
	
	// Iterates through each Namespace and initiates task for each namespace
	// to update usage info
	for (String namespace : namespaces) {
		DomainUserAddPicDeferredTask task = new DomainUserAddPicDeferredTask(namespace);

		// Add to queue
		Queue queue = QueueFactory.getDefaultQueue();
		queue.add(TaskOptions.Builder.withPayload(task));
	}
%>