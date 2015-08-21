	
		/**
		 * "Hide" event of note modal to remove contacts appended to related to
		 * field and validation errors
		 */
		$('#deal-note-modal').on('hidden.bs.modal', function()
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

