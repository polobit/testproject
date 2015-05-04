package com.campaignio.tasklets.agile;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;
import java.util.Vector;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.campaignio.tasklets.TaskletAdapter;
import com.campaignio.tasklets.util.TaskletUtil;

/**
 * <code>BusinessHours</code> represents Check Business Hours node in campaigns.
 * This class looks at the current timing rules and looks at the values given
 * out in the grid and gives Yes or No.
 * 
 * @author Manohar
 * 
 */
public class BusinessHours extends TaskletAdapter
{
	/**
	 * Duration period
	 */
	public static String TIME_GRID = "timegrid";

	/**
	 * Duration type such as Days,Hours and Minutes
	 */
	public static String TIME_ZONE = "timezone";

	/*
	 * (non-Javadoc)
	 * 
	 * @see com.campaignio.tasklets.TaskletAdapter#run(org.json.JSONObject,
	 * org.json.JSONObject, org.json.JSONObject, org.json.JSONObject)
	 */
	public void run(JSONObject campaignJSON, JSONObject subscriberJSON, JSONObject data, JSONObject nodeJSON)
			throws Exception
	{
		String timeGrid = getStringValue(nodeJSON, subscriberJSON, data, TIME_GRID);

		String zoneValueInJSON = getStringValue(nodeJSON, subscriberJSON, data, TIME_ZONE);

		boolean isMatched = false;

		isMatched = inBusinessHour(timeGrid, zoneValueInJSON);

		if (isMatched)
			TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, "YES");
		else
			TaskletUtil.executeTasklet(campaignJSON, subscriberJSON, data, nodeJSON, "NO");

	}

	private boolean inBusinessHour(String timeGrid, String zoneValueInJSON)
	{

		try
		{
			JSONArray arrayDuration = new JSONArray(timeGrid);
			int jsonArrayLength = arrayDuration.length();

			for (int i = 0; i < jsonArrayLength; i++)
			{

				JSONObject json = arrayDuration.getJSONObject(i);
				Vector<Integer> dayOfWeek = new Vector<Integer>();

				/*
				 * "Mon-Fri": "Mon-Fri", "Mon-Sat": "Mon-Sat", "Mon-Sun":
				 * "Mon-Sun", "Sat-Sun": "Sat-Sun", "Mon": "Mon", "Tue": "Tue",
				 * "Wed": "Wed", "Thu": "Thu", "Fri": "Fri", "Sat": "Sat",
				 * "Sun": "Sun"
				 */

				/*
				 * { "Day": "Mon-Fri", "From": "9:00 AM", "To": "6:00 PM" }, {
				 */

				// Check day
				String uiDay = json.getString("Day");
				if (uiDay.equalsIgnoreCase("Mon-Fri"))
				{
					dayOfWeek.add(Calendar.MONDAY);
					dayOfWeek.add(Calendar.TUESDAY);
					dayOfWeek.add(Calendar.WEDNESDAY);
					dayOfWeek.add(Calendar.THURSDAY);
					dayOfWeek.add(Calendar.FRIDAY);
				}

				if (uiDay.equalsIgnoreCase("Mon-Sat"))
				{
					dayOfWeek.add(Calendar.MONDAY);
					dayOfWeek.add(Calendar.TUESDAY);
					dayOfWeek.add(Calendar.WEDNESDAY);
					dayOfWeek.add(Calendar.THURSDAY);
					dayOfWeek.add(Calendar.FRIDAY);
					dayOfWeek.add(Calendar.SATURDAY);
				}
				if (uiDay.equalsIgnoreCase("Mon-Sun"))
				{
					dayOfWeek.add(Calendar.MONDAY);
					dayOfWeek.add(Calendar.TUESDAY);
					dayOfWeek.add(Calendar.WEDNESDAY);
					dayOfWeek.add(Calendar.THURSDAY);
					dayOfWeek.add(Calendar.FRIDAY);
					dayOfWeek.add(Calendar.SATURDAY);
					dayOfWeek.add(Calendar.SUNDAY);
				}

				if (uiDay.equalsIgnoreCase("Sat-Sun"))
				{
					dayOfWeek.add(Calendar.SATURDAY);
					dayOfWeek.add(Calendar.SUNDAY);
				}

				if (uiDay.equalsIgnoreCase("Mon"))
					dayOfWeek.add(Calendar.MONDAY);

				if (uiDay.equalsIgnoreCase("Tue"))
					dayOfWeek.add(Calendar.TUESDAY);

				if (uiDay.equalsIgnoreCase("Wed"))
					dayOfWeek.add(Calendar.WEDNESDAY);

				if (uiDay.equalsIgnoreCase("Thu"))
					dayOfWeek.add(Calendar.THURSDAY);

				if (uiDay.equalsIgnoreCase("Fri"))
					dayOfWeek.add(Calendar.FRIDAY);

				if (uiDay.equalsIgnoreCase("Sat"))
					dayOfWeek.add(Calendar.SATURDAY);

				if (uiDay.equalsIgnoreCase("Sun"))
					dayOfWeek.add(Calendar.SUNDAY);

				Calendar currentcalendar = Calendar.getInstance();
				int day = currentcalendar.get(Calendar.DAY_OF_WEEK);

				if (!dayOfWeek.contains(day))
					continue;
				// Get the current time in Hong Kong
				/*
				 * { "name": "timezone", "value":
				 * "(GMT-12:00 ) International Date Line West" }
				 */

				// Start time
				// "From": "9:00 AM",
				// "To": "6:00 PM"
				String startTimeUI = json.getString("From");
				String startTimeHour = startTimeUI.split(":")[0];
				String startTimeMins = startTimeUI.split(":")[1].split(" ")[0];
				String startTimeAM = startTimeUI.split(":")[1].split(" ")[1];

				if (startTimeAM.equalsIgnoreCase("PM"))
				{
					int hour = Integer.parseInt(startTimeHour);

					if (hour != 12)
						startTimeHour = "" + (hour + 12);

				}

				if (startTimeAM.equalsIgnoreCase("AM"))
				{
					int hour = Integer.parseInt(startTimeHour);

					if (hour == 12)
						startTimeHour = "00";

				}

				// Add 0
				if (startTimeHour.length() <= 1)
					startTimeHour = "0" + startTimeHour;

				String startTime = startTimeHour + startTimeMins;

				// End time
				String endTimeUI = json.getString("To");
				String endTimeHour = endTimeUI.split(":")[0];
				String endTimeMins = endTimeUI.split(":")[1].split(" ")[0];
				String endTimeAM = endTimeUI.split(":")[1].split(" ")[1];

				if (endTimeAM.equalsIgnoreCase("AM"))
				{
					int hour = Integer.parseInt(endTimeHour);

					if (hour == 12)
						endTimeHour = "00";

				}

				if (endTimeAM.equalsIgnoreCase("PM"))
				{
					int hour = Integer.parseInt(endTimeHour);
					if (hour != 12)
						endTimeHour = "" + (hour + 12);
				}
				if (endTimeHour.length() <= 1)
					endTimeHour = "0" + endTimeHour;

				String endTime = endTimeHour + endTimeMins;

				// Zone
				String timeZone = zoneValueInJSON.substring(zoneValueInJSON.indexOf("GMT"));

				// Get in quotes (GMT-12:00)
				String tz = timeZone.substring(0, timeZone.indexOf(")"));

				Calendar calendar = new GregorianCalendar(TimeZone.getTimeZone(tz.trim()));
				// Calendar calendar = new
				// GregorianCalendar(TimeZone.getTimeZone(gmt));

				// if(!dayOfWeek.contains(calendar.get(Calendar.DAY_OF_WEEK)))
				// continue;

				// Check time
				String currentTime = "" + calendar.get(Calendar.HOUR_OF_DAY) + "" + calendar.get(Calendar.MINUTE);
				if (currentTime.length() < 4)
				{
					currentTime = "0" + currentTime;
				}

				/*
				 * If the start time time and time are same then it means that
				 * the working hours are 24hrs so all the 24 hrs are working
				 * hours. added by Jaffar on 24 Sep 2010
				 */

				if (startTime.compareTo(endTime) == 0)
					return true;

				/*
				 * when the end time is night 12 O clock then this block will be
				 * executed added by Jaffar on 1st oct 2010
				 */
				if ((endTime.trim()).equalsIgnoreCase("0000"))
				{
					endTime = "2400";
					if (currentTime.compareTo(startTime) > 0 && currentTime.compareTo(endTime) < 0)
						return true;
				}
				if (currentTime.compareTo(startTime) > 0 && currentTime.compareTo(endTime) < 0)
					return true;
			}
		}
		catch (JSONException e)
		{
			// TODO Auto-generated catch block
			System.err.println("Inside isBusinessHour node method");
			e.printStackTrace();
			return false;
		}
		return false;
	}

}