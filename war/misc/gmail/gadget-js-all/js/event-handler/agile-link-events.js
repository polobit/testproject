$(function()
{

// ------------------------------------------------- agile-link-event.js --------------------------------------------- START --

/**
 * All link related events.
 * Search Contact/ Show Contact/ Add Contact/ Hide Contact. 
 * 
 * @author Dheeraj
 */


//  ------------------------------------------------- Click event for search contact ------------------------------------------- 
	$(".gadget-search-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find('.show-form');
		var That = $(this);
		var Email = "";
		
		//  ------ Check whether it is Search panel or single email. ------ 
		if(!That.hasClass("search-mail-button")){
			
			Email = $(el).data("content");
			//  ------ Adjust width of mail list for Process icon. ------ 
			agile_gadget_adjust_width(el, $(".contact-search-waiting", el), true);
			//  ------ Show searching icon. ------ 
			$('.contact-search-waiting', el).css('visibility','visible');
		}
		else {
			
			Email = $(".agile-mail-dropdown option:selected").attr("data-content");
			
			console.log(Email);
			console.log(Contacts_Json[Email]);
			
			
			//  ------ Chaeck if requested mail already present in list. ------ 
			if(Contacts_Json[Email].mail_exist == true){
				//  ------ Show if contact is present otherwise do nothing. ------ 
				$('#agile_content .show-form').each(function(){
					if($(this).data('content') == Email){
						$(this).find(".gadget-show-contact").trigger('click');
						return false;
					}
				});
				console.log("Email is already in list");
				return;
			}
			$('.contact-search-waiting', el).show();
		}
				
		//  ------ Get contact status based on email. ------ 
		_agile.get_contact(Email, 
				{success: function(Response){
							
							$('.contact-search-waiting', el).hide();
							//  ------ Generate UI. ------ 
							if(That.hasClass("search-mail-button")){
								
								agile_add_mail_to_list(Response, Email, el);
							}
							else{
								agile_create_contact_ui(el, That, Email, Response);
							}							
				
				}, error: function(Response){
					
							Response.id = null;
							$('.contact-search-waiting', el).hide();
							//  ------ Generate UI. ------ 
							if(That.hasClass("search-mail-button")){
								$(".contact-search-status", el).fadeIn().delay(4000).fadeOut();
								agile_add_mail_to_list(Response, Email, el);
							}
							else{
								agile_create_contact_ui(el, That, Email, Response);
							}
		}});
	});


//  ------------------------------------------------- Click event for toggle add contact ---------------------------------------

	$(".gadget-add-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");
		var newContact = Contacts_Json[$(this).closest(".show-form").attr("data-content")];
		//  ------ Build contact add template. ------ 
		agile_build_form_template($(this), "gadget-add-contact", ".show-add-contact-form", function() {

			$(".show-add-contact-form", el).toggle();
			agile_gadget_adjust_height();
			
			console.log('add this email - ',newContact);
			if(newContact.name.trim().length > 0){
				console.log(newContact.name.split(' '));
				$('#fname',el).val(newContact.name.split(' ')[0]);
				$('#lname',el).val(newContact.name.substring(newContact.name.indexOf(' '),newContact.name.length));
			} else if(newContact.email.length>0)
				$('#fname',el).val(ucfirst(newContact.email.substring(0,newContact.email.indexOf('@'))));
			
			if(newContact.email.length>0){
				var reg = new RegExp('@([a-z]+)\.');
				if(reg.test(newContact.email)){
					var comp = reg.exec(newContact.email)[1];
					if(PUBLIC_EMAIL_DOMAINS.indexOf(comp)<0)
						$('#company',el).val(ucfirst(comp));
				}
			}
		});
	});
	
	
//  ------------------------------------------------- Click event for toggle show contact -------------------------------------- 

	$(".gadget-show-contact").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
					.find('.show-form');
		var That = $(this);
		//  ------ Build show contact form template. ------ 
		agile_build_form_template(That, "gadget-contact-summary", ".show-contact-summary", function() {

			var Json = Contacts_Json[$(el).data("content")];
			//  ------ Build tags list. ------ 
			agile_build_tag_ui($("#added_tags_ul", el), Json);

			//  ------ Hide list view of contact. ------ 
			$(".display-toggle", el).addClass("hide-contact-summery").removeClass("gadget-show-contact");
			$(".display-toggle i", el).removeClass("icon-plus").addClass("icon-minus");
			$(".display-toggle span", el).text("Hide Details");
			$(".display-toggle", el).next().hide();
			
			agile_gadget_adjust_height();
			//  ------ Show contact summary. ------ 
			$(".show-contact-summary", el).toggle();
			agile_gadget_adjust_height();
			//  ------ Build tabs. ------ 
			agile_build_form_template(That, "gadget-tabs", ".option-tabs", function() {
				
				//  ------ Enables Tab. ------ 
				$('.gadget_tabs', el).tab();
				//  ------ Show Tabs. ------ 
				$(".option-tabs", el).toggle();
				agile_gadget_adjust_height();
				//  ------ Show notes tab by default. ------ 
				$('.gadget-notes-tab', el).trigger('click');
				
				//  ------ Enables Drop down. ------ 
				$('.dropdown-toggle').dropdown();
			});
		});
	});
	

