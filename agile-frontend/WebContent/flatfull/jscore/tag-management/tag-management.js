/*
 * Creates an view object on the model, with events click on .delete, .edit,
 * .agile_delete and respective funtionalities are defined and binds to current
 * view.
 */
var TAG_MODEL_VIEW = Backbone.View
		.extend(
		{
			events : {
				"click .delete" : "deleteItem",
				"click .edit" : "edit",
				"delete-checked .agile_delete" : "deleteItem",
				"keypress .edit-input" : "renameTag",
				"blur .edit-input" : "updateTag",
				"mouseover" : "showActionButtons",
				"mouseout" : "hideActionButtons",
				'click .details' : "showDetails",
				"click #add-new-tag" : "addNewTag",

			},
			/*
			 * Binds events on the model
			 */
			initialize : function() {
				_.bindAll(this, 'render', 'deleteItem', 'edit'); // every
																	// function
				// that uses 'this'
				// as the current
				// object should be
				// in here
				this.model.bind("destroy", this.close, this);

				this.model.bind("change", this.render, this);
			},
			showDetails : function(e) {
				e.preventDefault();
				var _that = this;
				var details_el = $(".details", this.el);

				/**
				 * Checks for last 'tr' and change placement of popover to 'top'
				 * inorder to prevent scrolling on last row of list
				 */
				/*$(this.el).popover(
						{
							"rel" : "popover",
							"trigger" : "click",
							"popover-title" : "\""
									+ this.model.get('tag') + "\" Stats",
							"content" : LOADING_HTML,
							'show' : true,
							"html" : true,
							'data-container' : this.el
						// "data-container" : '.tag'
						});*/


				$.getJSON('core/api/tags/getstats/' + this.model.get('tag'),
						function(data) {
							_that.model.set('availableCount',
									data.availableCount);
							console.log(_that.model.toJSON());
							$(_that.el).find('.tag_tooltip').tooltip({
						        title: _that.model.get('availableCount')+ " Contacts",
						        placement : 'right'
						    }).on("mouseleave",function(){
						    	$(".tags-management #actions").hide();
						    });
						    
						    $(_that.el).find('.tag_tooltip').trigger("mouseover");
						    $(_that.el).find('.details').hide();
							/*$(_that.el).attr(
									'data-content',
									_that.model.get('availableCount')
											+ " Contacts");
							$(_that.el).popover('show');*/
						})
			},
			renameTag : function(e) {
				if (e.keyCode == 13) {
					$(e.currentTarget).blur();
				}
			},
			updateTag : function(e) {
				// console.log(this.input);

				if (this.model.get('tag') == this.input.val()) {
					$("#tag-solid-state", this.el).show();
					$("#editing", this.el).hide();
					$(this.el).addClass('tag');
					return;
				}
				if (!isValidTag(this.input.val(), true)) {
					this.input.val(this.model.get('tag')).focus();
					return;
				}

				var newTag = this.input.val().trim();
				var oldTag = this.model.get('tag');

				var r = false;
				var newTagObject = {};
				newTagObject.tag = newTag;
				var is_merge = isMergeTag(newTagObject);

				var message = "";
				if (is_merge)
					message = '<p>Tag "' + newTag
							+ '" exists already. Do you want to merge "'
							+ oldTag + '" and "' + newTag + '" ?</p>';
				else
					message = "<p>Rename tag \"" + oldTag + "\" to \"" + newTag
							+ "\" ?</p>";

				var _that = this;
				r = showModalConfirmation(
						'Tag Management Action',
						message,
						function() {
							_that.model.url = 'core/api/tags/bulk/rename?tag='
									+ newTag;

							_that.model
									.save(
											[],
											{
												success : function(data) {
													if (is_merge)
														showNotyPopUp(
																'information',
																"Merging tags \""
																		+ oldTag
																		+ "\" and \""
																		+ newTag
																		+ "\". This may take a while.  You may see the merged tag on some contacts cc",
																"top", 5000);
													else
														showNotyPopUp(
																'information',
																"Renaming tag \""
																		+ oldTag
																		+ "\" to \""
																		+ newTag
																		+ "\". This may take a while. You may see the renamed tag on some contacts while this happens",
																"top", 5000);

													renameTags(newTag, oldTag);
													App_Admin_Settings.tagManagement();
												}
											});

							if (is_merge) {
								_that.remove();
								return;
							}

							_that.model.set('tag', _that.input.val().trim());
							$(_that.el).addClass('tag');
							if(isValidTag(_that.input.val().trim(), false)) {
								$(_that.el).removeClass('error');
							}

						}, function() {
							_that.reset();
							return;
						}, function() {
							_that.reset();
							return;
						});

			},
			reset : function() {
				$("#tag-solid-state", this.el).show();
				$("#editing", this.el).hide();
				$(this.el).addClass('tag');
			},
			showActionButtons : function(e) {
				e.preventDefault();
				$('#actions', this.el).show();
				$("a", this.el).popover('toggle');
			},
			hideActionButtons : function(e) {
				e.preventDefault();
				$('#actions', this.el).hide();
				$(this.el).attr(
						{
							"data-trigger" : "click",
						})
				$(this.el).popover({"trigger" : "focus", 'hide': true});
			},
			addNewTag : function(e) {
				e.preventDefault();
				$("#add-new-tag", this.el).addClass("hide");
				$("#new_tag_field_block", this.el).removeClass("hide");
			},
			/*
			 * On click on ".delete" model representing the view is deleted, and
			 * removed from the collection
			 */
			deleteItem : function(e) {
				e.preventDefault();
				var _that = this;
				showModalConfirmation(
						'Tag Management',
						"<p>Delete \"" + this.model.get('tag') + "\" tag ?</p>",
						function() {
							_that.model.url = "core/api/tags/bulk/delete?tag="
									+ escape(_that.model.get('tag'));
							_that.model.set({
								"id" : _that.model.get('tag')
							});
							_that.model
									.destroy({
										success : function(model, respone) {
											showNotyPopUp(
													'information',
													"Deleting tag \""
															+ _that.model
																	.get('tag')
															+ "\".  You may see the deleted tag on some contacts while this happens",
													"top", 5000);
											App_Admin_Settings.tagManagement();
										}
									});
						});
			},
			edit : function(e) {
				e.preventDefault();

				$("#tag-solid-state", this.el).hide();
				$(this.el).removeClass('tag');
				$("#editing", this.el).show();
				addTagsDefaultTypeahead($("#editing", this.el));
				this.input.attr('width', '100%').focus();
				this.input.val(this.model.get('tag'));

			},
		render : function(callback) {
				$(this.el)
						.html(
								getTemplate(this.options.template, this.model
										.toJSON()));
				$(this.el).data(this.model);
				this.input = $('.edit-input', this.el);
				// Add model as data to it's corresponding row

				return this;
		
			}
		});

