/**
 * TAGS and tagsCollection are taken as global variables.
 * 
 * TAGS --> Stores models of tagsCollection (to avoid fetching the data from server side, 
 * 			every time the tags typeahead is called)
 * tagsCollection --> To show up the added tags in tags view, by adding to this collection 
 */
var TAGS;
var tagsCollection;
var isTagsTypeaheadActive;
/**
 * Creates a list (tags_list) only with tag values (i.e excludes the keys), 
 * by fetching the tags from server side, if they do not exist at client side (in TAGS). 
 * 
 * This tags_list is used as source for the typeahead, to show the matched items 
 * as drop down list, when a key is entered in the input box of typeahead 
 * 
 * @method setup_tags_typeahead
 * 
 */
function setup_tags_typeahead() {
	var tags_list = [];

	// Fetches tags collection, if no tags are exist (in TAGS) 
    if(!TAGS)
    	{
    		
    		var TagsCollection = Backbone.Collection.extend({
    			url: '/core/api/tags',
    			sortKey: 'tag'
    		});
    		
    		tagsCollection = new TagsCollection();
    		
    		tagsCollection.fetch({success:function(data){
    			TAGS = tagsCollection.models;
    			setup_tags_typeahead();
    		}});
    		return;
    	}
    
    // Iterate TAGS to create tags_list (only with tag values)   
    _(TAGS).each(function (item) { 
        var tag = item.get("tag");
        if ($.inArray(tag, tags_list) == -1) tags_list.push(tag);
    });

    if(!$('.tags-typeahead').attr('placeholder'))
    	$('.tags-typeahead').attr("placeholder", "Separate tags with commas");
    
    // Turn off browser default auto complete
    $('.tags-typeahead').attr("autocomplete","off");
 
    /**
     * typeahead is activated to the input field, having the class "tags-typeahead" 
     */
    $('.tags-typeahead').typeahead({
        
    	/**
    	 * Shows a drop down list of matched elements to the key, entered in the 
    	 * input field (having the class "tags-typeahead") from the list of elements
    	 * (tags_list) passed to the source method of typeahead
    	 */
    	source: function (query, process)
    	{
    		isTagsTypeaheadActive = false;
    		(this.$menu).empty();
    		
    		process(tags_list);
    		
    		if(this.$menu.find('.active').length > 0)
    			isTagsTypeaheadActive = true;
    	},
    	/**
    	 * Performs its operation (adds the tag as an li element to its nearest ul) on selecting 
    	 * a tag from the list of matched items provided by the source method   
    	 */
    	updater: function(tag) {
    		console.log(tag);
    		if(!tag || (/^\s*$/).test(tag))
    			{
    				return;
    			}
    	
    	
    		// Saves the selected tag to the contact
    		if((this.$element).closest(".control-group").hasClass('save-tag')){
    			
    			var json = App_Contacts.contactDetailView.model.toJSON();
    			
    			// Checks if tag already exists in contact
    			if($.inArray(tag, json.tags) >= 0)
    				return;
    			
    			json.tags.push(tag);
    			
    			saveEntity(json, 'core/api/contacts', function(data){
    				$("#addTagsForm").css("display", "none");
        		    $("#add-tags").css("display", "block");
        		    
    	     		// Get all existing tags of the contact to compare with the added tags
	       			var old_tags = [];
	       			$.each($('#added-tags-ul').children(), function(index, element){
       					
	       				old_tags.push($(element).attr('data'));
       				});
	       			
	       			// Append to the list, when no match is found 
	       			if ($.inArray(tag, old_tags) == -1) 
	       				$('#added-tags-ul').append('<li style="display:inline-block;" class="tag" data="' + tag + '"><span><a class="anchor" href="#tags/'+ tag + '">'+ tag + '</a><a class="close remove-tags" id="' + tag + '">&times</a></span></li>');
    				
    			});
    	        return;
    		}
    		
    		// To store existing tags in form.
    		var tags_temp = [];
    		
    	    // If tag already exists returns
            $.each((this.$element).closest(".control-group").find('ul.tags').children('li'), function (index, tag){
            	tags_temp.push($(tag).attr('data'));
            });

            // If tag is not added already, then add new tag.
    		if($.inArray(tag, tags_temp) == -1)
    			(this.$element).closest(".control-group").find('ul.tags').append('<li class="tag"  style="display: inline-block;" data="'+ tag+'">'+tag+'<a class="close" id="remove_tag">&times</a></li>');
        }
    });
    
    
    $("#addTags").bind("keydown",  function(e) {
    	if(e.which == 13 && !isTagsTypeaheadActive)
    		{
    			e.preventDefault();

    			var contact_json = App_Contacts.contactDetailView.model.toJSON();
    	
    			var tag = $(this).val();
    			
    			contact_json.tags.push(tag);
    	
    			$("#addTags").val("");
    	
    			if(!tag || (/^\s*$/).test(tag))
    			{
    					return;
    			}
    	    	
    			// Get all existing tags of the contact to compare with the added tags
    			var old_tags = [];
    			$.each($('#added-tags-ul').children(), function(index, element){
				
    				old_tags.push($(element).attr('data'));
    			});
			
    			// Append to the list, when no match is found 
    			if ($.inArray(tag, old_tags) != -1) 
    				return;
   			
    			saveEntity(contact_json, 'core/api/contacts',  function(data) {
    				tagsCollection.add( {"tag" : tag} );
    			$("#addTagsForm").css("display", "none");
    		    $("#add-tags").css("display", "block");

       				$('#added-tags-ul').append('<li style="display:inline-block;" class="tag" data="' + tag + '"><span><a class="anchor" href="#tags/'+ tag + '">'+ tag + '</a><a class="close remove-tags" id="' + tag + '">&times</a></span></li>');
    			});
    		}
    });
    
    
    /**
     * If entered tag is not in typeahead source, create a new tag (enter "," at the end of new tag 
     * element, then it could be added as new tag)
     */
    $(".tags-typeahead").bind("keydown", function(e){
    	
    	// Adds no tags when the key down is "," in contact detail view tags 
    	if($(this).hasClass('ignore-comma-keydown'))
    	  return;
    	
    	var tag = $(this).val();
    	
    	// To make a tag when "," keydown and check input is not empty
    	if(e.which == 188 && tag != "")
    	{
    		e.preventDefault();
    		alert("test");
    	
    		// Prevents comma (",") as an argument to the input field
    		$(this).val("");
    		$(this).closest(".control-group").find('ul.tags').append('<li class="tag"  style="display: inline-block;" data="'+ tag+'">'+tag+'<a class="close" id="remove_tag">&times</a></li>');
    	}
    });
}

