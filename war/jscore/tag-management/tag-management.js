
/*
 * Creates an view object on the model, with events click on .delete, .edit,
 * .agile_delete and respective funtionalities are defined and binds to current
 * view.
 */
var TAG_MODEL_VIEW = Backbone.View.extend(
		
		{ 
			events : { "click .delete" : "deleteItem", 
					   "click .edit" : "edit", 
					   "delete-checked .agile_delete" : "deleteItem",
					   "keypress .edit-input" : "renameTag",
					  "blur .edit-input"      : "updateTag",
					   "mouseover" : "showActionButtons",
					   "mouseout" : "hideActionButtons",
					   'click .details' : "showDetails",
					   "click #add-new-tag" : "addNewTag",
					   
						   

},
/*
 * Binds events on the model
 */
initialize : function()
{
	_.bindAll(this, 'render', 'deleteItem', 'edit'); // every function
	// that uses 'this'
	// as the current
	// object should be
	// in here
	this.model.bind("destroy", this.close, this);

	this.model.bind("change", this.render, this);
},
showDetails : function(e)
{
	e.preventDefault();
	var _that = this;
	var details_el = $(".details", this.el);
	
	
    /**
     * Checks for last 'tr' and change placement of popover to 'top' inorder
     * to prevent scrolling on last row of list
     **/
    $(this.el).attr({
    	"rel" : "popover",
    	"data-original-title" : "\"" + this.model.get('tag') + "\" Stats",
    	"data-content" :  LOADING_HTML,
    	//"data-container" : '.tag'
    });
    
    $(this.el).popover({'show' : true, 'data-container' : this.el});
	
	$.getJSON('core/api/tags/getstats/' + this.model.get('tag'), function(data){
		_that.model.set('availableCount', data.availableCount);
		console.log(_that.model.toJSON());
		$(_that.el).attr('data-content', _that.model.get('availableCount') + " Contacts");
		$(_that.el).popover('show');
	})
},
renameTag : function (e)
{
	 if (e.keyCode == 13) 
		{
		 	this.updateTag();
		}
},
updateTag : function(e)
{
	
	
	if(this.model.get('tag') == this.input.val())
		{
			$("#tag-solid-state", this.el).show();
			$("#editing", this.el).hide();
			$(this.el).addClass('tag');
			return;
		}
	if(!isValidTag(this.input.val(), true))
	{
		this.input.val(this.model.get('tag')).focus();
 		return;
	}
	
	var newTag = this.input.val().trim();
	var oldTag = this.model.get('tag');
	
	
	var r = false;
	var is_merge = isMergeTag(this.model.toJSON()); 
	
	if(is_merge)
		r = confirm('Tag "' +newTag+ '" exists already. Do you want to merge "' + oldTag +'" and "' + newTag + '" ?');
	else
		r = confirm("Rename tag \"" + oldTag +"\" to \""+ newTag +"\" ?");
	if(r == false)
	{
		this.reset();
		return;
	}
	
	this.model.url = 'core/api/tags/bulk/rename?tag=' + newTag;
	
	this.model.save([], {success: function(data)
		{
			if(is_merge)
				showNotyPopUp('information', "Merging tags \""+ oldTag +"\" and \""+ newTag +"\"", "top", 5000);
			else
			showNotyPopUp('information', "Renaming tag \""+ oldTag +"\" to \""+ newTag +"\". This may take a while. You may see the delete/renamed tag on some contacts while this happens", "top", 5000);
		}
	});
	
	if(is_merge)
	{
		this.remove();
		return;
	}
	this.model.set('tag', this.input.val().trim());
	$(this.el).addClass('tag');
		
},
reset : function()
{
	$("#tag-solid-state", this.el).show();
	$("#editing", this.el).hide();
	$(this.el).addClass('tag');
},
showActionButtons : function(e)
{
	e.preventDefault();
	$('#actions', this.el).show();
	$("a", this.el).popover('toggle');
},
hideActionButtons : function(e)
{
	e.preventDefault();
	$('#actions', this.el).hide();
	$(this.el).popover('hide');
},
addNewTag : function(e)
{
	e.preventDefault();
	$("#new_tag_field_block", this.el).show();
},
/*
 * On click on ".delete" model representing the view is deleted, and removed
 * from the collection
 */
deleteItem : function(e)
{
	e.preventDefault();
	var r = confirm("Delete \""+ this.model.get('tag') + "\" tag ?");
	if(r == false)
	{
		return;
	}
	
	this.model.url = "core/api/tags/bulk/delete?tag=" + escape(this.model.get('tag'));
	this.model.set({"id" : this.model.get('tag')});
	console.log(this.model.toJSON())
	this.model.destroy();
}, edit : function(e)
{
	e.preventDefault();
	
	$("#tag-solid-state", this.el).hide();
	$(this.el).removeClass('tag');
	$("#editing", this.el).show();
	addTagsDefaultTypeahead($("#editing", this.el));
	this.input.attr('width','100%').focus();
	this.input.val(this.model.get('tag'));
	
	
}, render : function(callback)
{
	$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
	$(this.el).data(this.model);
	this.input = $('.edit-input', this.el);
	// Add model as data to it's corresponding row

	return this;
} });