function append_tag_management(base_model) {

	var itemView = new TAG_MODEL_VIEW({
		model : base_model,
		"view" : "inline",
		template : this.options.templateKey + "-model",
		tagName : 'li',
	});

	console.log(itemView);

	var key = base_model.get('tag').charAt(0).toUpperCase();
	console.log($('div[tag-alphabet="' + encodeURI(key) + '"]', this.el))

	var el = itemView.render().el;
	$(el).addClass('tag bg-white').css("margin-top","10px");
	
	var tag_name = base_model.get('tag');
	if(!isValidTag(tag_name, false)) {
		$(el).addClass('error');
	}

	var element = $('div[tag-alphabet="' + encodeURI(key) + '"] ul', this.el);
	console.log(element.length);
	if (element.length > 0)
		$('div[tag-alphabet="' + encodeURI(key) + '"] ul', this.el).append(
				$(el));
	else {
		$(this.model_list_element).append("<div class='clearfix'></div>")
				.append($(el));
	}

	// $(this.model_list_element).append($(el));
}

function initializeTagManagementListeners(){


$('#admin-prefs-tabs-content').on('click', '#add-new-tag', function(e){
	e.preventDefault();

	toggleAddTag(true);
});

$('#admin-prefs-tabs-content').on('keydown', '#new_tag', function(event){
	console.log(event.which)

	if (event.which == 0) {
		blur_out_input_field(this);
		return;
	} else if (event.which != 13)
		return;
	saveTag(this);
});
}

function blur_out_input_field(element) {
	var value = $(element).val().trim();

	if (value == "") {
		toggleAddTag(false);
		return;
	}
	
	saveTag(element);
}

function toggleAddTag(show) {
	if (show) {
		$("#add-new-tag").hide();
		$("#new_tag_field_block").show();
		$("#add_new_tag").removeAttr('disabled');
		$("#new_tag").focus();
		console.log($("#add_new_tag").attr('disabled'));
		
		return;
	}
	$("#add-new-tag").show();
	$("#new_tag_field_block").hide();

}

/*
 * $("#new_tag").on('blur', function(event){
 * 
 * });
 */

$('body').on('click', '#add_new_tag', function(e){
	e.preventDefault();
	var newTag = $().val();

	blur_out_input_field("#new_tag");
});

