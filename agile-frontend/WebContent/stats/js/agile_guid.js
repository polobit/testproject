/**
 * agile_guid.js deals with functions which are used to generate, get, reset guid,
 * get email from cookie, set email to cookie if its new else reset guid and session id. 
 */
var agile_guid = { 
		
		// Initiate cookie variables
		init : function()
		{
			this.cookie_name = 'agile-crm-guid';
			this.cookie_email = 'agile-email';
			this.cookie_original_ref = 'agile-original-referrer';
			this.cookie_tags = 'agile-tags';
			this.cookie_score = "agile-score";
			this.cookie_campaigns = "agile-campaigns";
			this.new_guid = false;
		},
		
		// Generate random number like 81a996ac-812c-7677-4b33-e3c2e0ba3050
		random : function()
		{
			var S4 = function()
			{
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			};
			return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
		}, 
		
		// Read guid from cookie if not present generate it
		get : function()
		{
			var guid = agile_read_cookie(this.cookie_name);
			if (!guid)
				guid = this.generate();
			return guid;
		}, 
		
		// Generate guid
		generate : function()
		{
			guid = this.random();
			agile_create_cookie(this.cookie_name, guid, 365 * 5);

			// first referrer set
			this.set_original_referrer();
			this.new_guid = true;
			return guid;
		}, 
		
		// Reset guid
		reset : function()
		{
			agile_create_cookie(this.cookie_name, "", -1);
		}, 
		set_email : function(new_email)
		{
			// Retrieve from cookie and set it only if it is different
			var email = agile_read_cookie(this.cookie_email);
			if (!email || (email != new_email))
			{
				this.email = new_email;

				// Reset guid and session uid if old email is there
				if (email)
				{
					this.reset();
					agile_session.reset();
				}
				agile_create_cookie(this.cookie_email, this.email, 365 * 5);
			}
		}, 
		get_email : function()
		{
			// If email present in the session
			if (this.email)
				return this.email;

			// Read from cookie
			var email = agile_read_cookie(this.cookie_email);
			return email;
		}, 
		set_original_referrer : function()
		{
			// Capture first referrer
			var original_referrer = document.referrer;

			// Write to cookie
			if(original_referrer)
				agile_create_cookie(this.cookie_original_ref, original_referrer, 365 * 5);
		} };

agile_guid.init();