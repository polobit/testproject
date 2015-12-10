var Agile_Tour = {};

/**
 * Returns Agile_tour steps JSON
 * 
 * @param el
 */
function create_tour_steps(el)
{

	Agile_Tour["contacts"] = [
			{ "element" : "#contacts", "title" : "Contact & Account Management",
				"content" : "View your contacts, leads and accounts (companies) all at one place.<br/>", "placement" : "bottom", "el" : el, "backdrop" : true },
			{ "element" : "#filters-tour-step", "title" : "Companies (Accounts)",
				"content" : "Accounts are stored as Companies in Agile.<br/><br/> You can switch between contacts and companies  here.<br/>",
				"placement" : "bottom", "el" : el, "backdrop" : true },
			{
				"element" : "#tags",
				"title" : "Tags",
				"content" : "Tags help you effectively manage your contacts and companies.<br/><br/> For eg: you can add a lead tag to your contacts for leads.<br/>",
				"placement" : "right", "el" : el, "backdrop" : true }
	]

	/**
	 * Contacts details
	 */
	Agile_Tour["contact-details"] = [
			{ "element" : "#contact-tab-content", "title" : "Facebook-Style Timeline",
				"content" : "Notice the awesome timeline with dates, emails exchanged, social messages & site visits.<br/>", "placement" : "right", "el" : el,
				"backdrop" : true },
			{
				"element" : "#score",
				"container" : "#score",
				"title" : "Score your leads",
				"content" : "Assign lead scores for every contact to keep high quality leads swimming on top. <br/><br/> Use workflows to automate the process based on user behavior.<br/>",
				"placement" : "bottom", "el" : el, "backdrop" : true },
			{ "element" : "#widgets", "title" : "Widgets & Integrations",
				"content" : "Get more information about the contact from social media, helpdesk tickets, chats, and from billing systems.<br/>",
				"placement" : "left", "el" : el, "backdrop" : true, },
	];

	/**
	 * Calendar
	 */
	Agile_Tour["calendar"] = [
			{ "element" : "#calendar_event", "title" : "Calendar Events", "content" : "Events are time based such as meetings.<br/> They show up in calendar.<br/>",
				"placement" : "left",
				// "el": el,
				"backdrop" : true, },
			{ "element" : ".todo-block", "title" : "To Do Tasks",
				"content" : "Tasks are like to-dos. Result oriented.<br/><br/> You can assign a category such as call, email.<br/>", "placement" : "right",
				// "el": el,
				"backdrop" : true, },
			{ "element" : "#subscribe-ical", "title" : "Calendar Sync",
				"content" : "You can sync your Agile calendar with  Outlook, Google calendar or your mobile phone.<br/>", "placement" : "top",
				// "el": el,
				"backdrop" : true, },

	];

	Agile_Tour["workflows"] = [
			{
				"element" : "#learn-workflows",
				"title" : "Learn about Campaigns",
				"content" : "Our customers love campaign workflows. You would too!<br/><br/>  <p class='text-error'><strong>Take a few mins and learn more about campaigns.</strong></p>",
				"placement" : "left", "el" : el, "backdrop" : true, },
			{
				"element" : "#add-trigger",
				"title" : "Triggers",
				"content" : "Create conditions to trigger your campaigns automatically. <br/><br/> <strong>Eg:</strong> when a tag is added or when a contact reaches a score.<br/>",
				"placement" : "bottom", "el" : el, "backdrop" : true, }
	]
/*	Agile_Tour["workflows-add"] = [
		{ "element" : "#workflowform", "title" : "Visual Campaigns",
			"content" : "Create your campaigns and workflows visually.<br/> Just drag and drop the nodes. Connect them to the workflow.<br/>",
			"placement" : "top", "el" : el, "backdrop" : true, }
	]*/

}

var tour;

/**
 * gets the key and initializes the tour with steps from the JSON Object
 * 
 * @param key
 * @param el
 */
