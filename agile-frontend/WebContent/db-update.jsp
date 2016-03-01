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
	Query proj = new Query("DomainUser");
	proj.addProjection(new PropertyProjection("email", String.class));
	proj.addProjection(new PropertyProjection("name", String.class));

	DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
	Iterator<Entity> projTests = datastore.prepare(proj).asIterable().iterator();

	while (projTests.hasNext()) {
		Entity entity = projTests.next();
		System.out.println(entity.getKey().getId());

		Map<String, Object> props = entity.getProperties();

		for (Map.Entry<String, Object> entry : props.entrySet()) {
			System.out.println(entry.getKey() + "/" + entry.getValue());

		}

	}
%>