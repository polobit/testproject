$(".deal-edit-note").die().live('click', function(e)
	{
		e.preventDefault();
		console.log($(this).attr('data'));
		var note = dealNotesView.collection.get($(this).attr('data'));
		console.log(note);
		deserializeForm(note.toJSON(), $("#dealnoteUpdateForm",  $('#dealnoteupdatemodal')));
		fill_relation_deal($('#dealnoteUpdateForm'));
		agile_type_ahead("notes_related_to", $("#dealnoteUpdateForm"), deals_typeahead, false, "", "", "core/api/search/deals", false, true);
		$('#dealnoteupdatemodal').modal('show');
	});


    $("#dealnote_update").live('click', function(e)
		{
			e.preventDefault();

			// Returns, if the save button has disabled attribute
			if ($(this).attr('disabled'))
				return;

			// Disables save button to prevent multiple click event issues
			disable_save_button($(this));//$(this).attr('disabled', 'disabled');

			if (!isValidForm('#dealnoteUpdateForm'))
			{

				// Removes disabled attribute of save button
				enable_save_button($(this));
				return;
			}

			// Shows loading symbol until model get saved
			//$('#noteUpdateModal').find('span.save-status').html(getRandomLoadingImg());

			var json = serializeForm("dealnoteUpdateForm");
			
			


			saveDealNote($("#dealnoteUpdateForm"), $("#dealnoteupdatemodal"), this, json);
		});
		/**
		 * Saves note model using "Bcakbone.Model" object, and adds saved data to
		 * time-line if necessary.
		 */
		$('#dealnote_validate').live('click', function(e)
		{
			e.preventDefault();

			// Returns, if the save button has disabled attribute
			if ($(this).attr('disabled'))
				return;
			
			if (!isValidForm('#dealnoteForm'))
			{
				return;
			}

			disable_save_button($(this));
			
			// Shows loading symbol until model get saved
			//$('#noteModal').find('span.save-status').html(getRandomLoadingImg());

			var json = serializeForm("dealnoteForm");

			console.log(json);
		
			    saveDealNote($("#dealnoteForm"), $("#deal-note-modal"), this, json);
		});

		/**
		 * Shows note modal and activates contacts typeahead to its related to field
		 */
		$('#dealshow-note').live('click', function(e)
		{
			
			e.preventDefault();
			$("#deal-note-modal").modal('show');

			
			var el = $("#dealnoteForm");
			
		//	agile_type_ahead(id, el, callback, isSearch, urlParams, noResultText, url, isEmailSearch)
			agile_type_ahead("notes_related_to", el, deals_typeahead,false,"","","core/api/search/deals",false,true);
			
		});
		
		
		/**
		 * "Hide" event of note modal to remove contacts appended to related to
		 * field and validation errors
		 */
		$('#deal-note-modal').on('hidden', function()
		{
			// Removes appended contacts from related-to field
			$("#dealnoteForm").find("li").remove();

			// Remove value of input field
			$("#from_task", "#dealnoteForm").val("");
			$("#task_form", "#dealnoteForm").val("");
			
			// Removes validation error messages
			remove_validation_errors('dealnoteModal');
		});
		
		
	
		
		
		function saveDealNote(form, modal, element, note)
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
				modal.modal('hide');

				var note = data.toJSON();

				console.log(note);
				
				if (dealNotesView && dealNotesView.collection)
				{
					if(dealNotesView.collection.get(note.id))
					{
						dealNotesView.collection.get(note.id).set(new BaseModel(note));
					}
					else
					{
						dealNotesView.collection.add(new BaseModel(note), { sort : false });
						dealNotesView.collection.sort();
					}
				}
				
			
				
			} });
		}
