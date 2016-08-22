$(function() {
	
	$("#referModal").on("click", 'ul li', function(e) {
		var data = $(this).attr("id");
		if(data == undefined)
			return;
		switch(data){
			case "write_blog":
				$("#referModal").find(".modal-body").html(getTemplate('refer-blog', {}));
				Agile_GA_Event_Tracker.track_event("Write a blog (Ref)");
				return;
			case "refer_friends":
				$("#referModal").modal("hide");
				Agile_GA_Event_Tracker.track_event("Refer Friends (Ref)");
				window.location = "#refer-friends";
				return;
			case "share_on_fb":
				if($.inArray("facebook_share", REFER_DATA.usedReferTypes) != -1)
					return;
				Agile_GA_Event_Tracker.track_event("Share on Facebook (Ref)");
				shareOnFacebook();
				return;
			case "follow_on_twitter":
				if($.inArray("twitter_follow", REFER_DATA.usedReferTypes) != -1)
					return;
				Agile_GA_Event_Tracker.track_event("Follow on Twitter (Ref)");
				var newwindow = window.open('cd_twitter.jsp?referral_type=follow','twitter','height=700,width=700,location=1');
				if (window.focus)
				{
					newwindow.focus();
				}
				return;
			case "tweet_about_us":
				if($.inArray("twitter_tweet", REFER_DATA.usedReferTypes) != -1)
					return;
				Agile_GA_Event_Tracker.track_event("Tweet about us (Ref)");
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

		var $that = $(this);
		json.body = "Username: "+CURRENT_DOMAIN_USER.email+"<br>Domain: "+CURRENT_DOMAIN_USER.domain+"<br>Blog URL: "+json.body;
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
				showNotyPopUp("information", "{{agile_lng_translate 'socialsuite' 'submission-success'}}", "top");
				
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
		$("#referModal").find(".modal-body").html(getTemplate('refer-modal-body', REFER_DATA));
	});

	$("#referModal").on('click', '#refered_users', function(e){
		$("#referModal").modal('hide');
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

		
		// Send success info to server to send email
		trackReferrals("facebook");
		addRefeferCredits("facebook");
	});

}

function addRefeferCredits(type) {

	$.ajax({url:'core/api/refer/share_on_fb',
			type:'POST',
			success:function(data){
				REFER_DATA.usedReferTypes.push("facebook_share");
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
	$("#referModal").find(".modal-body").html(getTemplate('refer-modal-body', REFER_DATA));
	if(type == undefined)
		return;
	switch(type){
			case "facebook":
				showNotyPopUp("information", "{{agile_lng_translate 'socialsuite' 'submission-success'}}", "top");
				$("#share_on_fb").css("cursor", "not-allowed");
				$("#share_on_fb .refer-checked").removeClass("hide");
				sendReferralTrackMail("Shared on facebook");
				REFER_DATA.usedReferTypes.push("facebook_share");
				return;
			case "follow":
				showNotyPopUp("information", "{{agile_lng_translate 'socialsuite' 'follow-twitter'}}", "top");
				$("#follow_on_twitter").css("cursor", "not-allowed");
				$("#follow_on_twitter .refer-checked").removeClass("hide");
				sendReferralTrackMail("Following on twitter");
				REFER_DATA.usedReferTypes.push("twitter_follow");
				return;
			case "tweet":
				showNotyPopUp("information", "{{agile_lng_translate 'socialsuite' 'posted-twitter'}}", "top");
				$("#tweet_about_us").css("cursor", "not-allowed");
				$("#tweet_about_us .refer-checked").removeClass("hide");
				sendReferralTrackMail("Tweet");
				REFER_DATA.usedReferTypes.push("twitter_tweet");
				return;
			default:
				return;
		}
	//Agile_GA_Event_Tracker.track_event("refer_"+type,REFER_DATA.domain)
}
function sendReferralTrackMail(type, callback)
{
	var json = {};
	json.from=CURRENT_DOMAIN_USER.email;
	json.cc = "venkat@agilecrm.com";
	json.bcc = "mogulla@agilecrm.com";
	json.to = "shreyansh@agilecrm.com";
	json.subject = "Referrals feature used";	
	json.body = "Username: "+CURRENT_DOMAIN_USER.email+"<br>Domain: "+CURRENT_DOMAIN_USER.domain+"<br>Type: "+type;
	sendEmail(json);
}