function start_tour(key, el)
{
	if((1 + 1) == 2)
		return;
	
	if (!key)
		key = Current_Route;

	console.log(tour);

	// If tour is defined and tour name is not equal to current route/key, then
	// tour should be ended
	if (tour && tour._options)
	{
		var step = tour._current;
		console.log(step);
		console.log(tour._options.name);
		console.log(key + "-tour");

		if (tour._options.name != key + "-tour")
		{
			tour.end();
			tour = undefined;
		}
		else
		{
			// if user hits a button in the page, it reloads. On reload, current
			// tour is stoped and reinitialized
			tour.end();
			tour.setCurrentStep(step);
			tour.start(true);
			return;
		}
	}

	tour = undefined;
	var tour_flag = false;

	if (!el)
	{
		if (tour_flag)
			return;

		// Initializes the tour and sets tour flag to ensure tour won't load
		// again
		initiate_tour(key, el);
		tour_flag = true;
	}

	// Tour should be initialized only after page is loaded
	$("body").on('agile_collection_loaded', 'body', function(event, element)
	{
		if (tour_flag)
			return;

		// Initializes the tour and sets tour flag to ensure tour won't load
		// again
		initiate_tour(key, element);
		tour_flag = true;
	});
}

/**
 * Initializes the tour with based fetched from JSON object defined. key can
 * either be sent explicitly or it takes them from current route
 * 
 * @param key
 * @param el
 */
function initiate_tour(key, el)
{
	// Reads cookie which is set in Homeservlet when new user is created
	var tour_status_cookie = readCookie("agile_tour");

	// If cookies is not preset it returns back
	if (!tour_status_cookie)
		return;

	// If is undefined the current route is assigned to tour
	if (!key)
	{
		if (!Current_Route)
			return;

		key = Current_Route;
	}

	// Parses cookie. It is parsed 2 times or it is returing string instead of
	// JSON object
	tour_status_cookie = JSON.parse(JSON.parse(tour_status_cookie));

	// Reads whether tour is ended on current route
	tourStatus = tour_status_cookie[key];

	// If tour is not there on current page then it is returned back
	if (!tourStatus)
		return;

	// If JSON Object is empty, then creates new JSON Object
	if ($.isEmptyObject(Agile_Tour))
		create_tour_steps(el);

	if (Agile_Tour[key])
		head.load(CSS_PATH+'css/bootstrap-tour.min.css', 'lib/bootstrap-tour-agile.min.js', function()
		{
			// Uses bootstrap tour
			tour = new Tour({ name : key + "-tour", debug : true, useLocalStorage : true, endOnLast : true, onEnd : function(tour)
			{

				// Remove from cookie on ending tour
				$("." + key + "-tour").remove();
				delete tour_status_cookie[key];

				if ($.isEmptyObject(tour_status_cookie))
				{
					eraseCookie("agile_tour");
					return;
				}

				/*
				 * Stringified it twice to maintain consistency with the cookie
				 * set from backend. Creates JSON with current step removed.
				 */
				createCookie("agile_tour", JSON.stringify(JSON.stringify(tour_status_cookie)));
			} });

			tour.addSteps(Agile_Tour[key]);

			// Set current step to first step
			tour.setCurrentStep(0);
			tour.start(true);

		})

}

/**
 * Creates a tour cookie and initializes tour on current page.
 */
function reinitialize_tour_on_current_route()
{

	console.log(tour);

	// Return of tour is already enabled on that route
	var tour_status_cookie = readCookie("agile_tour");
	var key = Current_Route;

	// If current view is contact details page we cannot initialize
	// tour based on route name, so we should be changing it to
	// "contact-details"
	if (Current_Route.indexOf("contact/") != -1)
		key = "contact-details";

	// If cookie exists, checks the state of tour in curent route.
	if (tour_status_cookie)
	{
		tour_status_cookie = JSON.parse(JSON.parse(tour_status_cookie));

		if (tour_status_cookie[key] == true)
			return;
		localStorage.removeItem(key + "-tour_current_step");
	}

	else
		tour_status_cookie = {};

	// Set tour back to true and save in cookie.
	tour_status_cookie[key] = true;

	console.log(JSON.stringify(tour_status_cookie));

	// Removes the current step from localstorage, it is set by bootstrap tour
	localStorage.removeItem(key + "-tour_current_step");

	// Creates a new tour cookie
	createCookie("agile_tour", JSON.stringify(JSON.stringify(tour_status_cookie)));

	// Initialize tour
	initiate_tour(key);
}

$(function()
{
	/**
	 * Selecting tour enables tour again.
	 */
	$('#agile-page-tour').click(function(e)
	{
		e.preventDefault();
		reinitialize_tour_on_current_route();
	});
});
