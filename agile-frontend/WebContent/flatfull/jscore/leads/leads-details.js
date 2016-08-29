var LeadDetails = (function(){

	function LeadDetails() {};

	LeadDetails.prototype.loadLeadTabs = function(el, leadJSON)
	{
		timeline_collection_view = null;
		var position = _agile_get_prefs("lead_tab_position");
		if (!position)
		{
			position = "notes";
		}

		if(agile_is_mobile_browser())
		{
			return;
		}

		$('#contactDetailsTab a[href="#leads-'+position+'"]', el).tab('show');
		$(".tab-content", el).find("#"+position+"").addClass("active");

		switch(position)
		{
			case "notes" :
			{
				this.loadNotes();
				break;
			}
			case "events" :
			{
				this.loadEvents();
				break;
			}
			case "tasks" :
			{
				this.loadTasks();
				break;
			}
			case "deals" :
			{
				this.loadDeals();
				break;
			}
		}

	}

	LeadDetails.prototype.loadNotes = function()
	{
	    var id = App_Leads.leadDetailView.model.id;
	    notesView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/notes",
            restKey: "note",
            templateKey: "notes",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".note-created-time", el));
            	
              	contact_detail_page_infi_scroll($('#contact-dtl', App_Leads.leadDetailView.el), notesView);
            },
            appendItemCallback : function(el) {
				includeTimeAgo(el);
			}
        });
        notesView.collection.fetch();
        var ele = $('#notes', App_Leads.leadDetailView.el);
        $(ele).html(notesView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.loadEvents = function()
	{
		var id = App_Leads.leadDetailView.model.id;
		eventsView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/events",
            restKey: "event",
            templateKey: "contact-events",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".event-created-time", el));
            	
            	$('li',el).each(function(){
            	if($(this).find('.priority_type').text().trim() == "High") {
        			$(this).css("border-left","3px solid #f05050");
        		}else if($(this).find('.priority_type').text().trim() == "Normal"){
        			$(this).css("border-left","3px solid #7266ba");
        		}else if($(this).find('.priority_type').text().trim() == "Low") {
        			$(this).css("border-left","3px solid #fad733");
        		}
            	});
            }
        });
		eventsView.collection.fetch();
		var ele = $('#events', App_Leads.leadDetailView.el);
        $(ele).html(eventsView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.loadTasks = function()
	{
		var id = App_Leads.leadDetailView.model.id;
		tasksView = new Base_Collection_View({
            url: '/core/api/contacts/' + id + "/tasks",
            restKey: "task",
            templateKey: "contact-tasks",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".task-created-time", el));
            	
            	$('li',el).each(function(){
            		if($(this).find('.priority_type').text().trim()== "HIGH") {
            			$(this).css("border-left","3px solid #f05050");
            		}else if($(this).find('.priority_type').text().trim() == "NORMAL"){
            			$(this).css("border-left","3px solid #7266ba");
            		}else if($(this).find('.priority_type').text().trim() == "LOW") {
            			$(this).css("border-left","3px solid #fad733");
            		}
            	});
            }
            
        });
		tasksView.collection.fetch();
		var ele = $('#tasks', App_Leads.leadDetailView.el);
        $(ele).html(tasksView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.loadDeals = function ()
	{
		var id = App_Leads.leadDetailView.model.id;
		dealsView = new Base_Collection_View({
			url: 'core/api/contacts/'+ id + "/deals" ,
            restKey: "opportunity",
            templateKey: "deals",
            individual_tag_name: 'li',
            sortKey:"created_time",
            descending: true,
            postRenderCallback: function(el) {
            	agileTimeAgoWithLngConversion($(".deal-created-time", el));
            	$(el).find('ul li').each(function(){
			    	$(this).addClass("deal-color");
			    	$(this).addClass($(this).find("input").attr("class"));
		        });
            }
        });
        dealsView.collection.fetch();
        var ele = $('#deals', App_Leads.leadDetailView.el);
        $(ele).html(dealsView.el);
        this.activateLeadTab(ele);
	}

	LeadDetails.prototype.saveLeadTabPosition = function (tab_href)
	{
		var position = _agile_get_prefs("lead_tab_position");

		if (position == tab_href)
			return;

		_agile_set_prefs("lead_tab_position", tab_href);
	}

	LeadDetails.prototype.activateLeadTab = function(ele)
	{
		$('#contact-tab-content .tab-pane').removeClass('active');
		$(ele).addClass('active');
	}

	return LeadDetails;

})();