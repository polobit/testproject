/**
 * agile_api.js deals with the _agile object used to define the api calls
 * 
 * @module stats
 */
var _agile = {

set_account : function(APIKey, domain)
{
	agile_setAccount(APIKey, domain);	//set account
}, 
set_email : function(email)
{
	agile_setEmail(email);				// set contact email
}, 
track_page_view : function(callback)
{
	agile_trackPageview(callback);		// track a particular page
}, 
create_contact : function(properties, callback)
{
	agile_createContact(properties, callback);	//create a contact
}, 
delete_contact : function(email, callback)
{
	agile_deleteContact(email, callback);		//delete a contact
}, 
add_tag : function(tags, callback, email)
{
	agile_addTag(tags, callback, email);	// add tags
}, 
remove_tag : function(tags, callback, email)
{
	agile_removeTag(tags, callback, email);	//remove tags
}, 
add_score : function(score, callback, email)
{
	agile_addScore(score, callback, email);		//add score to contact
}, 
subtract_score : function(score, callback, email)
{
	agile_subtractScore(score, callback, email);	//subtract score from contact
}, 
add_note : function(subject, description, callback, email)
{
	agile_addNote(subject, description, callback, email); //add note to contact
},
add_property : function(name, id, callback, email)
{
	agile_addProperty(name, id, callback, email);	//add or update property to contact
},
add_task : function(data, callback, email)
{
	agile_addTask(data, callback, email);	// add a to do
},
add_deal : function(data, callback, email)
{
	agile_addDeal(data, callback, email);	// add a opportunity
} };