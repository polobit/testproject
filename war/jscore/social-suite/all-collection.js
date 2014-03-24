/** Create temporary collection to store tweets when user not in social tab. */
function createTempCollection()
{
	if (!Temp_Streams_List_View) // Streams not collected from dB
	{
		Temp_Streams_List_View = new Base_Collection_View({ url : "/core/social", restKey : "stream", templateKey : "socialsuite-streams",
			individual_tag_name : 'div', className : 'app-content container clearfix', id : 'stream_container', });

		// Creates new default function of collection
		Temp_Streams_List_View.appendItem = socialsuitecall.socialSuiteAppendItem;

		Temp_Streams_List_View.collection.fetch({ success : function(data)
		{
			console.log(Temp_Streams_List_View);
		} });
	}
}

/**
 * Add tweets from temp collection to original collection and remove
 * notification which shows new tweet with number.
 */
function mergeCollections(streamId)
{
	// Get stream from collections.
	var originalStream = Streams_List_View.collection.get(streamId);
	var tempStream = Temp_Streams_List_View.collection.get(streamId);

	// Get tweet collection from stream.
	var tweetCollection = originalStream.get('tweetListView');

	// Add new tweets from temp collection to original collection.
	tweetCollection.add(tempStream.get("tweetListView").toJSON());

	// Sort tweet collection on id. so recent tweet comes on top.
	tweetCollection.sort();

	// Create normal time.
	head.js('lib/jquery.timeago.js', function()
	{
		$(".time-ago", $(".chirp-container")).timeago();
	});

	// Clear temp tweet collection.
	tempStream.get("tweetListView").reset();

	// Remove waiting symbol.
	removeWaiting();
}

/**
 * Add given tweets in given stream model which is sub-collection.
 */
function updateCollection(tweet, modelStream)
{
	// Sort stream on tweet id basis which is unique and recent tweet has
	// highest value.
	modelStream.get('tweetListView').comparator = function(model)
	{
		if (model.get('id'))
			return -model.get('id');
	};

	// Add tweet to stream.
	modelStream.get('tweetListView').add(tweet);

	// Sort stream on id. so recent tweet comes on top.
	modelStream.get('tweetListView').sort();

	// Create normal time.
	head.js('lib/jquery.timeago.js', function()
	{
		$(".time-ago", $(".chirp-container")).timeago();
	});
}