/**
 * Fetches the tags collection from server side and shows them in their 
 * separate section along  with contacts list.
 * Called from contacts router and customView router.
 * 
 * @method setup_tags
 * @param {Object} cel 
 * 			contacts list view page as html object
 */
function setup_tags(cel) {
    // Add Tags
    var TagsCollection = Backbone.Collection.extend({
        url: '/core/api/tags',
        sortKey: 'tag'
    });
    tagsCollection = new TagsCollection();
    tagsCollection.fetch({
        success: function () {
            var tagsHTML = getTemplate('tagslist', tagsCollection.toJSON());
            var len = $('#tagslist', cel).length;
            $('#tagslist', cel).html(tagsHTML);

            TAGS = tagsCollection.models
           
            // Called to initiate typeahead to the fields with class attribute "tags_typeahead"
            setup_tags_typeahead();
        }
    });

}

/**
 * Reads the tag values from the elements having class "tags" and maps 
 * them as a json object to return.
 * 
 * @method get_tags
 * @param {String} form_id 
 * 			to read tags from the form
 * @returns json object of tags
 */
function get_tags(form_id) {
    var tags_json = $('#' + form_id + ' .tags').map(function () {
       	var values = [];

       	$.each($(this).children(), function(index, data) { 
       		values.push(($(data).attr("data")).toString())
    	});
        return {
        	"name" : $(this).attr('name'),
           	"value":values
        };
    }).get();
    
    return tags_json;
}

/**
 * Reads the values of a input field and splits based on comma
 * @param id
 * @returns
 */
function get_new_tags(id){
    // Add Tags
    if (isValidField(id)) {
        var tags = $('#' + id).val();
        
        // Replace multiple space with single space
        tags =  tags.replace(/ +(?= )/g,'');

        
        // Replace ,space with space
        tags = tags.replace(", ", " ");

        // Replace , with spaces
        tags = tags.replace(",", " ");

        return tags;
//        return tags.split(" ");
    }
}
