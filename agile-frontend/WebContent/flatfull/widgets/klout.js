var KloutObject = {};

function getKloutScore(contact_id, twitterURL){
	if(twitterURL){
		var twitterArray = twitterURL.split('@');
		queueGetRequest("widget_queue_"+contact_id, 
			"/core/api/widgets/klout/byusername/" + twitterArray[1], 
			"json", 
		  	function success(data){
		  		var currentContactJson = App_Contacts.contactDetailView.model.toJSON(); 
		  		var properties = currentContactJson.properties;
		  		 //getPropertyValue(properties, "klout_score")

		  		console.log('klout success **** ');
		  		console.log(data);
		  		var nickName = data.nickName;
		  		var score = data.score;
		  		if(score){
		  			score = parseFloat(score).toFixed(2);
		  		}

		  		$('#Klout').html('<div class="wrapper-sm"><p class="m-n"><label class="text-muted text-base">'+_agile_get_translated_val('widgets', 'Klout-label-nickname')+':</label> '+ nickName +'</p><p class="m-n"><label class="text-muted text-base">'+_agile_get_translated_val('widgets', 'Klout-label-score')+':</label> '+ score +'</p></div>');			

				var oldKloutScore = getPropertyValue(properties, "klout_score");
				if(oldKloutScore){
					oldKloutScore = parseFloat(oldKloutScore).toFixed(2);
				}

				console.log(score + " : " + oldKloutScore);
				if(!oldKloutScore || oldKloutScore != score){
		  			agile_crm_update_contact_render("klout_score", score);
		  		}


			}, function error(data){
				console.log("Klout failed to get score.");
				$('#Klout').html('<div class="wrapper-sm">'+_agile_get_translated_val('widgets', 'Klout-error')+'</div>');
			}
		);
	}else{		 
		$('#Klout').html('<div class="wrapper-sm">'+_agile_get_translated_val('widgets', 'Klout-update-twitter-profile')+'</div>');
	}
}

function startKloutWidget(contact_id){
	console.log("Klout loaded : "+contact_id);

	KloutObject = {};

	KLOUT_PLUGIN_NAME = "Klout";
	var klout_widget = agile_crm_get_widget(KLOUT_PLUGIN_NAME);

	$('#klout-data-panel').removeClass("hide");

	console.log('In Klout');
	console.log(klout_widget);

	KLOUT_Plugin_Id = klout_widget.id;

	var klout_twitter_web_url = agile_crm_get_contact_property_by_subtype('website', 'TWITTER');

	getKloutScore(contact_id, klout_twitter_web_url);
}