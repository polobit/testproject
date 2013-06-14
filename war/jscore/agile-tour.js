var AGILE_TOUR = {};

function create_tour_steps(el) {
	
	AGILE_TOUR["contacts"] = [
	                                 {
	                                	 "element" : "#contacts",
	                     				"title" : "Contact & Account Management",
	                     				"content" : "View your contacts, leads and accounts (companies) all at one place.<br/>",
	                     				"placement" : "bottom",
	                     				"el": el,
	                     				"backdrop" : true
	                                 },
	                                 {
	                                	 "element" : "#filters-tour-step",
	                     				"title" : "Companies (Accounts)",
	                     				"content" : "Accounts are stored as Companies in Agile.<br/><br/> You can switch between contacts and companies  here.<br/>",
	                     				"placement" : "bottom",
	                     				"el": el,
	                     				"backdrop" : true
	                                 },
	                                 {
	                                	 "element" : "#tags",
	                     				"title" : "Tags",
	                     				"content" : "Tags help you effectively manage your contacts and companies.<br/><br/> For eg: you can add a lead tag to your contacts for leads.<br/>",
	                     				"placement" : "right",
	                     				"el": el,
	                     				"backdrop" : true
	                                 }
	                                ]
	
	
	/**
	 * Contacts details
	 */
	AGILE_TOUR["contact-details"] = [
	                             	{
	                    				"element" : "#contact-tab-content",
	                    				"title" : "Facebook-Style Timeline",
	                    				"content" : "Notice the awesome timeline with dates, emails exchanged, social messages & site visits.<br/>",
	                    				"placement" : "right",
	                    				"el": el,
	                    				"backdrop" : true
							                    			},
									{
										"element" : "#score",
										"container": "#score",
										"title" : "Score your leads",
										"content" : "Assign lead scores for every contact to keep high quality leads swimming on top. <br/><br/> Use workflows to automate the process based on user behavior.<br/>",
										"placement" : "bottom",
										"el": el,
										"backdrop" : true
									},
									{
										"element" : "#widgets",
										"title" : "Widgets & Integrations",
										"content" : "Get more information about the contact from social media, helpdesk tickets, chats, and from billing systems.<br/>",
										"placement" : "left",
										"el": el,
										"backdrop" : true,
									}, 
							];
	
	/**
	 * Calendar
	 */
	AGILE_TOUR["calendar"] = [
	                          {
		                        	"element" : "#calendar",
		              				"title" : "Calendar Events",
		              				"content" : "Events are time based such as meetings.<br/> They show up in calendar.<br/>",  
		              				"placement" : "left",
		              			//	"el": el,
		              				"backdrop" : true,
		                      },
	                          {
	                        	"element" : ".todo-block",
	              				"title" : "To Do Tasks",
	              				"content" : "Tasks are like to-dos. Result oriented.<br/><br/> You can assign a category such as call, email.<br/>",  
	              				"placement" : "right",
	              				// "el": el,
	              				"backdrop" : true,
	                          },
	                          {
		                        	"element" : "#subscribe-ical",
		              				"title" : "Calendar Sync",
		              				"content" : "You can sync your Agile calendar with  Outlook, Google calendar or your mobile phone.<br/>",  
		              				"placement" : "top",
		              			//	"el": el,
		              				"backdrop" : true,
		                      },
	                          
	                          ];
	
	AGILE_TOUR["workflows"] = [
	                        	   	{
			                        	"element" : "#learn-workflows",
			              				"title" : "Learn about Campaigns",
			              				"content" : "Our customers love campaign workflows. You would too!<br/><br/>  <p class='text-error'><strong>Take a few mins and learn more about campaigns.</strong></p>",  
			              				"placement" : "left",
			              				"el": el,
			              				"backdrop" : true,
			                        },
			                       	{
			                        	"element" : "#add-trigger",
			              				"title" : "Triggers",
			              				"content" : "Create conditions to trigger your campaigns automatically. <br/><br/> <strong>Eg:</strong> when a tag is added or when a contact reaches a score.<br/>",  
			              				"placement" : "bottom",
			              				"el": el,
			              				"backdrop" : true,
			                        },
			                     	{
			                        	"element" : "#workflows-tour-step",
			              				"title" : "Sample Campaigns",
			              				"content" : "I have created few sample campaigns for you to get a hang of them.<br/><br/> <strong>Multistep Responders</strong> - simple email with an automated followup after few days <br/><br/> <strong>Multichannel Campaigns</strong> - email and engage on Twitter if they have opened your your email <br/><br/> <strong>Cart Abandonment made simple</strong> - send a coupon to someone who has added an item in the cart but hasn't finished the checkout in 3 days. <br/>",
			              				"placement" : "right",
			              				"el": el,
			              				"backdrop" : true,
			                        },
	                           ]
	AGILE_TOUR["workflows-add"] = [
	                               {
	                            	   "element" : "#workflowform",
			              				"title" : "Visual Campaigns",
			              				"content" : "Create your campaigns and workflows visually.<br/> Just drag and drop the nodes. Connect them to the workflow.<br/>",
			              				"placement" : "top",
			              				"el": el,
			              				"backdrop" : true,
			                        }
									
	                               ]		
	
}

var tour;
var tour_flag = false;
function startTour(key, el) {
	tour = undefined;
	var tour_flag = false;
	
	 $(el).live('agile_collection_loaded', function(){
		if(tour_flag)
			return;
		
		initiateTour(key, el);
		tour_flag = true;
	 });
}
function initiateTour(key, el)
{ 
	var tourStatusCookie = readCookie("agile_tour");
	if (!tourStatusCookie)
		return;
	if (!key)
		return;
	console.log(tour);
		
	tourStatusCookie = JSON.parse(JSON.parse(tourStatusCookie));
	tourStatus = tourStatusCookie[key];
	if(!tourStatus)
		return;

	if ($.isEmptyObject(AGILE_TOUR))
		create_tour_steps(el);


	if(AGILE_TOUR[key])
	head.js('lib/bootstrap-tour-agile.min.js', function() {
		tour = new Tour({
			 name: key + "-tour",
		     debug:true,
			useLocalStorage : true,
			endOnLast: true,
			onEnd : function(tour) {
				
				$("."+key + "-tour").remove();
				delete tourStatusCookie[key];
				
				if ($.isEmptyObject(tourStatusCookie)) {
					eraseCookie("agile_tour");
					return;
				}

				// Stringified it twice to maintain consistency with the cookie
				// set from backend
				createCookie("agile_tour", JSON.stringify(JSON
						.stringify(tourStatusCookie)));
				// }
			}
		});
		
			tour.addSteps(AGILE_TOUR[key]);

			tour.start(true);

	})

}

function endCurrentTour(){
	
}
