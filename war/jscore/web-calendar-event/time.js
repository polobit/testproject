// Convert human date to epoch time
function getEpochTimeFromDate(selectedDate)
{
	console.log("in getEpochTimeFromDate");
	var d = new Date(selectedDate);
	console.log(d);
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
	console.log(date.getYear() + "," + date.getMonth() + "," + date.getDate())
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

	// Adding offset to date returns GMT time
	return date.getTime();
}

//Get Timezone Abbreviation from Time
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

	// Get hrs
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
