$(".deal-edit-note").die().live('click', function(e)
	{
	
		e.preventDefault();
	
		var note = dealNotesView.collection.get($(this).attr('data'));
		console.log(note);
		deserializeForm(note.toJSON(), $("#dealnoteUpdateForm",  $('#dealnoteupdatemodal')));
		fill_relation_deal($('#dealnoteUpdateForm'));
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
			
			


			saveDealUpdateNote($("#dealnoteUpdateForm"), $("#dealnoteupdatemodal"), this, json);
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
			if(App_Deal_Details.dealDetailView.model.get('archived') == true)
				return;	
			e.preventDefault();
			$("#deal-note-modal").modal('show');

			
			var el = $("#dealnoteForm");
			
			
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
			noteModel.url = 'core/api/opportunity/deals/notes';
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


				App_Deal_Details.dealDetailView.model = data;
				App_Deal_Details.dealDetailView.render(true)
				Backbone.history.navigate("deal/"+data.toJSON().id , {
		            trigger: true
		        });
				
			
				
			} });
		}
		
		function saveDealUpdateNote(form, modal, element, note)
		{

			console.log(note);
			var noteModel = new Backbone.Model();
			noteModel.url = 'core/api/opportunity/deals/notes';
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


				App_Deal_Details.dealDetailView.model = data;
				App_Deal_Details.dealDetailView.render(true)
				Backbone.history.navigate("deal/"+data.toJSON().id , {
		            trigger: true
		        });
				
			
				
			} });
		}

