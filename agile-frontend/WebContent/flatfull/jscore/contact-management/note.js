/**
 * note.js script file defines the functionality of saving a note in Note
 * database. If note is related to a contact, which is in contact detail view
 * then the note model is inserted into time-line.
 * 
 * @module Contact management
 * @author Rammohan
 */
 var Agile_Old_Hash;
$(function()
{

	
	$(window).on("hashchange", function(e){
		var oldUrl = e.originalEvent.oldURL;
		if(!oldUrl){
			 return;
		}
		Agile_Old_Hash = oldUrl.split("#")[1];
	});

	$('body').on('click', '.edit-note', function(e)
	{
		e.preventDefault();
		console.log($(this).attr('data'));
		var note = notesView.collection.get($(this).attr('data'));
		console.log(note);

		// Clone modal, so we dont have to create a update modal.
		// we can clone add change ids and use it as different modal

		$('#noteUpdateModal').remove();

		var noteModal = $("#noteModal").clone();

		$("#noteForm > fieldset", noteModal).prepend('<input name="id" type="hidden"/>');
		$("#noteForm > fieldset", noteModal).prepend('<input name="created_time" type="hidden"/>');
		$("#noteForm", noteModal).parent().parent().find(".modal-header > h3").html('<i class="icon-edit"></i>&nbsp;' + _agile_get_translated_val('modals','edit-note'));
		$("#noteForm", noteModal).attr('id', "noteUpdateForm");
		noteModal.attr('id', "noteUpdateModal");
		agile_type_ahead("note_related_to", $("#noteUpdateForm", noteModal), contacts_typeahead);
		$("#note_validate", noteModal).attr("id", "note_update");
		deserializeForm(note.toJSON(), $("#noteUpdateForm", noteModal));

		noteModal.modal('show');
		// noteModal.modal('show');
	});

    $('body').on('click', '#note_update', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;

		// Disables save button to prevent multiple click event issues
		disable_save_button($(this));//$(this).attr('disabled', 'disabled');

		if (!isValidForm('#noteUpdateForm'))
		{

			// Removes disabled attribute of save button
			enable_save_button($(this));
			return;
		}
		if($("#noteUpdateForm #note_relatedto_tag").children().length==0)
		{
			$("#noteUpdateForm #note_relatedto_error").show().delay(5000).hide(1);
			enable_save_button($(this));
			return;
		}

		// Shows loading symbol until model get saved
		//$('#noteUpdateModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("noteUpdateForm");
		
		
/*		if(json.id)
			{
				if(notesView && notesView.collection && notesView.collection.get(json.id))
					{
						notesView.collection.get(json.id).set(json, {silent:true});
					}
			}*/

		saveNote($("#noteUpdateForm"), $("#noteUpdateModal"), this, json);
	});
	/**
	 * Saves note model using "Bcakbone.Model" object, and adds saved data to
	 * time-line if necessary.
	 */
	$('body').on('click', '#note_validate', function(e)
	{
		e.preventDefault();

		// Returns, if the save button has disabled attribute
		if ($(this).attr('disabled'))
			return;
		
		if (!isValidForm('#noteForm'))
		{
			return;
		}
		if($("#noteForm #note_relatedto_tag").children().length==0)
		{
			$("#noteForm #note_relatedto_error").show().delay(5000).hide(1);
			return;
		}
		disable_save_button($(this));
			
		// Shows loading symbol until model get saved
		//$('#noteModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("noteForm");

		console.log(json.from_task);
		
		if(json.from_task == "true")
			saveNoteOfTask($("#noteForm"), $("#noteModal"), this, json);
		else		
		    saveNote($("#noteForm"), $("#noteModal"), this, json);
	});

	/**
	 * Shows note modal and activates contacts typeahead to its related to field
	 */
	$('body').on('click', '#show-note', function(e)
	{
		e.preventDefault();
		showNoteModel();
		var el = $("#noteForm");
		agile_type_ahead("note_related_to", el, contacts_typeahead);
	});
	//when click on emailbutton automatically it takes contact details

	

	/**
	 * "Hide" event of note modal to remove contacts appended to related to
	 * field and validation errors
	 */
	$('#noteModal').on('hidden.bs.modal', function()
	{
		// Removes appended contacts from related-to field
		$("#noteForm").find("li").remove();

		$("#noteForm", $('#noteModal')).each(function()
		{
			this.reset();
		});
		
		// Removes validation error messages
		remove_validation_errors('noteModal');
	});

	function saveNote(form, modal, element, note)
	{

		console.log(note);
		var noteModel = new Backbone.Model();
		noteModel.url = 'core/api/notes';
		noteModel.save(note, { success : function(data)
		{

			// Removes disabled attribute of save button
			enable_save_button($(element));//$(element).removeAttr('disabled');

			form.each(function()
			{
				this.reset();
			});

			// Removes loading symbol and hides the modal
			//modal.find('span.save-status img').remove();
			$("#newNoteModal").modal('hide');
			modal.modal("hide");
			var note = data.toJSON();

			console.log(note);
			// Add model to collection. Disabled sort while adding and called
			// sort explicitly, as sort is not working when it is called by add
			// function
			if (notesView && notesView.collection)
			{
			console.log(notesView.collection.toJSON());
				if(notesView.collection.get(note.id))
				{
					notesView.collection.get(note.id).set(new BaseModel(note));
				}
				else
				{
					notesView.collection.add(new BaseModel(note), { sort : false });
					notesView.collection.sort();
				}
			}
			/*
			 * Updates data (saved note) to time-line, when contact detail view
			 * is defined and the note is related to the contact which is in
			 * detail view.
			 */
			if (App_Contacts.contactDetailView && Current_Route == "contact/" + App_Contacts.contactDetailView.model.get('id'))
			{
				var can_edit = false;
				if(notesView && notesView.collection && note.contacts && note.contacts.length == 0)
				{
					notesView.collection.remove(note.id);
					notesView.collection.sort();
				}
				$.each(note.contacts, function(index, contact)
				{
					if (contact.id == App_Contacts.contactDetailView.model.get('id'))
					{

						// Activates "Timeline" tab and its tab content in
						// contact detail view
						// activate_timeline_tab();
						add_entity_to_timeline(data);
						can_edit = true;
						/*
						 * If timeline is not defined yet, initiates with the
						 * data else inserts
						 */
						return false;
					}

				});
				if(!can_edit)
				{
					notesView.collection.remove(note.id);
					notesView.collection.sort();
				}
			}
		},
		error : function(data, response){
			if(response && response.status == 403)
			{
				enable_save_button($(element));
				$('span.save-status', modal).html("<i style='color:#B94A48;'>"+Handlebars.compile('{{name}}')({name : response.responseText})+"</i>");
				setTimeout(function()
				{
					$('span.save-status', modal).html('');
				}, 4000);
			}
		} });
	}

	function disableBtnAndSaveNote(that)
	{
		disable_save_button($(that));
			
		// Shows loading symbol until model get saved
		//$('#noteModal').find('span.save-status').html(getRandomLoadingImg());

		var json = serializeForm("noteForm");

		console.log(json.from_task);
		
		if(json.from_task == "true")
			saveNoteOfTask($("#noteForm"), $("#noteModal"), that, json);
		else		
		    saveNote($("#noteForm"), $("#noteModal"), that, json);
	}
});
