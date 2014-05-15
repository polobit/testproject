$(function()
{
	/**
	 * Displays note modal. Also prepends the contact name to related to field
	 * of activity modal.
	 */
	$('.task-add-note').live('click', function(e)
	{
		e.preventDefault();
		var el = $("#noteForm");

		$('#noteModal').modal('show');

		$("#from_task", el).val(true);
		$("#task_form", el).val($(this).closest('form').attr("id"));
		
		agile_type_ahead("note_related_to", el, contacts_typeahead);
	});
});

function saveNoteOfTask(form, modal, element, note)
{

	console.log(note);
	var noteModel = new Backbone.Model();
	noteModel.url = 'core/api/notes';
	noteModel.save(note, { success : function(data)
	{
		// Removes disabled attribute of save button
		enable_save_button($(element));

		form.each(function()
		{
			this.reset();
		});

		// Removes loading symbol and hides the modal
		modal.modal('hide');

		var note = data.toJSON();

		console.log(note);
		
		$("#notes", "#"+note.task_form).val(note.id);
	} });
}
