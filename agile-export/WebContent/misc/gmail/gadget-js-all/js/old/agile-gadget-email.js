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
 *            Boolean Decide whether mail asked for Local host or gmail.
 * @returns {Array} Returns a formatted array.
 */
function agile_get_emails(Boolean) {

	//  ------ Generate mails from gmail. ------ 
	if (Boolean) {
		//  ------ Fetch the array of content matches. ------ 
		Matches = google.contentmatch.getContentMatches();
		var Gadget_Prefs = new gadgets.Prefs();
		var Mail_Account_Holder = Gadget_Prefs.getString("agile_user_email");
		return agile_build_list(Matches, Mail_Account_Holder);
	}
	
	//  ------ Take email and sender's info for local host. ------ 
	else {
		var Matches = [{email_from: "devika@faxdesk.com"},{name_from: "Devika Jakkannagari"},
						{email_to: "abhi@gashok.mygbiz.com;rahul@gashok.mygbiz.com;dheeraj@gashok.mygbiz.com;chandan@gashok.mygbiz.com;abhiranjan@gashok.mygbiz.com"},
						{name_to: "Abhi;;D j p;;"},{email_cc: "devikatest1@gmail.com;devikatest@gmail.com;teju@gmail.com"},{name_cc: "Dev T1;;Teju"},
						{email:"devikatest@gmail.com"},{email:"test1@gmail.com"},{email:"test2@gmail.com"},{email:"test1@gmail.com"}];
		return agile_build_list(Matches, "test1@gmail.com");
	}
}

/**
 * Generates mail list object with first name and last name.
 * Removes duplicate emails.
 * Not includes current gmail account holder's email in list.
 * 
 * @method agile_build_list
 * @param {Object} Unsorted_Mails Unsorted email list object.
 * @param {String} Ac_Email Account holder's email id.
 * @returns {Object} ret sorted email list object. 
 * */
function agile_build_list(Unsorted_Mails, Ac_Email){
	
	/**
	 * Rearrange 2D mail list object into 1D mail list object.
	 * 
	 * @method Agile_Compress
	 * @param {Object} Unsorted_Mails Unsorted email list object.
	 * @returns {Object} Compressed_Mails One Dimensional mail list object. 
	 * */
	function agile_compress(Unsorted_Mails) {
		
		var Compressed_Mails = {};
		
		//  ------ Iterate through unsorted mail list object. ------ 
		for(var Index =0; Index < Unsorted_Mails.length; Index++) {
			for(var Key in Unsorted_Mails[Index]) {
				
				//  ------ Put body and subject mails together separated by ";". ------
				if(typeof(Compressed_Mails[Key]) != "undefined")
					Compressed_Mails[Key] += ";";
				//  ------ Create Object having key:value pair as "type_of_mail : mail_or_name". ------ 
				else
					Compressed_Mails[Key] = "";
				Compressed_Mails[Key] +=  Unsorted_Mails[Index][Key];
			}
		}
		
		return Compressed_Mails;
	}
	
	
	/**
	 * Create mail and name pair array. By passing corresponding pair of strings.
	 * 
	 * @method agile_create_pair
	 * @param {String} Mail_String mail string.
	 * @param {String} Name_String name string. 
	 * @param {Array} Pair_Array array of name and mail pair object.
	 * */
	function agile_create_pair(Mail_String, Name_String, Pair_Array) {
		
		//  ------ Create name and mail array from name and mail strings passed. ------  
		Names_Array = Name_String.split(";");
		Mails_Array = Mail_String.split(";");
		//  ------ Make mail nad name array of equal length. ------
		while(Names_Array.length < Mails_Array.length) Names_Array = [""].concat(Names_Array);
		while(Mails_Array.length < Names_Array.length) Mails_Array = [""].concat(Mails_Array);
		
		for(var Index = 0; Index < Names_Array.length; Index++) {
			
			if(Mails_Array[0] != ""){
				var Temporary_Object = {};
				Temporary_Object.name = Names_Array[Index];
				Temporary_Object.email = Mails_Array[Index];
				Pair_Array.push(Temporary_Object);
			}
		}
	}
	  

	/**
	 * Split name into first name and last name.
	 * 
	 * @method agile_parse_name
	 * @param {String} Full_Name full name string. 
	 * @returns {Array} return array having first and last name. 
	 * */
	function agile_parse_name(Full_Name) {
		
		//  ------ Split the name as first name and last name. ------ 
		Split_Names = Full_Name.split(" ");
		
		//  ------ Return first name and empty string, if there is no last name. ------ 
		if(Split_Names.length == 1) 
			return [Split_Names[0], ""];
		
		var First_Name = "", Last_Name = "";
		
		for(var Index = 0; Index < Split_Names.length; Index++) {
			//  ------ Make all words as first name accept last word. ------  
			if(Index < Split_Names.length-1) 
				First_Name += " " + Split_Names[Index];
			else
				Last_Name += " " + Split_Names[Index]
		}
		
		return [First_Name.substr(1), Last_Name.substr(1)];
	}
	  
	var Soreted_Mail_1 = [], Soreted_Mail_2 = [];
	//  ------ Compress mail list into 1 D object. ------ 
	var Mail_List = agile_compress(Unsorted_Mails);

	//  ------ Complete mail list object with all type of possible mails. ------ 
	if(typeof(Mail_List["email_from"]) == "undefined") Mail_List["email_from"] = "";
	if(typeof(Mail_List["name_from"]) == "undefined") Mail_List["name_from"] = "";
	if(typeof(Mail_List["email_to"]) == "undefined") Mail_List["email_to"] = "";
	if(typeof(Mail_List["name_to"]) == "undefined") Mail_List["name_to"] = "";
	if(typeof(Mail_List["email_cc"]) == "undefined") Mail_List["email_cc"] = "";
	if(typeof(Mail_List["name_cc"]) == "undefined") Mail_List["name_cc"] = "";
	
	//  ------ Create array of corresponding name, mail object. ------ 
	if(typeof(Mail_List["email"]) != "undefined")
		agile_create_pair(Mail_List["email"], "", Soreted_Mail_2);
	agile_create_pair(Mail_List["email_from"], Mail_List["name_from"], Soreted_Mail_1);
	agile_create_pair(Mail_List["email_to"], Mail_List["name_to"], Soreted_Mail_1);
	agile_create_pair(Mail_List["email_cc"], Mail_List["name_cc"], Soreted_Mail_1);

	//  ------ Final sorted mail list object. ------ 
	var Sorted_Mail_List = {};
	
	//  ------ Remove duplicate mails and Gmail account owners email from list. ------
	for(var Index = 0; Index < Soreted_Mail_1.length; Index++) if(Soreted_Mail_1[Index]["email"] != Ac_Email){
		var Names = agile_parse_name(Soreted_Mail_1[Index]["name"]);
		Sorted_Mail_List[Soreted_Mail_1[Index]["email"]] = {"email": Soreted_Mail_1[Index]["email"], "fname":Names[0], "lname":Names[1], "mail_exist":false};
	}
	
	for(var Index = 0; Index < Soreted_Mail_2.length; Index++) if(Soreted_Mail_2[Index]["email"] != Ac_Email){
		var Names = agile_parse_name(Soreted_Mail_2[Index]["name"]);
		if(typeof (Sorted_Mail_List[Soreted_Mail_2[Index]["email"]]) == "undefined"){
			Sorted_Mail_List[Soreted_Mail_2[Index]["email"]] = {"email": Soreted_Mail_2[Index]["email"], "fname":Names[0], "lname":Names[1], "mail_exist":false};
		}
	}  
	
	return Sorted_Mail_List;
}