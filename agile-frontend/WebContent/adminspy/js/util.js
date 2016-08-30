function twilioSecondsToFriendly(time) {
	var hours = Math.floor(time / 3600);
	if(hours > 0)
	time = time - hours*60*60;
	var minutes = Math.floor(time / 60);
	var seconds = time - minutes * 60;
	var friendlyTime = "";
	if(hours == 1)
		friendlyTime = hours+ "h ";
	if(hours > 1)
		friendlyTime = hours+ "h ";
	if(minutes > 0)
		friendlyTime += minutes + "m ";
	if(seconds > 0)
		friendlyTime += seconds + "s ";
	if(friendlyTime != "")
	return friendlyTime;
}