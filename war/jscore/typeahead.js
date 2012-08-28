$(function () {
 
    // Setup TypeAhead
    setupTypeAhead();
});



function setupTypeAhead(el)
{	
	 head.js('https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js', 'lib/jquery.taghandler.min.js',
       		function(){
		   		_setup(el);
	});
}

function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
            }
    }
}

function _setup(el)
{
	
	// Append to el of the model which is still not shown
	var selector = $('.agile-tag-handler');
	if(el)
		selector = $('.agile-tag-handler', el);
	
	// Agile Tag handler
	selector.each(function()
	{
		// Check if tag is already handled
		var tag_handled = $(this).attr('tag-handled');
		if(tag_handled)
			return;
		
		// Set the handled as true
		$(this).attr('tag-handled', 'true');
		
		// Get id, URL, prefill, allowAdd, max
		var id = $(this).attr('id');
		var url = $(this).attr('url');
		var initLoad = $(this).attr('initLoad');
		var allowAdd = $(this).attr('allowAdd');
		var max = $(this).attr('max');
		
		if(!max)
			max = 0;
	
		//console.log("Type ahead " + id + " " + url + " " + initLoad + " " + allowAdd + " " + max);
		
		$(this).tagHandler({
		    assignedTags: [ 'C', 'Perl', 'PHP' ],
		    availableTags: [ 'C', 'C++', 'C#', 'Java', 'Perl', 'PHP', 'Python' ],
		    autocomplete: true,
		    initLoad: (initLoad == 'true'),
		    allowAdd: (allowAdd == 'true'),
		    assignedTags: [],
		    getURL: url,
		    minChars: 2,
		    className: 'tagHandler'
		});

	});	
}