/**
 * gadget-main.js is starting point of gadget. When we open any email, gmail
 * contextual gadget is triggered based on the extractor (defined in
 * agile-extractor.xml) definition. It loads agile-gadget.xml, window onload
 * calls init method.
 * 
 * This file consist gadget login and script loading.
 * 
 * @author Dheeraj
 */

/**
 * Initialize gadget for Local host or Production.
 * 
 * @method agile_init_agle_gadget
 */
function agile_init_gadget() {

	//  ------ Check for Local host, set LIB_PATH, check cookie and download scripts. ------ 
	if (window.location.host.indexOf("localhost") != -1) {
		
		// Set Localhost
		Is_Localhost = true;
		
		// Lib Path 
		//LIB_PATH = "http://localhost:8888/";
		
		//_agile.set_account('osrgf4f2r27u8a7l8aap05317d', 'localhost');	
		LIB_PATH = "https://srija1.agilecrm.com/";
		
		_agile.set_account('qs0ug1e05olqjps6k0839b0qk0', 'srija1');	
		
		agile_user_associated();
		
		return;
	}
	
	// Login
	agile_login();
}