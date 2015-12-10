package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.thirdparty.office365.calendar.Office365CalendarPrefs;
import com.thirdparty.office365.calendar.OfficeCalendarTemplate;
import com.thirdparty.office365.calendar.util.Office365CalendarUtil;

@Path("/api/officecalendar")
public class OfficeCalendar365API {

	/**
	 * 
	 * @return
	 */
	@GET
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Office365CalendarPrefs getOfficeCalendarPrefs() {
		List<Office365CalendarPrefs> officeCalendarList = Office365CalendarPrefs
				.getOfficeCalenderDetails();
		if (officeCalendarList.size() > 0) {
			return officeCalendarList.get(0);
		}
		return null;
	}

	/**
	 * 
	 * @return
	 */
	@PUT
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Office365CalendarPrefs saveOfficeCalendarPrefs(
			Office365CalendarPrefs officeCalendar) {
		officeCalendar.save();
		return null;
	}

	/**
	 * 
	 */
	@POST
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public Office365CalendarPrefs setOfficeCalendarPrefs(
			Office365CalendarPrefs officeCalendar) {
		officeCalendar.save();
		return officeCalendar;
	}

	@DELETE
	@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
	public void deleteContactPrefs() {
		System.out.println("delete");
		Office365CalendarPrefs prefs = Office365CalendarUtil.getCalendarPref();
		if (prefs != null)
			prefs.delete();
	}

	/**
	 * Returns office365 emails . Emails json string are returned in the format
	 * {emails:[]}.
	 * 
	 * @param searchEmail
	 *            - to get emails related to search email
	 * @param count
	 *            - required number of emails.
	 * @param offset
	 *            - offset.
	 * @return String
	 */
	@Path("office365-appointments")
	@GET
	@Produces({ MediaType.APPLICATION_JSON, MediaType.APPLICATION_XML })
	public List<OfficeCalendarTemplate> getOffice365Emails(
			@QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		List<OfficeCalendarTemplate> appointments = null;
		String Url = Office365CalendarUtil.getOfficeURL(startDate, endDate);
		appointments = Office365CalendarUtil.getAppointmentsFromServer(Url);

		return appointments;
	}
}
