// Convert human date to epoch time
function getEpochTimeFromDate(selectedDate)
{
	var d = new Date(selectedDate);
	return getGMTTimeFromDate(d) / 1000;
}

/**
 * Returns GMT time.
 * 
 * @param date
 * @returns
 */
function getGMTTimeFromDate(date)
{
	var current_sys_date = new Date();
	console.log(new Date().getHours());
	console.log(new Date().getMinutes());
	console.log(new Date().getSeconds());
	console.log(date.getYear() + "," + date.getMonth() + "," + date.getDate());
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

	// Adding offset to date returns GMT time
	return date.getTime();
}

// Get Timezone Abbreviation from Time
function GetTimezoneShort(now)
{
	// now is expected as a Date object
	if (now == null)
		return '';
	var str = now.toString();
	// Split on the first ( character
	var s = str.split("(");
	if (s.length == 2)
	{
		// remove the ending ')'
		var n = s[1].replace(")", "");
		// split on words
		var parts = n.split(" ");
		var abbr = "";
		for (i = 0; i < parts.length; i++)
		{
			// for each word - get the first letter
			abbr += parts[i].charAt(0).toUpperCase();
		}
		return abbr;
	}
}

// Convert epoch time to human time
function createNormalTime(slotTime)
{

	var counter = 0;

	var date = new Date(slotTime * 1000);

	var hr = date.getHours();
	var normHr = date.getHours();

	// Get mins
	var min = date.getMinutes();

	var result = new Array();

	// Make hrs in 12hr format
	if (hr > 12)
		normHr = hr - 12;
	else if (hr == 0)
		normHr = "12";

	// add 0 before hr if hr is less than 10, so hr will be 2 digit
	if (normHr < 10)
		result[counter++] = "0";

	result[counter++] = normHr;

	// add : in time
	result[counter++] = ":"

	// add 0 before min if min is less than 10, so min will be 2 digit
	if (min < 10)
		result[counter++] = "0";

	// add min in time
	result[counter++] = min;

	// Decide pm or am
	if (hr >= 12)
		result[counter++] = " pm";
	else
		result[counter++] = " am";

	return result.join('');
}


/**
 * gets date in 2014-09-03 format
 */
function getSelectedTimeFromDate(date)
{
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
	return date.getTime();
}

/**
 * 
 * @param epoch 
 * @returns
 */
function getConvertedTimeFromEpoch(epoch)
{
	// var dateVal = 1395184260;
	var date = moment.unix(epoch);
	var time = date.tz(SELECTED_TIMEZONE).format('hh:mm a');
	return time;
}


/**
 * 
 * @param hr
 * @returns {String}
 */
function getNormalBusinessHouts(hr)
{
	var hrs = hr;
	hr = hr.split(":")[0];
	var min = hrs.split(":")[1];
	if (parseInt(hr) == 0 || parseInt(hr) == 24)
		return "12:" + min + "am";
	if (parseInt(hr) >= 12 && parseInt(hr) <= 23)
		return getNormalTimeAMPM(hr) + ":" + min + "pm";
	else
		return parseInt(hr) + ":" + min + "am";
}


/**
 * converts to 12 hour format from 24 hour format
 * @param hr
 * @returns
 */
function getNormalTimeAMPM(hr)
{
	var name_json = { "12" : "12", "13" : "1", "14" : "2", "15" : "3", "16" : "4", "17" : "5", "18" : "6", "19" : "7", "20" : "8", "21" : "9", "22" : "10",
		"23" : "11" };

	if (name_json[hr])
		return name_json[hr];
	else
		return hr;
}

/**
 * in backend data stored as 0-6(mon-sun) in js 0-6(sun-sat)
 * 
 * @param day
 * @returns {Number}
 */
function convertWeekDayToArray(day)
{
	if (parseInt(day) >= 1 && parseInt(day) <= 6)
		return parseInt(day) - 1;
	if (parseInt(day) == 0)
		return 6;
}

/**
 * get the offset -330 for india
 * @param timezonename
 * @returns
 */

function getTimezoneOffset(timezonename)
{

	return moment.tz.zone(SELECTED_TIMEZONE).offset(new Date().getTime());
}

// current date format is 2013-12-4
function getMidnightEpoch(current_date)
{

	if (CURRENT_DAY_OPERATION == true)
	{
		current_date_mozilla = getUnixTimeStampInSpecificTimezone();
	}
	if (!current_date)
	{
		current_date = current_date_mozilla;
	}
	var d = moment.tz(current_date, SELECTED_TIMEZONE).unix();
	return d;
}


/**
 * changes the unix time stam to specific timezone
 * @param timezone
 * @returns
 */
function getUnixTimeStampInSpecificTimezone(timezone)
{
	var m = moment().tz(SELECTED_TIMEZONE);

	m.set('hour', 00);
	m.set('minute', 00);
	m.set('second', 00);
	m.set('millisecond', 00);
	return m.valueOf();
}


/**
 * gets the time
 * @param time
 * @param timezone
 * @param firstTimeLoading if {true} then loading from jsp page
 * @returns
 */
function getTimeInVisitorTimezone(time,timezone,firstTimeLoading)
{
	if(!timezone)
		timezone=$("#timezone-"+User_Id).html();
	var m = moment().tz(timezone);
	var hour=null;
	var min=null;
	var result=null;
	if(time){
		result=time.split(":")
		
	}
	if(result){
		hour=result[0];
		min=result[1];
	}
	m.set('hour', parseInt(hour));
	m.set('minute', parseInt(min));
	m.set('second', 00);
	m.set('millisecond', 00);
	if(firstTimeLoading==true){
		return toTimeZoneFirstTimeLoading(m.valueOf());
	}
	return toTimeZone(m.valueOf());
}



/**
 * 
 * @param time  while loading jsp time will be 09:00-18:00 format.
 * @param timezone  we are change @agile user 09:00 to Visitor time @Us/eastrn 
 * @returns {String}
 */
function getTimeInVisitorTimezoneWhileLoading(time,timezone){
	var workhours=null;
	var times=null;
	if(time!="Today is holiday")
		times=time.split("-");
	if(times){
		workhours=getTimeInVisitorTimezone(times[0],timezone,true)+" - "+getTimeInVisitorTimezone(times[1],timezone,true);
	}
	else{
		workhours="Today is holiday";
	}
	return workhours;
}



/**
 * 
 * @param time  after click on date picker we are changing time to visitor time
 * @param zone
 * @returns
 */
function toTimeZone(time, zone) {
	
	return moment.tz(time, SELECTED_TIMEZONE).format('hh:mm a')
}


/**
 * converts the @agile user time to vistor time
 * @param time
 * @param zone
 * @returns
 */
function toTimeZoneFirstTimeLoading(time, zone) {
	
	return moment.tz(time, jstz.determine().name()).format('hh:mm a');
}

function getVisitorWhileLoading(){
	return jstz.determine().name(); 
}


function updateUserBusinessHoursInVisitorTimezone(dates){
	
	if(!dates)
		dates=selecteddate;
	
	for(var k=0;k<=multi_user_ids.length - 1;k++){
		var array=business_hours_array[k];
		var s=array[convertWeekDayToArray(new Date(dates).getDay())];
		if(s.isActive){
			$("#workhours-"+multi_user_ids[k]).html(getTimeInVisitorTimezone(s.timeFrom)+" - "+getTimeInVisitorTimezone(s.timeTill));
		}
		else{
			$("#workhours-"+multi_user_ids[k]).html("No working hours");
		}
	}
}