<%@page import="java.util.List"%>
<%@page import="java.util.HashMap"%>
<%@page import="java.util.Map"%>
<%@page import="org.apache.commons.lang.exception.ExceptionUtils"%>
<%@page import="com.agilecrm.activities.Task.Status"%>
<%@page import="com.googlecode.objectify.Query"%>
<%@page import="com.agilecrm.activities.Task"%>
<%@page import="com.agilecrm.db.ObjectifyGenericDao"%>
<%@page import="com.google.appengine.api.NamespaceManager"%>
<%@page import="org.apache.commons.lang.StringUtils"%>
<%
	String nameSpace = request.getParameter("domain");
	if (StringUtils.isBlank(nameSpace))
		return;

	String oldNamespace = NamespaceManager.get();
	try{
		NamespaceManager.set(nameSpace);
		
		ObjectifyGenericDao<Task> dao = new ObjectifyGenericDao<Task>(Task.class);
		Query<Task> query = dao.ofy().query(Task.class);
	    
	    Map<String, Object> searchMap = new HashMap<String, Object>();
	    searchMap.put("status", Status.COMPLETED);
	    searchMap.put("is_complete", false);
	    
	    List<Task> tasks =  dao.listByProperty(searchMap);
	    
	    for(Task task : tasks){
	    	task.completeTask();
	    }

		
	}catch(Exception e){
		e.printStackTrace();
	    System.out.println(ExceptionUtils.getFullStackTrace(e));		
	}finally {
		NamespaceManager.set(oldNamespace);	
	}
%>