var existingDocumentsView;

$(function()
{


});

/**
 * To attach the document to a contact
 * 
 * @param document_id
 * @param saveBtn
 */
function existing_document_attach(document_id, saveBtn)
{
	var json = existingDocumentsView.collection.get(document_id).toJSON();

	// To get the contact id and converting into string
	var contact_id = App_Contacts.contactDetailView.model.id + "";

	// Checks whether the selected document is already attached to that contact
	if ((json.contact_ids).indexOf(contact_id) < 0)
	{
		json.contact_ids.push(contact_id);
		saveDocument(null, null, saveBtn, false, json);
	}
	else
	{
		saveBtn.closest("span").find(".save-status").html("<span style='color:red;margin-left:10px;'>Linked Already</span>");
		saveBtn.closest("span").find('span.save-status').find("span").fadeOut(5000);
		return;
	}
}