function saveTag(field) {
	var fieldValue = $(field).val();

	if ($(field).attr('disabled'))
		return;

	if (!isValidTag(fieldValue, true)) {
		$(field).focus();
		return;
	}
	var existingTagObject = App_Admin_Settings.tagsview1.collection.where({tag:fieldValue.trim()});
	if(existingTagObject && existingTagObject.length > 0) {
		var message = "<p>Tag \"" + fieldValue.trim() + "\" exists already. Please choose a different name.</p>";

		var _that = this;
		r = showModalConfirmation(
				'Tag Management Action',
				message,
				function() {
					return;
				},function() {
					return;
				},function() {
					return;
				}, 'Ok');

		return;
	}

	var tagObject = {};
	tagObject.tag = fieldValue.trim();

	// Disables input field
	$(field).attr('disabled', 'disabled');

	var model = new BaseModel(tagObject);
	model.url = "core/api/tags";
	model.save([], {
		success : function(response) {
			$(field).val("");
			$(field).removeAttr('disabled');
			toggleAddTag(false);
			
			showNotyPopUp('information', "New tag \"" + model.get('tag')
					+ "\" created.", "top", 5000);

			// Adds tag to global connection
			if(tagsCollection && tagsCollection.models)
				tagsCollection.add(response.toJSON());
            App_Admin_Settings.tagManagement();
		
		}
	});
	console.log(App_Admin_Settings);
	App_Admin_Settings.tagsview1.collection.add(model);

}

function isValidTag(tag, showAlert) {
	
	var r = '\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC';
	var regexString = '^['+r+']['+r+' 0-9_-]*$';
	var is_valid = new RegExp(regexString).test(tag);
	if (showAlert && !is_valid)
		alert("Tag name should start with an alphabet and can not contain special characters other than underscore, space and hypen");
	return is_valid;
}

/**
 * Added tags typeahead on fields
 * 
 * @param element
 */
function addTagsDefaultTypeaheadTagManagement(element) {
	var tags_array = [];

	// 'TAGS' are saved in global variable when they are fetched to show stats
	// in contacts page. If it is undefined, tags are fetched from DB an then
	// type ahead is built
	if (!TAGS) {
		var TagsCollection = Backbone.Collection.extend({
			url : '/core/api/tags',
			sortKey : 'tag'
		});

		tagsCollection = new TagsCollection();

		tagsCollection
				.fetch({
					success : function(data) {
						TAGS = tagsCollection.models;
						addTagsArrayasTypeaheadSource(tagsCollection.toJSON(),
								element);

					}
				});
		return;
	}

	// Adds typeahead to given element
	addTagsArrayasTypeaheadSourceTagManagement(tagsCollection.toJSON(), element);
}

function isMergeTag(tag) {
	console.log(App_Admin_Settings.tagsview1.collection.where({
		"tag" : tag.tag
	}));
	return (App_Admin_Settings.tagsview1.collection.where({
		"tag" : tag.tag
	}).length > 0);
}

// With tags JSON sent type ahead is built on input fields
function addTagsArrayasTypeaheadSource(tagsJSON, element) {
	var tags_array = [];

	$.each(tagsJSON, function(index, element) {
		tags_array.push(element.tag.toString());
	});

	// $("input", element).attr("data-provide","typeahead");
	$("input", element).typeahead({
		"source" : tags_array
	}).attr('placeholder', "Enter Tag");
}

function showModalConfirmation(title, body, yes_callback, no_callback,
		close_callback, yes_button_text, no_button_text) {
	if(!yes_button_text && !no_button_text)
	{
		yes_button_text = "Yes";
		no_button_text = "No";
	}
	var yes_action = "";
	var no_action = "";
	if(yes_button_text)
		yes_action = '<a href="#" id="confirm" class="action btn btn-primary" action="confirm">'+yes_button_text+'</a>';
	if(no_button_text)
		no_action = '<a  href="#" id="deny" class="btn btn-danger action" data-dismiss="modal" action="deny">'+no_button_text+'</a>';
		
	var confirmationModal = $('<div id="confirmation" class="modal fade in">'
			+ '<div class="modal-dialog">'
			+ '<div class="modal-content">'
			+ '<div class="modal-header" >'
			+ '<a href="#" data-dismiss="modal" class="close">&times;</a>'
			+ '<h3>'
			+ title
			+ '</h3></div>'
			+ '<div class="modal-body">'
			+ body
			+ '</div>'
			+ '<div class="modal-footer">'
			+ '<div>'
			+ no_action
			+ yes_action
			+ '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>');

	confirmationModal.modal('show');
	confirmationModal.focus();

	confirmationModal.on('hidden.bs.modal', function(e) {
		if (close_callback && typeof close_callback == "function")
			close_callback();

	});

	$(".action", confirmationModal).click(
			function(e) {
				e.preventDefault();
				var action = $(this).attr('action');

				confirmationModal.modal('hide');

				if (action == "confirm" && yes_callback
						&& typeof yes_callback == "function") {
					yes_callback();
					return;
				}

				if (no_callback && typeof no_callback == "function")
					no_callback(this);

			})

}