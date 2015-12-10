$(function()
{
	/**
	 * Displays note modal. Also prepends the contact name to related to field
	 * of activity modal.
	 */
	$('body').on('click', '.task-add-note, .deal-add-note', function(e){
		e.preventDefault();

		// Get form id
		var formId = getTaskFormId(this);
		
		// Append note form
		var that = this;
		getTemplate('note-form', {}, undefined, function(template_ui){
			if(!template_ui)
				  return;

			$("#forNoteForm", "#" + formId).html($(template_ui));	
			$(".deal-note-label").show();
			// Hide + Add note link
			//$(that).hide();

		}, $("#forNoteForm", "#" + formId));
	});			
			
});

// Add related notes of task to task form modal
function showNoteOnForm(formName, notes)
{
	console.log("showNoteOnForm");	

	$.each(notes, function(index, note)
	{
		getTemplate('notes-for-task', note, undefined, function(template_ui){
			if(!template_ui)
				  return;
			$("#notes", "#" + formName).append($(template_ui));
		}, null);

		
	});
}

/**
 * Reads the note values from the elements having class "notes" and maps them as
 * a json object to return.
 * 
 * @method get_notes
 * @param {String}
 *            form_id to read notes from the form
 * @returns json object of notes
 */
function get_notes(form_id)
{
	var notes_json = $('#' + form_id + ' .notes').map(function()
	{
		var values = [];

		$.each($(this).children(), function(index, data)
		{
			values.push(($(data).attr("data")).toString())
		});
		return { "name" : $(this).attr('name'), "value" : values };
	}).get();
	
	return notes_json;
}
