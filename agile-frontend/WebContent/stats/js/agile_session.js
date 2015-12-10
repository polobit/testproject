/**
 * agile_sesion.js deals with the functions used to generate, get, reset session_id,
 * initiate cookie variables and session
 * 
 */
var agile_session = {
		
		// Initiating session cookie variables
		init : function()
		{
			this.cookie_name = 'agile-crm-session_id';
			this.cookie_start_time = 'agile-crm-session_start_time';
			this.cookie_duration_secs = 60 * 1000;
			this.new_session = false;

		},
		
		// Generating random number like 2e397815-5560-c905-56f2-8ad5fe922481
		random : function()
		{
			var S4 = function()
			{
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};
			return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
		}, 
		
		// Get session id from cookie if not present generate
		get : function()
		{
			var session_id = agile_read_cookie(this.cookie_name);
			if (!session_id)
				return this.generate();

			// Check if session expired if yes then generate new session
			var prev_session_start_time = agile_read_cookie(this.cookie_start_time);
			var current_time_secs = new Date().getUTCSeconds();
			if ((current_time_secs < prev_session_start_time) || (current_time_secs > (prev_session_start_time + this.cookie_duration_secs)))
			{
				return this.generate();
			}

			return session_id;
		},
		
		// Generate session_id and store start date and time in cookie
		generate : function()
		{
			var session_id = this.random();
			agile_create_cookie(this.cookie_name, session_id, 0);
			agile_create_cookie(this.cookie_start_time, new Date().getUTCSeconds(), 0);
			this.new_session = true;
			return session_id;
		},
		
		// Reset session cookie variables
		reset : function()
		{
			agile_create_cookie(this.cookie_name, "", -1);
			agile_create_cookie(this.cookie_start_time, "", -1);
		} };

agile_session.init();