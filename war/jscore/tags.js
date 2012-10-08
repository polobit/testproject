var TAGS;
function setupTagsTypeAhead(models) {
    var tags = [];

    if(!TAGS.length)
    	{
    		var TagsCollection = Backbone.Collection.extend({
    			url: '/core/api/tags',
    			sortKey: 'tag'
    		});
    		
    		var tagsCollection = new TagsCollection();
    		
    		tagsCollection.fetch({success:function(data){
    			TAGS = tagsCollection.models;
    			setupTagsTypeAhead(tagsCollection.models);
    		}});
    		return;
    	}
    else
    	models = TAGS;
    
    // Iterate
    _(models).each(function (item) { // in case collection is not empty
        var tag = item.get("tag");
        if ($.inArray(tag, tags) == -1) tags.push(tag);
    });

    var el = $('<ul name="tags" class= "tagsinput tags" style="dispaly:inline"></ul>');

    
    $('.tags-typeahead').typeahead({
        source: tags,
        updater: function(tag) {
        	console.log(this.$element);
        	console.log(tag);
        	// If tag is undefined create new tag with input value
        	if(!tag)	
        		{
        			tag = $('.tags-typeahead').val();
        			console.log(tag);
        		}
      
        	(this.$element).closest(".control-group").find('ul.tags').append('<li class="tag"  style="display: inline-block;" data="'+ tag+'">'+tag+'<a class="close" id="remove_tag">&times</a></li>');
        }
    });
    
    // If entered tag is not in typeahead source create a new tag
    $(".tags-typeahead").bind("keydown", function(e){

    	var tag = $(this).val();
    	
    	// To make a tag when "," keydown and check input is not empty
    	if(e.which == 188 && tag != "")
    	{
    		console.log($(this).val());
    		$(this).attr("value","");
    		$(this).closest(".control-group").find('ul.tags').append('<li class="tag"  style="display: inline-block;" data="'+ tag+'">'+tag+'<a class="close" id="remove_tag">&times</a></li>');
    	}
    	console.log($(this).val());
    });
}

function setupTags(cel) {
    // Add Tags
    var TagsCollection = Backbone.Collection.extend({
        url: '/core/api/tags',
        sortKey: 'tag'
    });
    var tagsCollection = new TagsCollection();
    tagsCollection.fetch({
        success: function () {
            var tagsHTML = getTemplate('tagslist', tagsCollection.toJSON());
            var len = $('#tagslist', cel).length;
            $('#tagslist', cel).html(tagsHTML);

            TAGS = tagsCollection.models
            setupTagsTypeAhead(TAGS);
        }
    });

}
/*
function getTags(id) {

    // Add Tags
    if (isValidField(id)) {
        var tags = $('#' + id).val();
        
        // Replace multiple space with single space
        tags =  tags.replace(/ +(?= )/g,'');

        // Replace ,space with space
        tags = tags.replace(", ", " ");

        // Replace , with spaces
        tags = tags.replace(",", " ");

        return tags.split(" ");
    }
}
*/
    function getTags(form_id) {
    	var tags_json = $('#' + form_id + ' .tags').map(
       		 function () {
       			 var values = [];
       			 
       			 if(!isArray($(this).children()));
       			 	
       			 $.each($(this).children(), function(index, data) { 
       				 values.push(($(data).attr("data")).toString())
    	            	
    	            });
       			 
           	     return {
           	            "name" : $(this).attr('name'),
           	            "value":values
           	        };
           	    }).get(); 
    console.log(tags_json);
    return tags_json;
    }
