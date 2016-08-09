/**
 * Get stream icon for social suite streams.
 */
Handlebars.registerHelper('get_stream_name', function(stream_type)
{
	var stream_names = { 
			"Home" : "{{agile_lng_translate 'social' 'Home'}}", 
			"Retweets" : "{{agile_lng_translate 'social' 'Retweets'}}", 
			"DM_Inbox" : "{{agile_lng_translate 'social' 'DM Inbox'}}", 
			"DM_Outbox" : "{{agile_lng_translate 'social' 'DM Outbox'}}",
			"Favorites" : "{{agile_lng_translate 'social' 'Favorites'}}", 
			"Sent" : "{{agile_lng_translate 'social' 'Sent'}}", 
			"Search" : "{{agile_lng_translate 'social' 'Search'}}", 
			"Scheduled" : "{{agile_lng_translate 'social' 'Scheduled'}}", 
			"All_Updates" : "{{agile_lng_translate 'social' 'all-updates'}}",
			"My_Updates" : "{{agile_lng_translate 'social' 'my-updates'}}" ,
			"Mentions" : "{{agile_lng_translate 'social' 'Mentions'}}",
	};

	if (!stream_type)
		return;

	stream_type = stream_type.trim();
	if(stream_names[stream_type])
		  return stream_names[stream_type];
});




/**
 * Get stream icon for social suite streams.
 */
Handlebars.registerHelper('get_stream_icon', function(name)
{
	if (!name)
		return;

	var icon_json = { "Home" : "icon-home", "Retweets" : "icon-retweet", "DM_Inbox" : "icon-download-alt", "DM_Outbox" : "icon-upload-alt",
		"Favorites" : "icon-star", "Sent" : "icon-share-alt", "Search" : "icon-search", "Scheduled" : "icon-time", "All_Updates" : "icon-home",
		"My_Updates" : "icon-share-alt" };

	name = name.trim();

	if (icon_json[name])
		return icon_json[name];

	return "icon-globe";

});
