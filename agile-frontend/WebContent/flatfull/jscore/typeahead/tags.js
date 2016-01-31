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
var tagsTemplate;
var tagsCollectionView;
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
    		init_tags_collection();
    		return;
    	}
    
    TAGS = tagsCollection.models;
    
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
    		
    		if(!tag || (/^\s*$/).test(tag))
    			{
    				return;
    			}
    	
    		tag = tag.trim();
    	
    		// Saves the selected tag to the contact
    		if((this.$element).closest(".control-group").hasClass('save-tag')){
    			
    			var json = null;
    			
    			if(company_util.isCompany())
    				json = App_Companies.companyDetailView.model.toJSON();
    			else
    				json = App_Contacts.contactDetailView.model.toJSON();
    			
    			// Checks if tag already exists in contact
    			if($.inArray(tag, json.tags) >= 0)
    				return;

    			json.tagsWithTime.push({"tag" : tag});
    			
    			
    			saveEntity(json, 'core/api/contacts', function(data){
    				$("#addTagsForm").css("display", "none");
        		    $("#add-tags").css("display", "block");
        		    
    	     		// Get all existing tags of the contact to compare with the added tags
	       			var old_tags = [];
	       			$.each($('#added-tags-ul').children(), function(index, element){
       					
	       				old_tags.push($(element).attr('data'));
       				});
	       			
	       			if(company_util.isCompany()){
	       				App_Companies.companyDetailView.model.set(data.toJSON(), {silent : true});
	       			// Append to the list, when no match is found 
		       			if ($.inArray(tag, old_tags) == -1) 
		       				$('#added-tags-ul').append('<li class="tag btn btn-xs btn-default m-r-xs m-b-xs inline-block" data="' + tag + '"><span><a class="anchor m-r-xs" href="#tags/'+ tag + '" >'+ tag + '</a><a class="close remove-company-tags" id="' + tag + '" tag="'+tag+'">&times</a></span></li>');
	    				
	       			}
	       			else{
	       				App_Contacts.contactDetailView.model.set(data.toJSON(), {silent : true});
	       				addTagToTimelineDynamically(tag, data.get("tagsWithTime"));
	       			// Append to the list, when no match is found 
		       			if ($.inArray(tag, old_tags) == -1) 
		       				$('#added-tags-ul').append('<li class="tag btn btn-xs btn-default m-r-xs m-b-xs inline-block" data="' + tag + '"><span><a class="anchor m-r-xs" href="#tags/'+ tag + '" >'+ tag + '</a><a class="close remove-tags" id="' + tag + '" tag="'+tag+'">&times</a></span></li>');
	    				
	       			}
	       			
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
    			(this.$element).closest(".control-group").find('ul.tags').append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block"   data="'+ tag+'"><span class="m-r-xs v-middle">'+tag+'</span><a class="close" id="remove_tag">&times</a></li>');
        }
    });
    
    $('body').on('keydown', '#addTags', function(e) {
    	if(e.which == 13 && !isTagsTypeaheadActive)
    		{
    			e.preventDefault();
    			
    			var contact_json = App_Contacts.contactDetailView.model.toJSON();
    	
    			var tag = $(this).val().trim();
    			
    			if(!tag || tag.length<=0 || (/^\s*$/).test(tag))
    			{
    				return;
    			}

    			if (!isValidTag(tag, true)) {
    				return false;
    			}
    			$("#addTags").val("");
    			
    			tag = tag.trim();
    			
    			acl_util.canAddTag(tag,function(canAdd){
    				
    				if(!canAdd){
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
       			
        			contact_json.tagsWithTime.push({"tag" : tag});
        	    	
        			saveEntity(contact_json, 'core/api/contacts',  function(data) {
        				// Updates to both model and collection
        				App_Contacts.contactDetailView.model.set(data.toJSON(), {silent : true});
        				addTagToTimelineDynamically(tag, data.get("tagsWithTime"));
        				tagsCollection.add(new BaseModel( {"tag" : tag} ));
        			$("#addTagsForm").css("display", "none");
        		    $("#add-tags").css("display", "block");

           				$('#added-tags-ul').append('<li class="inline-block tag btn btn-xs btn-default m-r-xs m-b-xs" data="' + tag + '" ><span><a class="anchor m-r-xs" href="#tags/'+ tag + '">'+ tag + '</a><a class="close remove-tags" id="' + tag + '" tag="'+tag+'">&times</a></span></li>');
        			},function(model,response){
        				console.log(response);
    	       			alert(response.responseText);
        			});
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
    	
    	var tag = $(this).val().trim();
    	
    	if(!tag || tag.length<=0 || (/^\s*$/).test(tag))
		{
			return;
		}
    	
    	// To make a tag when "," keydown and check input is not empty
    	if(e.which == 188 && tag != "")
    	{
    		e.preventDefault();
    	
    		// Prevents comma (",") as an argument to the input field
    		$(this).val("");
    		
    		var tags_list=$(this).closest(".control-group").find('ul.tags');
    		var add_tag=true;
    		
    		// Iterate over already present tags, to check if this is a new tag
    		tags_list.find('li').each(function(index,elem){
    			
    			if(elem.getAttribute('data')==tag)
    			{
    				add_tag=false; // tag exists, don't add
    				return false;
    			}
    		});
    		
    		if(add_tag)
    			tags_list.append('<li class="tag btn btn-xs btn-primary m-r-xs m-b-xs inline-block"  data="'+ tag+'">'+tag+'<a class="close m-l-xs" id="remove_tag" tag="'+tag+'">&times</a></li>');
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
	
	if(!tagsCollection || !tagsCollectionView)
	{
		
		init_tags_collection(cel, function(el){
			$('#tagslist', cel).html(el);
		});
		return;
	}
	  $('#tagslist', cel).html(tagsCollectionView.render(true).el);
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

        if(!$(this).hasClass("custom_contact") && !$(this).hasClass("custom_company")) {
            $.each($(this).children(), function(index, data) { 
                values.push(($(data).attr("data")).toString())
            });
            return {
                "name" : $(this).attr('name'),
                "value":values
            };
        }
    }).get();
    
    // Reads input value from input field too.
    var input_filed = $("#" + form_id + " input.tags-typeahead");
    if(input_filed != null)
    {
    	var tag_input = $(input_filed).val();
    	
    	if(tag_input)
    		{
    			tag_input = tag_input.trim();
    			tags_json[0].value.push(tag_input);
    		//	input_filed.val("");
    		}
    }
    return tags_json;
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
function get_related_deals(form_id) {
    var tags_json = $('#' + form_id + ' .deal_tags').map(function () {
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

function init_tags_collection(cel, callback, url)
{
	url = url ? url : '/core/api/tags'
	tagsCollectionView = new Base_Collection_View({ 
			url : url, 
			sortKey: 'tag',
			templateKey : 'tags', 
		});
	
	tagsCollectionView.appendItem = append_tag;
	

	tagsCollection = tagsCollectionView.collection;
	
	tagsCollectionView.collection.fetch({success: function(data){
		  TAGS = tagsCollection.models
		  
		// Called to initiate typeahead to the fields with class attribute "tags_typeahead"
        setup_tags_typeahead();
		  
		if(callback && typeof (callback) === "function")
			callback(tagsCollectionView.render(true).el);		  
	}});
}

function append_tag(base_model)
{
	var tag = base_model.get('tag');
	var key = tag.charAt(0).toUpperCase();
	tag_encoded = encodeURIComponent(tag);
	$( 'div[tag-alphabet="'+encodeURI(key)+'"]', this.el).append('<a href="#tags/'+tag_encoded+'" id="'+tag_encoded.replace( / +/g, '' )+'-in-list">'+tag+'</a>&nbsp;');
}

function remove_tags(base_model)
{
	console.log("removed");	
}

function renameTags(newTag, oldTag)
{
    if(!tagsCollection || !tagsCollection.models)
        return;

    var models = tagsCollection.where({"tag" : oldTag});
    
    if(models && models.length)
    {
        var model = models[0];
        model.set({"tag" : newTag});    
    }

    
}

$(function(){

	$('body').on('click', '#refresh-tags', function(e){
		e.preventDefault();
		$('#tagslist', App_Contacts.contactsListView.el).html(getRandomLoadingImg());
		init_tags_collection(App_Contacts.contactsListView.el, function(tags){
			setup_tags(App_Contacts.contactsListView.el);
			pieTags(App_Contacts.contactsListView.el, true);
		}, 'core/api/tags?reload=true');
	})
	$('body').on('focusout', '.contact-detail-addtags', function(e)
	{
		e.preventDefault();
		var contact_tag_temp = $(this).val();
		$('body').on('mousedown', function(s)
		{
			s.preventDefault();
			var t = s.target.id;
			if (!contact_tag_temp && t != "contact-add-tags" && t != "addTags")
			{
				$("#addTagsForm").css("display", "none");
				$("#add-tags").css("display", "block");
			}
		});
	});
});
