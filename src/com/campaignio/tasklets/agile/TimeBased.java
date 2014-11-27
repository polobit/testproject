package com.campaignio.tasklets.agile;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.TimeZone;
import java.util.Vector;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONObject;

public class TimeBased
{

	public static boolean isMatch() throws Exception
	{
		System.out.println("Now we have reached to class TimeBased");
		JSONArray times = null;// (JSONArray).getJSONValue("timegrid");
		System.out.println("Now we have created the times-object for JSONArray");
		boolean isMatched = false;

		for (int i = 0; i < times.length(); i++)
		{

			JSONObject json = times.getJSONObject(i);
			System.out.println("The value of json is:" + json);
			Vector dayOfWeek = new Vector();

			/*
			 * "Mon-Fri": "Mon-Fri", "Mon-Sat": "Mon-Sat", "Mon-Sun": "Mon-Sun",
			 * "Sat-Sun": "Sat-Sun", "Mon": "Mon", "Tue": "Tue", "Wed": "Wed",
			 * "Thu": "Thu", "Fri": "Fri", "Sat": "Sat", "Sun": "Sun"
			 */

			/*
			 * { "Day": "Mon-Fri", "From": "9:00 AM", "To": "6:00 PM" }, {
			 */

			// Check day
			String uiDay = json.getString("Day");
			System.out.println("The value printed in uiDay is:" + uiDay);
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
			{
				dayOfWeek.add(Calendar.MONDAY);
			}

			if (uiDay.equalsIgnoreCase("Tue"))
			{
				dayOfWeek.add(Calendar.TUESDAY);
			}

			if (uiDay.equalsIgnoreCase("Wed"))
			{
				dayOfWeek.add(Calendar.WEDNESDAY);
			}

			if (uiDay.equalsIgnoreCase("Thu"))
			{
				dayOfWeek.add(Calendar.THURSDAY);
			}

			if (uiDay.equalsIgnoreCase("Fri"))
			{
				dayOfWeek.add(Calendar.FRIDAY);
			}

			if (uiDay.equalsIgnoreCase("Sat"))
			{
				dayOfWeek.add(Calendar.SATURDAY);
			}

			if (uiDay.equalsIgnoreCase("Sun"))
			{
				dayOfWeek.add(Calendar.SUNDAY);
			}

			// Get the current time in Hong Kong
			/*
			 * { "name": "timezone", "value":
			 * "(GMT-12:00 ) International Date Line West" }
			 */

			// Start time
			// "From": "9:00 AM",
			// "To": "6:00 PM"
			String startTimeUI = json.getString("From");
			System.out.println("Raw Start Time:" + startTimeUI);
			String startTimeHour = startTimeUI.split(":")[0];
			System.out.println("Start Time Hour is:" + startTimeHour);
			String startTimeMins = startTimeUI.split(":")[1].split(" ")[0];
			System.out.println("Start Time Minutes is:" + startTimeMins);
			String startTimeAM = startTimeUI.split(":")[1].split(" ")[1];
			System.out.println("Start Time meridian:" + startTimeAM);

			if (startTimeAM.equalsIgnoreCase("PM"))
			{
				int hour = Integer.parseInt(startTimeHour);
				System.out.println("Now the startTimeHour is:" + hour);

				if (hour != 12)
					startTimeHour = "" + (hour + 12);

			}

			if (startTimeAM.equalsIgnoreCase("AM"))
			{
				int hour = Integer.parseInt(startTimeHour);
				System.out.println("Now the startTimeHour is:" + hour);

				if (hour == 12)
					startTimeHour = "00";

			}

			// Add 0
			if (startTimeHour.length() <= 1)
				startTimeHour = "0" + startTimeHour;

			String startTime = startTimeHour + startTimeMins;
			System.out.println("Now the start Time is changed to:" + startTime);

			// End time
			String endTimeUI = json.getString("To");
			System.out.println("The End Time UI is:" + endTimeUI);
			String endTimeHour = endTimeUI.split(":")[0];
			System.out.println("The End Time Hour is:" + endTimeHour);
			String endTimeMins = endTimeUI.split(":")[1].split(" ")[0];
			System.out.println("The EndTime Minutes is:" + endTimeMins);
			String endTimeAM = endTimeUI.split(":")[1].split(" ")[1];
			System.out.println("The EndTimeAM is:" + endTimeAM);

			if (endTimeAM.equalsIgnoreCase("AM"))
			{
				int hour = Integer.parseInt(endTimeHour);
				System.out.println("Now the startTimeHour is:" + hour);

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
			String zoneValueInJSON = null;// vxmlUtil.getJSONValueString("timezone");
			System.out.println(zoneValueInJSON);
			String timeZone = zoneValueInJSON.substring(zoneValueInJSON.indexOf("GMT"));
			System.out.println("The value in timezone is:" + timeZone);

			// Get in quotes (GMT-12:00)
			String tz = timeZone.substring(0, timeZone.indexOf(")"));
			System.out.println("Now the timezone in quotes is:" + tz);

			Calendar calendar = new GregorianCalendar(TimeZone.getTimeZone(tz.trim()));
			// Calendar calendar = new
			// GregorianCalendar(TimeZone.getTimeZone(gmt));

			// if(!dayOfWeek.contains(calendar.get(Calendar.DAY_OF_WEEK)))
			// continue;

			// Check time
			String currentTime = "" + calendar.get(Calendar.HOUR_OF_DAY) + "" + calendar.get(Calendar.MINUTE);
			System.out.println("before current time is" + currentTime);
			if (currentTime.length() < 4)
			{
				currentTime = "0" + currentTime;
			}

			System.out.println("After current time is" + currentTime);

			System.out.println("Time (Start - end - current)" + startTime + " " + endTime + " " + currentTime + " "
					+ timeZone);

			System.out.println("Difference between Current Time and Start Time is:" + currentTime.compareTo(startTime));
			System.out.println("Difference between CurrentTime and EndTime is:" + currentTime.compareTo(endTime));

			/*
			 * If the start time time and time are same then it means that the
			 * working hours are 24hrs so all the 24 hrs are working hours.
			 * added by Jaffar on 24 Sep 2010
			 */

			if (startTime.compareTo(endTime) == 0)
			{
				isMatched = true;
				break;
			}
			/*
			 * when the end time is night 12 O clock then this block will be
			 * executed added by Jaffar on 1st oct 2010
			 */
			if ((endTime.trim()).equalsIgnoreCase("0000"))
			{
				endTime = "2400";
				if (currentTime.compareTo(startTime) > 0 && currentTime.compareTo(endTime) < 0)
				{
					isMatched = true;
					break;
				}
			}
			if (currentTime.compareTo(startTime) > 0 && currentTime.compareTo(endTime) < 0)
			{
				isMatched = true;
				break;
			}
		}

		return isMatched;

	}

}