function append_tag_management(base_model) {
	
	var itemView = new TAG_MODEL_VIEW({
		model : base_model,
		"view" : "inline",
		template : this.options.templateKey + "-model",
		tagName : 'li',
	});
	
	console.log(itemView);
	
	var key = base_model.get('tag').charAt(0).toUpperCase();
	console.log($('div[tag-alphabet="'+encodeURI(key)+'"]', this.el))

		var el = itemView.render().el;
	$(el).addClass('tag');
	
	var element = $( 'div[tag-alphabet="'+encodeURI(key)+'"] ul', this.el); 
	console.log(element.length);
	if(element.length > 0)
		$( 'div[tag-alphabet="'+encodeURI(key)+'"] ul', this.el).append($(el));
	else
		{
			$(this.model_list_element).append("<div class='clearfix'></div>").append($(el));
		}

	//$(this.model_list_element).append($(el));
}

$("#add-new-tag").die().live('click', function(e){
	e.preventDefault();
	$("#new_tag_field_block").show();
	$("#new_tag").focus();
});

$("#new_tag").die().live('keydown', function(event){
	if(event.which != 13)
		return;

	saveTag(this);
});


$("#add_new_tag").die().live('click', function(e){
	e.preventDefault();
	var newTag = $().val();
	
	saveTag("#new_tag");
});

function saveTag(field)
{
	var fieldValue = $(field).val();
	
	if(!isValidTag(fieldValue, true))
	{
		$(field).focus();
		return;
	}
	
		
	var tagObject = {};
	tagObject.tag = fieldValue.trim();
	
	
	
	// Disables input field
	$(field).attr('disabled');
	$("#add_new_tag").attr('disabled');
	
	var model =  new BaseModel(tagObject);
	model.url = "core/api/tags";
	model.save([], {success: function(response){
		$(field).val("");
		$(field).removeAttr('disabled');
		$("#add_new_tag").removeAttr('disabled');
		showNotyPopUp('information', "New tag \"" + model.get('tag') + "\" added. </br> This amy take a while. You may see the delete/renamed tag on some contacts while this happens", "top", 5000);
		
	}});
	console.log(App_Admin_Settings);
	App_Admin_Settings.tagsview1.collection.add(model);
	
}

function isValidTag(tag, showAlert)
{
	var is_valid = (/^[A-Za-z][A-Za-z0-9_ :-]*$/).test(tag); 
	if(showAlert && !is_valid)
		alert("Tag name should start with an alphabet and can not contain special characters other than hyphen, underscore, colon and space");
	return is_valid;
}



/**
 * Added tags typeahead on fields
 * 
 * @param element
 */
function addTagsDefaultTypeaheadTagManagement(element)
{
	var tags_array = [];

	// 'TAGS' are saved in global variable when they are fetched to show stats
	// in contacts page. If it is undefined, tags are fetched from DB an then type ahead is built
	if (!TAGS)
	{
		var TagsCollection = Backbone.Collection.extend({ url : '/core/api/tags', sortKey : 'tag' });

		tagsCollection = new TagsCollection();

		tagsCollection.fetch({ success : function(data)
		{
			TAGS = tagsCollection.models;
			addTagsArrayasTypeaheadSource(tagsCollection.toJSON(), element);

		} });
		return;
	}
	

	// Adds typeahead to given element
	addTagsArrayasTypeaheadSourceTagManagement(tagsCollection.toJSON(), element);
}

function isMergeTag(tag)
{
	return (App_Admin_Settings.tagsview1.collection.where({"tag" : tag.tag}).length > 0);
}

// With tags JSON sent type ahead is built on input fields
function addTagsArrayasTypeaheadSource(tagsJSON, element)
{
	var tags_array = [];

	$.each(tagsJSON, function(index, element)
	{
		tags_array.push(element.tag.toString());
	});

	// $("input", element).attr("data-provide","typeahead");
	$("input", element).typeahead({ "source" : tags_array }).attr('placeholder', "Enter Tag");
}
