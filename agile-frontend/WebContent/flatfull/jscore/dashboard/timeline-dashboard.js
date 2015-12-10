    
function setup_dashboardTimeline(url)
{
	if(!url)
		url = "core/api/timeline/contact";
head.js(LIB_PATH + 'lib/storyjs-embed.js', function(){
createStoryJS({
       	type:       'default',
        width:      '1170',
        height:     '350',
      //  source:     'https://docs.google.com/spreadsheet/pub?key=0AqHV0BeH8amcdGxyS0cxS0NNandSaV9oTXRhWTdEbmc&output=html',
        source : url,
        embed_id:   'my-timeline' ,    // ID of the DIV you want to load the timeline into
        js :	'lib/timeline-min.js',
        css : 	'css/dashboard-timeline.css'
		});
	});
}
