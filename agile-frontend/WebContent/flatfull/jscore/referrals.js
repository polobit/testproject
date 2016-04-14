$(function() {

	$("#referModal").on("click", 'ul li', function(e) {
		var data = $(this).attr("id");
		if(data == undefined)
			return;
		switch(data){
			case "write_blog":
				$("#referModal").find(".modal-body").html(getTemplate('refer-blog', {}));
				return;
			case "refer_friends":
				$("#referModal").modal("hide");
				window.location = "#refer-friends";
				return;
			case "share_on_fb":
				shareOnFacebook();
				return;
			case "follow_on_twitter":
				var newwindow = window.open('cd_twitter.jsp?referral_type=follow','twitter','height=700,width=700,location=1');
				if (window.focus)
				{
					newwindow.focus();
				}
				return;
			case "tweet_about_us":
				$("#referModal").find(".modal-body").html(getTemplate('refer-tweet', {}));
				return;
			default:
				return;
		}
	});

	$("#referModal").on('click', '#blogMail', function(e){
		e.preventDefault();

		if($(this).attr('disabled'))
	   	     return;
		
		// If not a valid form return else serialize form data to parse
		if(!isValidForm($("#blogmailForm")))
			return;
		
		// Disables send button and change text to Sending...
		disable_send_button($(this));
		
		var json = serializeForm("blogmailForm");

		json.from = CURRENT_DOMAIN_USER.email;
		var $that = $(this)
		// Replace \r\n with <br> tags as email is sent as text/html
		json.body = json.body.replace(/\r\n/g,"<br/>");
        

        $.ajax({

			type : 'POST',
			data : json,
			url : 'core/api/emails/contact-us',
			success : function()
			{
				enable_send_button($that);
				trackReferrals("blogpost");
				showNotyPopUp("information", "Your submission is successful, thank you.", "top");
				
			},
			error : function(response)
			{
				enable_send_button($that);
				showNotyPopUp("warning", data.responseText, "top");
			}
			});
	});

	$("#referModal").on('click', '#refer_by_tweet', function(e){
		e.preventDefault();

		if($(this).attr('disabled'))
	   	     return;
	   	var newwindow = window.open('cd_twitter.jsp?referral_type=tweet','twitter','height=700,width=700,location=1');
		if (window.focus)
		{
			newwindow.focus();
		}
	});

	$("#referModal").on('click', '#go_to_referrals', function(e){
		e.preventDefault();
		$("#referModal").find(".modal-body").html(getTemplate('refer-modal-body', {}));
	});
});

function shareOnFacebook(){

	console.log("clicked");

	FB.getLoginStatus(function(response) {

		if (response.status === 'connected') {

			// save_user_info(response.authResponse['accessToken']);
			openFacebookModal();

		} else {

			console.log("login");

			FB.login(function(response) {
				if (response.authResponse) {
					// save_user_info(response.authResponse['accessToken']);
					openFacebookModal();
				}
			}, {
				scope : 'email'
			});
		}
	});
}

function openFacebookModal() {

	var feed_json = {
			method : 'feed',
			message : 'We\'re using ClickDesk live chat and help desk software to increase sales, conversions and customer happiness :)',
			link : 'https://www.agilecrm.com',
			name : 'CRM, Sales and Marketing Automation Software',
			caption : 'www.agilecrm.com.com',
			description : 'All-in-one powerful and affordable Customer Relationship Management (CRM) software with sales and marketing automation for small businesses. Sign up now!',
			picture : 'https://doxhze3l6s7v9.cloudfront.net/beta/static/images/agilecrm-logo.jpg',
			display : 'dialog'
		};

	console.log(feed_json);

	FB.ui(feed_json, function(response) {

		console.log(response);

		if (!response || !response.post_id) {
			console.log('post was not shared');
			return;
		}

		toggle_show_with_coupon_container();
		
		// Send success info to server to send email
		trackReferrals("facebook");
		alert("Success");
		addEmails(750);
	});

}

function addEmails(quantity) {

	console.log('Adding '+quantity+' emails');
	$.ajax({url:'core/api/subscription/em?q='+quantity,
			type:'POST',
			success:function(data){
				console.log("Emails added");
			},error: function(){
				console.log("Error occured");
			}
		});
}

function load_facebook_lib_for_referrals() {

	// Facebook
	head.js("https://connect.facebook.net/en_US/all.js", function() {

		window.fbAsyncInit = function() {
			FB.init({
				appId : "827039704106675",
				status : true,
				cookie : true,
				xfbml : true,
				oauth : true
			});
		};

		window.onload = function() {
			FB.Canvas.setAutoResize();
		}

	});

}

function trackReferrals(type){
	$("#referModal").find(".modal-body").html(getTemplate('refer-modal-body', {}));
	if(type == undefined)
		return;
	switch(type){
			case "facebook":
				showNotyPopUp("information", "Your submission is successful, thank you.", "top");
				sendReferralTrackMail("Shared on facebook");
				return;
			case "follow":
				showNotyPopUp("information", "You are following Agile CRM on Twitter. Congratulations!", "top");
				sendReferralTrackMail("Following on twitter");
				return;
			case "tweet":
				showNotyPopUp("information", "Your tweet has been posted successfully.", "top");
				sendReferralTrackMail("Tweet");
				return;
			default:
				return;
		}
	//Agile_GA_Event_Tracker.track_event("refer_"+type,CURRENT_DOMAIN_USER.domain)
}
function sendReferralTrackMail(type, callback)
{
	var json = {};
	json.from=CURRENT_DOMAIN_USER.email;
	json.to = "narmada@agilecrm.com";
	json.cc = "venkat@agilecrm.com";
	json.bcc = "mogulla@agilecrm.com";
	json.subject = "Referrals feature used";	
	json.body = "Username: "+CURRENT_DOMAIN_USER.email+"<br>Domain: "+CURRENT_DOMAIN_USER.domain+"<br>Type: "+type;
	sendEmail(json);
}
