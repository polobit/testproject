/*
 * Remove waiting symbol from stream's column header, 
 * when user return to social tab as well as after getting reply from social server.
 */
function removeWaiting()
{
	var streamsJSON = Streams_List_View.collection.toJSON();

	// Streams not available.
	if (streamsJSON == null)
		return;

	// Get stream
	$.each(streamsJSON, function(i, stream)
	{
		// Get stream from collection.
		var modelStream = Streams_List_View.collection.get(stream.id);

		if (modelStream != null || modelStream != undefined)
		{
			// If any collection have some tweets then remove waiting.
			if (modelStream.get('tweetListView').length >= 1)
			{
				// Hide waiting symbol.
				$("#stream-spinner-modal-" + stream.id).hide();
			}
		}
	});
}
