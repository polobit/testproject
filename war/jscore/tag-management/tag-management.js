
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
					   "mouseout" : "hideActionButtons"

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
			return;
		}
	var r = confirm("Press a button!");
	if(r == false)
	{
		$("#tag-solid-state", this.el).show();
		$("#editing", this.el).hide();
		return;
		
	}
	
	this.model.url = 'core/api/tags/bulk/rename?tag=' + this.input.val()
	this.model.save();
	this.model.set('tag', this.input.val());
		
},
showActionButtons : function(e)
{
	e.preventDefault();
	$('#actions', this.el).show();
},
hideActionButtons : function(e)
{
	e.preventDefault();
	$('#actions', this.el).hide();
},
/*
 * On click on ".delete" model representing the view is deleted, and removed
 * from the collection
 */
deleteItem : function(e)
{
	e.preventDefault();
	this.model.url = "core/api/tags/bulk/delete?tag=" + this.model.get("tag");
	this.model.set({"id" : this.model.get('tag')})
	this.model.destroy();
}, edit : function(e)
{
	e.preventDefault();
	$("#tag-solid-state", this.el).hide();
	$("#editing", this.el).show();
	this.input.focus();
	this.input.val(this.model.get('tag'));
	
}, render : function(callback)
{
	$(this.el).html(getTemplate(this.options.template, this.model.toJSON()));
	$(this.el).data(this.model);
	this.input = $('.edit-input', this.el);
	// Add model as data to it's corresponding row

	return this;
} });

function tagManagementDeleteTag(e)
{
	alert("delete 12");
}

function append_tag_management(base_model) {
	
	var itemView = new TAG_MODEL_VIEW({
		model : base_model,
		"view" : "inline",
		template : this.options.templateKey + "-model",
		tagName : 'li',
	});
	
	console.log(itemView);
	itemView.deleteItem = tagManagementDeleteTag;
	
	
	
	$(this.model_list_element).append(itemView.render().el);
}
