package com.agilecrm.core.api;

import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import com.agilecrm.user.AgileUser;
import com.thirdparty.google.calendar.GoogleCalenderPrefs;
import com.thirdparty.google.calendar.util.GooglecalendarPrefsUtil;
import com.thirdparty.office365.calendar.OfficeCalendarTemplate;
import com.thirdparty.office365.calendar.util.Office365CalendarUtil;

@Path("/api/officecalendar")
public class OfficeCalendar365API {

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
	public List<OfficeCalendarTemplate> getOffice365Appointments(
			@QueryParam("startDate") String startDate,
			@QueryParam("endDate") String endDate) {
		List<OfficeCalendarTemplate> appointments = null;
		try {
			GoogleCalenderPrefs calendarPrefs = GooglecalendarPrefsUtil
					.getCalendarPrefsByType(GoogleCalenderPrefs.CALENDAR_TYPE.OFFICE365);

			String Url = Office365CalendarUtil.getOfficeURL(startDate, endDate,
					calendarPrefs);
			if (Url != null) {
				Long agileUserId = AgileUser.getCurrentAgileUser().id;
				appointments = Office365CalendarUtil.getAppointmentsFromServer(
						Url, agileUserId, "agile_calendar");
			}
		} catch (Exception e) {
			System.out.println("Error " + e);
		}

		return appointments;
	}
}
