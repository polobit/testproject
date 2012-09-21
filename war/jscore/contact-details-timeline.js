
// Create an empty collection to add all details
function loadTimelineDetails(el, contactId){
	var timelineView =  new Base_Collection_View({
	templateKey: 'timeline',
	individual_tag_name: 'li',
	});
	
	// Override comparator to sort models on time base
	timelineView.collection.comparator = function(item){
		if (item.get('created_time')) {
            return item.get('created_time');
        }
        if (item.get('t')) {
        	return item.get('t')/1000;
        }
        return item.get('id');
	}
	
	// Fetch logs and add to timeline
	var LogsCollection = Backbone.Collection.extend({
		url: '/core/api/campaigns/logs/contact/' + contactId,
	});
	var logsCollection = new LogsCollection();
	logsCollection .fetch({
		success: function(){
			$.each(logsCollection.toJSON(), function(index, model) {
				timelineView.collection.add(JSON.parse(model.logs));
			});
		}
	});
	
	// Store all details urls in an array and fetch 
	var fetchContactDetails = ['core/api/contacts/' + contactId + '/notes', 'core/api/contacts/'+ contactId + '/deals', 'core/api/contacts/'+ contactId + '/tasks'];
	var loading_count = 0;
	
	$.each(fetchContactDetails, function(index, url){
		$('#time-line', el).html('<div><img class="loading" style="padding-right:5px" src="img/21-0.gif"></div>');
		var view =  new Base_Collection_View({
			url: url,
		});
		view.collection.fetch({
			success: function(){
				timelineView.collection.add(view.collection.models);
				if(++loading_count == fetchContactDetails.length)
					removeLoadingImg(el);
			}
		});
	});	
	//timelineView.render(true);
	$('#time-line', el).html(timelineView.render(true).el);	
}	
	
function removeLoadingImg(el){
	$('#time-line', el).find('img').remove();
}	