//  ------------------------------------------------- Click event for hide contact info summary -------------------------------- 

	$(".hide-contact-summery").die().live('click', function(e) {
		//  ------ Prevent default functionality. ------ 
		e.preventDefault();
		//  ------ Set context (HTML container where event is triggered). ------ 
		var el = $(this).closest("div.gadget-contact-details-tab")
				.find("div.show-form");

		//  ------ Show list view of contact. ------ 
		$(".display-toggle", el).removeClass("hide-contact-summery").addClass("gadget-show-contact");
		$(".display-toggle i", el).removeClass("icon-minus").addClass("icon-plus");
		$(".display-toggle span", el).text("Show");
		$(".display-toggle", el).next().show();
		
		agile_gadget_adjust_height();
		//  ------ hide contact summary. ------ 
		$(".show-contact-summary", el).toggle();
		agile_gadget_adjust_height();
		//  ------ Show tabs. ------ 
		$(".option-tabs", el).toggle();
		agile_gadget_adjust_height();
	});
	
});
	
/**
 * Calculates total width of mail list and adjusts max-width of e-mail and/or name.
 * 
 * @method agile_gadget_adjust_width
 * @param {Object} el Jquery object gives the current object.
 * @param {Object} Text_Width Jquery object of text to be shown.
 * @param {Boolean} Boolean Boolean variable.
 * */
function agile_gadget_adjust_width(el, Text_Width, Boolean){
	if(Boolean){
		var Total_Width = $(".agile-no-contact", el).width();
		var Total_Text_width = parseInt(Text_Width.width(), 10) + parseInt(Text_Width.css("margin-left"), 10) + 10;
		var Rest_Width = (((Total_Width - Total_Text_width)/Total_Width)*100) + "%";
		$(".contact-list-width", el).css("max-width", Rest_Width);
	}
	else{
		$(".contact-list-width", el).css("max-width", "95%");
	}
}


/**
 * Mail search callback, when only one mail in the mail list.
 * 
 * @method agile_create_contact_ui
 * @param {Object} el It is a jquery object which refers to the current contact container in DOM.
 * @param {Object} that It is jquery object which refer to current event object.
 * @param {String} email Email of the current contact.
 * @param {JSON} Val Response JSON object/array/string.
 * 
 * */
function agile_create_contact_ui(el, That, Email, Val){
	
	//  ------ Set library path for campaign link, check for local host. ------ 
	if(Is_Localhost)
		Val.ac_path = LIB_PATH;
	else
		Val.ac_path = "https://"+ agile_id.namespace +".agilecrm.com/";
	
	//  ------ Merge Server response object with Contact_Json object. ------ 
	$.extend(Contacts_Json[Email], Val);

	//  ------ Build show contact form template. ------ 
	agile_build_form_template(That, "gadget-contact-list", ".contact-list", function() {
		
		//  ------ Contact not found for requested mail, show add contact in mail list. ------ 
		if (Val.id == null) {
			agile_gadget_adjust_width(el, $(".contact-search-status", el), true);
			
			console.log(el);
			console.log(el.html());
			
			$('.contact-search-status', el).show().delay(4000).hide(1,function(){
				agile_gadget_adjust_width(el, $(".contact-search-status", el), false);
			});
			$('.gadget-add-contact', el).trigger('click');
		}	
		//  ------ Contact found, show contact summary. ------  
		else {
			$('.gadget-show-contact', el).trigger('click');
		}
	});
}



/**
 * Mail search callback, when more then one mail in the mail list.
 * And add mail to list below search box.
 * 
 * @method agile_add_mail_to_list
 * 
 */
function agile_add_mail_to_list(Val, Email, el){

	//  ------ Set library path for campaign link, check for local host. ------ 
	if(Is_Localhost)
		Val.ac_path = LIB_PATH;
	else
		Val.ac_path = "https://"+ agile_id.namespace +".agilecrm.com/";
	
	var Contact_Data = {};
	Contact_Data[Email] = Contacts_Json[Email];
	//  ------ Merge Server response object with Contact_Json object. ------ 
	$.extend(Contacts_Json[Email], Val);
	Contacts_Json[Email].mail_exist = true;
	
	//  ------ Compile template and generate UI. ------ 
	var Individual_Template = getTemplate('search', Contact_Data, 'no');
	//  ------ Append contact to container in HTML. ------ 
	$("#agile_content").append($(Individual_Template));
	//  ------ Temporarily hide the list. ------ 
	$("#agile_content").find(".contact-list:last").hide();
	
	
		//  ------ Take contact data from global object variable. ------ 
		var Json = Contacts_Json[Email];
		//  ------ Compile template and generate UI. ------ 
		var Handlebars_Template = getTemplate("gadget-contact-list", Json, 'no');
		//  ------ Insert template to container in HTML. ------ 
		$("#agile_content").find(".contact-list:last").html($(Handlebars_Template));
		//  ------ Show temporarily hidden list element. ------ 
		$("#agile_content").find(".contact-list:last").show();
		//  ------ Adjust gadget window height. ------ 
		if (!Is_Localhost)
			gadgets.window.adjustHeight();
		
		//  ------ Contact found, show contact summary. ------ 		
		if (Json.id != null) {
			$("#agile_content").find('.gadget-show-contact:last').trigger('click');
		}	
		else{
			$("#agile_content").find('.contact-search-status:last').hide();
			$("#agile_content").find(".contact-list-width:last").css("max-width", "95%");
			$("#agile_content").find('.gadget-add-contact').trigger('click');
		}
 	
}



//------------------------------------------------- agile-link-event.js ------------------------------------------------ END --


