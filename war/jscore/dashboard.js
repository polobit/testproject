function setupDashboard(el)
{
	setupSubscriptionDetails(el);
	setupDashboardTimeline();
	setUpDashboardNavtabs(el);
}

function setupSubscriptionDetails(el)
{
	$.getJSON('core/api/subscription', function(data){
		console.log(data);
		if(data)
			{
				head.js(LIB_PATH + 'lib/prettify-min.js', function() {
					var view = new Base_Model_View({
					url : '/core/api/api-key',
					template : "dashboard-api-key-model",
					postRenderCallback : function(el) {
						prettyPrint();
					}
				});

					$("#subscription-stats").html(view.el);
				});
				return;
			}
		$("#subscription-stats").html(getTemplate('user-billing', data));
	});
	
}


function setUpDashboardNavtabs(el)
{
	var myRecentContacts = new Base_Collection_View({
		url: 'core/api/contacts/recent?page_size=10' ,
        restKey: "contacts",
        templateKey: "dashboard-contacts",
        individual_tag_name: 'tr',
        sort_collection: false,
    });
	myRecentContacts.collection.fetch();
	$('#recentContacts', el).addClass('active');
	console.log(myRecentContacts.el);
    	$('#recentContacts', el).html(myRecentContacts.el);
	
	$('.dashboard-timeline-filter').live('click', function(e){
		e.preventDefault();
		$("#my-timeline").empty();
		console.log($(this).attr('url'));
		setupDashboardTimeline($(this).attr('url'));
	});
	
	$('#dashboardTabs a[href="#notes"]').live('click', function (e){
		e.preventDefault();
		var myNotes = new Base_Collection_View({
			url: 'core/api/notes/my/notes' ,
            restKey: "opportunity",
            templateKey: "dashboard-notes",
            individual_tag_name: 'tr',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".deal-created-time", el).timeago();
            	})
            }
        });
		myNotes.collection.fetch();
        	$('#notes').html(myNotes.el);
	});
	$('#dashboardTabs a[href="#deals"]').live('click', function (e){
		e.preventDefault();
		var myDeals = new Base_Collection_View({
			url: 'core/api/opportunity/my/deals' ,
            restKey: "opportunity",
            templateKey: "dashboard-opportunities",
            individual_tag_name: 'tr',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	head.js(LIB_PATH + 'lib/jquery.timeago.js', function(){
            		 $(".deal-created-time", el).timeago();
            	})
            }
        });
		myDeals.collection.fetch();
        	$('#deals').html(myDeals.el);
	});
	$('#dashboardTabs a[href="#tasks"]').live('click', function (e){
		e.preventDefault();
	
	});
	$('#dashboardTabs a[href="#campaigns"]').live('click', function (e){
		e.preventDefault();
	});
	$('#dashboardTabs a[href="#recentContacts"]').live('click', function (e){
		e.preventDefault();
		var myRecentContacts = new Base_Collection_View({
			url: 'core/api/contacts/recent?page_size=10' ,
            restKey: "contacts",
            templateKey: "dashboard-contacts",
            individual_tag_name: 'tr',
            sort_collection: false,
        });
		myRecentContacts.collection.fetch();
        	$('#recentContacts').html(myRecentContacts.el);
	});
}

