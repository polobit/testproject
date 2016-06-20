/**
 * ClickDesk app.js file
 */
(function() {

	return {

		// Here we define AJAX calls
		requests : {

			// Ajax call to fetch chats
			fetchUserInfo : function(email) {
				
				console.log("Fetching Email " + email);
				console.log(this.settings.domain + " " + this.settings.agile_email + " " + this.settings.apikey);
				
				return {
					url : 'https://' + this.settings.domain + '.agilecrm.com/dev/api/contacts/search/email/'+ email,
					type : 'GET',
					headers : {
						'Authorization' : 'Basic ' + Base64.encode(this.settings.agile_email + ':'+ this.settings.apikey),
						'Accept' : 'application/json; charset=UTF-8',
						'X-Suppress-Login-Dialog' : true
					},
					secure : true
				};
			}
		},

		// Here we define events such as a user clicking on something
		events : {

			// Entry point for App loading
			'app.activated' : 'init',

			// Event fires when chats fetched successfully
			'fetchUserInfo.done' : function(response) {

				console.log("Received response");
				console.log(response);
				
				if(!response)
				{
					response = {email: this.ticket().requester().email()};
					console.log("response is null");
					console.log(response);
				}
				
				this.showContactInfo(response);
			},

			// Event fires when fetchChats ajax call gets fail
			"fetchUserInfo.fail" : function(data, text_status, jqXHR) {

				// Enable load button
				this.$(".load-chats").attr("disabled", false);

				// Checking if request is unauthorized
				if (data.status == "401") {

					// Displaying unauthorized err page
					this.switchTo('auth_err');
					return;
				}

				// Display error page
				this.switchTo('error');
			}
		},

		init : function() {
			
			console.log("Inside the init of Agile Widget");
			

			var currentLocation = this.currentLocation();

			console.log(currentLocation);
			if (currentLocation == "nav_bar") {

				// Show ajax loader while fetching chats
				this.switchTo('admin_panel');
				return;
			}

			// Show ajax loader while fetching chats
			this.switchTo('loading');
			
			// Get chats from ClickDesk server
			this.ajax('fetchUserInfo', this.ticket().requester().email());
		},

		showContactInfo : function(contact) {

			// Renders the list of chats to chats_list template
			this.switchTo('chats_list', contact);
		}
	};
}());