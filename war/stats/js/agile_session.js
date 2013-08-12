var agile_session = { 
init : function()
{
	this.cookie_name = 'agile-crm-session_id';
	this.cookie_start_time = 'agile-crm-session_start_time';
	this.cookie_duration_secs = 60 * 1000;
	this.new_session = false;

}, 
random : function()
{
	var S4 = function()
	{
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	};
	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}, 
get : function()
{
	var session_id = agile_read_cookie(this.cookie_name);
	if (!session_id)
		return this.generate();

	// Check if it is valid for 1 hr
	var prev_session_start_time = agile_read_cookie(this.cookie_start_time);
	var current_time_secs = new Date().getUTCSeconds();
	if ((current_time_secs < prev_session_start_time) || (current_time_secs > (prev_session_start_time + this.cookie_duration_secs)))
	{
		console.log("session expired");
		return this.generate();
	}

	return session_id;
}, 
generate : function()
{
	// Create New Session - store start date and time in cookie
	console.log("Creating new session");
	var session_id = this.random();
	agile_create_cookie(this.cookie_name, session_id, 0);
	agile_create_cookie(this.cookie_start_time, new Date().getUTCSeconds(), 0);
	this.new_session = true;
	return session_id;
}, 
reset : function()
{
	agile_create_cookie(this.cookie_name, "", -1);
	agile_create_cookie(this.cookie_start_time, "", -1);
} };

agile_session.init();