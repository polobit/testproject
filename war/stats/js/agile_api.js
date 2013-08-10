var _agile = {

set_account : function(APIKey, domain)
{
	agile_setAccount(APIKey, domain);
}, 
set_email : function(email)
{
	agile_setEmail(email);
}, 
track_page_view : function(callback)
{
	agile_trackPageview(callback);
}, 
create_contact : function(properties, callback)
{
	agile_createContact(properties, callback);
}, 
delete_contact : function(email, callback)
{
	agile_deleteContact(email, callback);
}, 
add_tag : function(tags, callback, email)
{
	agile_addTag(tags, callback, email);
}, 
remove_tag : function(tags, callback, email)
{
	agile_removeTag(tags, callback, email);
}, 
add_score : function(score, callback, email)
{
	agile_addScore(score, callback, email);
}, 
subtract_score : function(score, callback, email)
{
	agile_subtractScore(score, callback, email);
}, 
add_note : function(subject, description, callback, email)
{
	agile_addNote(subject, description, callback, email);
},
add_property : function(name, id, callback, email)
{
	agile_addProperty(name, id, callback, email);
},
add_task : function(data, callback, email)
{
	agile_addTask(data, callback, email);
},
add_deal : function(data, callback, email)
{
	agile_addDeal(data, callback, email);
} };