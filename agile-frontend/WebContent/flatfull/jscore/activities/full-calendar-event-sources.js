(function($) {
	var event_souces = {}
	var element;

	function removeSources()
	{

	}

	function getSource(key)
	{
		event_souces[key]
	}

	function addSource(key, sources)
	{
		var isSourceAdded = false;
		if(event_souces[key])
		{
			isSourceAdded = true;
		}

			event_souces[key] = function(start, end, callback)
			{
				callback(sources);
			}

		// Add source if not added already
		if(!isSourceAdded)
			$(element).fullCalendar('addEventSource', getSource(key));

	}

})(jQuery);
