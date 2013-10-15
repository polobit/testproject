/**
 * Generates array of emails in case of retrieved from mail body and sender
 * info, and takes hard coded array in case of Local host. Then sort for
 * duplicate emails and rearrange emails.
 * 
 * @author Dheeraj
 */

/**
 * Extract emails from mail body and semder's info.
 * 
 * @method agile_get_emails
 * @param {Boolean}
 *            bool Decide whether mail asked for Local host or gmail.
 * @returns {Array} Returns a formatted array.
 */
function agile_get_emails(bool) {

	// Generate mails from gmail.
	if (bool) {
		// Fetch the array of content matches.
		matches = google.contentmatch.getContentMatches();
		var prefs = new gadgets.Prefs();
		var Mail_Account_Holder = prefs.getString("agile_user_email");
		return Agile_Build_List(matches, Mail_Account_Holder);
	}
	
	// Take email and sender's info for local host.
	else {
		var matches = [{email_from: "devika@faxdesk.com"},{name_from: "Devika Jakkannagari"},
						{email_to: "abhi@gashok.mygbiz.com;rahul@gashok.mygbiz.com;dheeraj@gashok.mygbiz.com;chandan@gashok.mygbiz.com;abhiranjan@gashok.mygbiz.com"},
						{name_to: "Abhi;;D j p;;"},{email_cc: "devikatest1@gmail.com;devikatest@gmail.com;teju@gmail.com"},{name_cc: "Dev T1;;Teju"},
						{email:"devikatest@gmail.com"},{email:"test1@gmail.com"},{email:"test2@gmail.com"},{email:"test1@gmail.com"}];
		return Agile_Build_List(matches, "test1@gmail.com");
	}
}

/**
 * Generates mail list object with first name and last name.
 * Removes duplicate emails.
 * Not includes current gmail account holder's email in list.
 * 
 * @method Agile_Build_List
 * @param {Object} obj Unsorted email list object.
 * @param {String} Ac_Email Account holder's email id.
 * @returns {Object} ret sorted email list object. 
 * */
function Agile_Build_List(obj, Ac_Email){
	
	// Rearrange 2D mail list object into 1D mail list object.
	function compress(matches) {
		var ret = {};
		for(var i =0; i < matches.length; i++) {
			for(var key in matches[i]) {
				if(typeof(ret[key]) != "undefined")
					ret[key] += ";";
				else
					ret[key] = "";
				ret[key] +=  matches[i][key];
			}
		}
		return ret;
	}
	
	// Create mail and name pair array.
	function Create_Pair(_mail, _name, arr) {
		names = _name.split(";");
		mails = _mail.split(";");
		while(names.length < mails.length) names = [""].concat(names);
		while(mails.length < names.length) mails = [""].concat(mails);
		var ret = [];
		for(var i = 0; i < names.length; i++) {
			if(mails[0] != ""){
				var tmp = {};
				tmp.name = names[i];
				tmp.email = mails[i];
				arr.push(tmp);
			}
		}
	}
	  
	// Split name into first name and last name.
	function Parse_Name(_name) {
		names = _name.split(" ");
		
		if(names.length == 1) 
			return [names[0], ""];
		
		var first_name = "", last_name = "";
		for(var i = 0; i < names.length; i++) {
			if(i < names.length-1) 
				first_name += " " + names[i];
			else
				last_name += " " + names[i]
		}
		
		return [first_name.substr(1), last_name.substr(1)];
	}
	  
	var retArr = [], retArr1 = [];
	var tmpObj = compress(obj);

	if(typeof(tmpObj["email_from"]) == "undefined") tmpObj["email_from"] = "";
	if(typeof(tmpObj["name_from"]) == "undefined") tmpObj["name_from"] = "";
	if(typeof(tmpObj["email_to"]) == "undefined") tmpObj["email_to"] = "";
	if(typeof(tmpObj["name_to"]) == "undefined") tmpObj["name_to"] = "";
	if(typeof(tmpObj["email_cc"]) == "undefined") tmpObj["email_cc"] = "";
	if(typeof(tmpObj["name_cc"]) == "undefined") tmpObj["name_cc"] = "";
	
	if(typeof(tmpObj["email"]) != "undefined")
		Create_Pair(tmpObj["email"], "", retArr1);
	Create_Pair(tmpObj["email_from"], tmpObj["name_from"], retArr);
	Create_Pair(tmpObj["email_to"], tmpObj["name_to"], retArr);
	Create_Pair(tmpObj["email_cc"], tmpObj["name_cc"], retArr);

	var ret = {};
	
	for(var i = 0; i < retArr.length; i++) if(retArr[i]["email"] != Ac_Email){
		var names = Parse_Name(retArr[i]["name"]);
		ret[retArr[i]["email"]] = {"email": retArr[i]["email"], "fname":names[0], "lname":names[1], "mail_exist":false};
	}
	
	for(var i = 0; i < retArr1.length; i++) if(retArr1[i]["email"] != Ac_Email){
		var names = Parse_Name(retArr1[i]["name"]);
		if(typeof (ret[retArr1[i]["email"]]) == "undefined"){
			ret[retArr1[i]["email"]] = {"email": retArr1[i]["email"], "fname":names[0], "lname":names[1], "mail_exist":false};
		}
	}  
	
	return ret;
}