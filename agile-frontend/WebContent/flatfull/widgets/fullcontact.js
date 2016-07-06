var FullContactObj = {};


function loadFullContactData(emailID){
	head.js(LIB_PATH + 'lib/jquery.fullcontact.2.2.js', function(){
		$('#FullContact').html('<div>Full Contact Plugin loaded.</div>');
	});
}

function startFullContactWidget(contact_id){
	console.log("FullContact loaded : "+contact_id);

	FullContactObj = {};
	
	FULLCONTACT_PLUGIN_NAME = "FullContact";

	var fullcontact_widget = agile_crm_get_widget(FULLCONTACT_PLUGIN_NAME);
	var contact_email = agile_crm_get_contact_property('email')

	console.log('In FullContact');
	console.log(fullcontact_widget);

	if(contact_email){
		loadFullContactData(contact_email);
	}else{
		$('#FullContact').html('<div>Email not found for this contact.</div>');	
	}

	FULLCONTACT_Plugin_Id = fullcontact_widget.id;
	var fullcontact_widget_prefs = JSON.parse(fullcontact_widget.prefs);

	
}