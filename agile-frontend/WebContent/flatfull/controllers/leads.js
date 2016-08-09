LEADS_HARD_RELOAD = true;
var LEADS_DYNAMIC_FILTER_COOKIE_STATUS = "toggle_leads_lhs_filters_" + CURRENT_DOMAIN_USER.id;
var LeadsRouter = Backbone.Router.extend({
	routes : {
		"leads" : "leads",
		"lead-filters" : "leadFilters",
		"lead-filter-add" : "leadFilterAdd"
	},

	leads : function()
	{
		var that = this;
		this.leadsViewLoader = new LeadsViewLoader();
		this.leadsBulkActions = new LeadsBulkActions();
		var leadsHeader = new Leads_Header_Events_View({ data : {}, template : "leads-header", isNew : true,
			postRenderCallback : function(el)
			{
				that.leadsViewLoader.buildLeadsView(el);
			} 
		});
		$('#content').html(leadsHeader.render().el);

		$(".active").removeClass("active");
		$("#leadsmenu").addClass("active");
		$('[data-toggle="tooltip"]').tooltip();
	},

	leadFilters : function()
	{
		this.leadFiltersList = new Base_Collection_View({ url : '/core/api/filters', restKey : "ContactFilter", templateKey : "leads-filter",
			individual_tag_name : 'tr', sort_collection : false,
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/jquery.timeago.js', function()
				{
					$(".created_time", el).timeago();
				});

			}});

		this.leadFiltersList.collection.fetch();
		$("#content").html(this.leadFiltersList.render().el);
	},

	leadFilterAdd : function()
	{

		var leadFilter = new Leads_Filter_Events_View({ url : 'core/api/filters', template : "leads-filter-add", isNew : "true", window : "lead-filters",
			postRenderCallback : function(el)
			{
				head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js?_='+_agile_get_file_hash("agile.jquery.chained.min.js"), function()
				{
					chainFiltersForLead(el, undefined, function()
					{
						$('#content').html(el);
						scramble_input_names($(el).find('#filter-settings'));
					});
				});				
			} });
		$("#content").html(LOADING_HTML);
		leadFilter.render();		
	},
});