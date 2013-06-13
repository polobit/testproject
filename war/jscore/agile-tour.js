var AGILE_TOUR = {};

function create_tour_steps(el) {
	
	AGILE_TOUR["contacts"] = [
	                                 {
	                                	 "element" : "#contacts-model-list",
	                     				"title" : "Contact & Account Management",
	                     				"content" : "View your contacts, leads and accounts (companies) all at one place.",
	                     				"placement" : "top",
	                     				"el": el
	                     			
	                                 },
	                                 {
	                                	 "element" : "#filter-list",
	                     				"title" : "Companies (Accounts)",
	                     				"content" : "Accounts are stored as Companies in Agile. You can switch between contacts and companies  here.",
	                     				"placement" : "bottom",
	                     				"el": el
	                                 },
	                                 {
	                                	 "element" : "#tags",
	                     				"title" : "Tags",
	                     				"content" : "Tags help you effectively manage your contacts and companies.<br/> For eg: you can add a lead tag to your contacts for leads.",
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
				"element" : "#score",
				"container": "#score",
				"title" : "Score your leads",
				"content" : "Assign lead scores for every contact to keep high quality leads swimming on top. Use workflows to automate the process based on user behavior.",
				"placement" : "bottom",
				"el": el,
				"backdrop" : true
			},
			{
				"element" : "#contact-tab-content",
				"title" : "Facebook-Style Timeline",
				"content" : "Notice the awesome timeline with dates, emails exchanged, social messages & site visits.",
				"placement" : "right",
				"el": el,
				"backdrop" : true
			},{
				"element" : "#widgets",
				"title" : "Widgets & Integrations",
				"content" : "Get more information about the contact from social media, helpdesk tickets, chats, and from billing systems.",
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
		              				"content" : "Events are time based such as meetings. They show up in calendar.",  
		              				"placement" : "left",
		              			//	"el": el,
		              				"backdrop" : true,
		                      },
	                          {
	                        	"element" : ".todo-block",
	              				"title" : "To Do Tasks",
	              				"content" : "Tasks are like to-dos. Result oriented. You can assign a category such as call, email.",  
	              				"placement" : "right",
	              				// "el": el,
	              				"backdrop" : true,
	                          },
	                          {
		                        	"element" : "#subscribe-ical",
		              				"title" : "Calendar Sync",
		              				"content" : "You can sync your Agile calendar with  Outlook, Google calendar or your mobile phone.",  
		              				"placement" : "top",
		              			//	"el": el,
		              				"backdrop" : true,
		                      },
	                          
	                          ];
	
	AGILE_TOUR["workflows"] = [
	                        	   	{
			                        	"element" : "#learn-workflows",
			              				"title" : "Learn about Campaigns",
			              				"content" : "love campaign workflows. You would too! <br/> Take a few mins and learn more about campaigns. ",  
			              				"placement" : "left",
			              				"el": el,
			              				"backdrop" : true,
			                        },
			                       	{
			                        	"element" : "#add-trigger",
			              				"title" : "Triggers",
			              				"content" : "Create conditions to trigger your campaigns automatically. <br/> Eg: when a tag is added or when a contact reaches a score.",  
			              				"placement" : "bottom",
			              				"el": el,
			              				"backdrop" : true,
			                        },
			                     	{
			                        	"element" : "#workflows-tour-step",
			              				"title" : "Sample Campaigns",
			              				"content" : "I have created few sample campaigns for you to get a hang of them.<br/><br/> Multistep Responders - simple email with an automated followup after few days <br/><br/> Multichannel Campaigns - email and engage on Twitter if they have opened your your email <br/><br/> Cart Abandonment made simple - send a coupon to someone who has added an item in the cart but hasn't finished the checkout in 3 days. <br/>",
			              				"placement" : "right",
			              				"el": el,
			              				"backdrop" : true,
			                        },
	                           ]
	AGILE_TOUR["workflows-add"] = [
	                               {
	                            	   "element" : "#workflowform",
			              				"title" : "Visual Campaigns",
			              				"content" : "Create your campaigns and workflows visually.<br/> Just drag and drop the nodes. Connect them to the workflow.",
			              				"placement" : "top",
			              				"el": el,
			              				"backdrop" : true,
			                        }
									
	                               ]		
	
}

var tour;
function startTour(key, el) {
	 $(el).live('agile_collection_loaded', function(){

		 initiateTour(key, el)
	 });
}
function initiateTour(key, el)
{
	var tourStatusCookie = readCookie("agile_tour");
	if (!tourStatusCookie)
		return;
	if (!key)
		return;
		
	tourStatusCookie = JSON.parse(JSON.parse(tourStatusCookie));
	tourStatus = tourStatusCookie[key];
	if(!tourStatus)
		return;

	if ($.isEmptyObject(AGILE_TOUR))
		create_tour_steps(el);


	if(AGILE_TOUR[key])
	head.js('lib/bootstrap-tour.min.js', function() {
		tour = new Tour({
			 name: key + "-tour",
			useLocalStorage : true,
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
