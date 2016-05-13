package com.agilecrm.core.api.calendar;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.agilecrm.activities.Task;
import com.google.appengine.labs.repackaged.org.json.JSONObject;

@Path("/api/bulkTask")
public class TaskBulkActionsAPI {
	@Path("/changeProperty")
	@POST
	@Consumes({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<Task> changeBulkTaskProperty(String data) {
		try {
			String ownerId = null;
			JSONObject json = new JSONObject(data);
			com.google.appengine.labs.repackaged.org.json.JSONArray taskIdArray = json.getJSONArray("IdJson");
			String formId = json.getString("form_id");
			boolean pending =  json.getBoolean("pending");
			 Calendar calendar = Calendar.getInstance();
			 System.out.println(calendar.getTime().getMonth());
			 System.out.println(calendar.getTime().getYear());
			 Long updated_time =  1453011076000L ;
			 Date update_date = new Date(updated_time);
			 Date current_date = new Date();
			 int m = update_date.getMonth();
			 int n = update_date.getYear();
			 int o =  current_date.getMonth();
			 int p = current_date.getYear();
			if(json.get("ownerId") != null || json.get("ownerId")!= "")
				ownerId =  (String) json.getString("ownerId");
			String criteria = json.getString("criteria");
			JSONObject priority = json.getJSONObject("priority");
			ArrayList<String> taskIdList = new ArrayList<String>();
			if (taskIdArray != null) {
				int len = taskIdArray.length();
				for (int i = 0; i < len; i++) {
					taskIdList.add(taskIdArray.get(i).toString());
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	

}
