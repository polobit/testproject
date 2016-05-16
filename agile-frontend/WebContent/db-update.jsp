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
	String domain = request.getParameter("domain");

	// NamespaceManager.set(domain);
	ObjectifyGenericDao<Workflow> dao = new ObjectifyGenericDao<Workflow>(Workflow.class);

	List<Workflow> workflows = dao.fetchAll();
	System.out.println("workflows = " + workflows.size());

	for (Workflow workflow : workflows) {
		workflow.updated_time_update = false;
		// workflow.save(true);

		List<Activity> activities = ActivityUtil.getActivititesBasedOnSelectedConditon(
				ActivityType.CAMPAIGN.toString(), null, 2, null, null, null, workflow.id);
		if(activities != null){
			System.out.println("activities = " + activities.size());
			
			if (activities.size() > 0)
				workflow.updated_time = activities.get(0).time;
		}

		dao.put(workflow, true);
	}
%>