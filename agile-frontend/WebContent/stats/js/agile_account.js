/**
 * agile_account.js deals with function to set id, namespace
 * 
 * @module stats
 */

function agile_setAccount(id, namespace)
{
	// Sets the contact account with passed id and namespace
	agile_id.set(id, namespace);
	agile_setEmailFromUrl();

}

function agile_setEmailFromUrl()
{
	// Check if fwd=cd url
	if (window.location.href.search("fwd=cd")!==-1){
		try{
			// Get data
			var k =  decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURI("data").replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
			if(k) {

				// Get and set email
				agile_guid.set_email(JSON.parse(k).email);
			}
		}
		catch(e){
			console.log(e.message);
		}
	}
}

function _agile_set_whitelist(base64Domain)
{
	window["agile-domain"] = base64Domain;
}