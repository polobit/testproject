
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
					   'click .details ' : "showDetails",
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
	$.getJSON('core/api/tags/getstats/' + this.model.get('tag'), function(data){
		_that.model.set('availableCount', data.availableCount);
		console.log(_that.model.toJSON());
	})
},
renameTag : function (e)
{
	 if (e.keyCode == 13) this.updateTag();
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
	
	var newTag = this.input.val();
	var oldTag = this.model.get('tag');
	
	var r = confirm("You are about to rename tag \"" + oldTag +"\" to \""+ newTag +"\"");
	if(r == false)
	{
		$("#tag-solid-state", this.el).show();
		$("#editing", this.el).hide();
		$(this.el).addClass('tag');
		return;
		
	}
	
	this.model.url = 'core/api/tags/bulk/rename?tag=' + newTag;
	
	this.model.save([], {success: function(data)
		{
			showNotyPopUp('information', "Renaming tag \""+ oldTag +"\" to \""+ data.get('tag') +"\"", "top", 5000);
		}
	});
	this.model.set('tag', this.input.val().trim());
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
},
addNewTag : function(e)
{
	e.preventDefault();
	alert("new tag");
	$("#new_tag_field_block", this.el).show();
},
/*
 * On click on ".delete" model representing the view is deleted, and removed
 * from the collection
 */
deleteItem : function(e)
{
	e.preventDefault();
	var r = confirm("You are about to delete \""+ this.model.get('tag') + "\" tag");
	if(r == false)
	{
		return;
	}
	
	this.model.url = "core/api/tags/bulk/delete?tag=" + this.model.get("tag");
	this.model.set({"id" : this.model.get('tag')})
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
	$(el).addClass('tag').attr('count', base_model.get('availableCount')).css('width', '200px').css('float' , 'left').css('margin', '0px 10px 15px 10px').css('background', 'gray');
	
	var element = $( 'div[tag-alphabet="'+encodeURI(key)+'"] ul', this.el); 
	console.log(element.length);
	if(element.length > 0)
		$( 'div[tag-alphabet="'+encodeURI(key)+'"] ul', this.el).append($(el));
	else
		$(this.model_list_element).append("<div class='clearfix'></div>").append($(el));

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

	var value = $(this).val();
	
	var tag = {};
	tag.tag = value;
	
	var model =  new BaseModel(tag);
	model.url = "core/api/tags";
	model.save();
	console.log(App_Admin_Settings);
	App_Admin_Settings.tagsview1.collection.add(model);
	$(this).val("");
	$(this).hide();
	
	
});