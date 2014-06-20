$(function()
{
	/**
	 * Displays note modal. Also prepends the contact name to related to field
	 * of activity modal.
	 */
	$('.task-add-note').live('click', function(e)
	{
		e.preventDefault();

		// Get form id
		var formId = getTaskFormId(this);
		
		// Append note form
		$("#forNoteForm", "#" + formId).html(getTemplate('note-form'));	
		
		// Hide + Add note link
		$(this).hide();
	});			
			
});

// Add related notes of task to task form modal
function showNoteOnForm(formName, notes)
{
	console.log("showNoteOnForm");	

	$.each(notes, function(index, note)
	{
		$("#notes", "#" + formName).append(getTemplate('notes-for-task', note));
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
