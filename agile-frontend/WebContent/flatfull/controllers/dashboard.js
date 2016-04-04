var DashboardsRouter = Backbone.Router.extend({
	
	routes : {
		

		/* Dashboard */
		
		"add-dashboard" : "addDashboard",

		"dashboards" : "Dashboards",

		"edit-dashboard/:id" : "editDashboard"
		
	},
	
	/**
	 * Adds new dashboard
	 */
	addDashboard : function()
	{
		$("#content").html(LOADING_HTML);
		var that = this;
		var dashboard_view = new Base_Model_View({ url : 'core/api/dashboards', template : "dashboard-add", isNew : "true",
			postRenderCallback : function(el)
			{
								
			},
			saveCallback : function(data)
			{
				if(that.dashboards_collection_view && data) {
					that.dashboards_collection_view.collection.add(new BaseModel(data));
				}
				if(data) {
					CURRENT_USER_DASHBOARDS.push(data);
				}
				that.navigate("dashboards", { trigger : true });
			} });
		$('#content').html(dashboard_view.render().el);		
	},

	/**
	 * Fetch all dashboards
	 */
	Dashboards : function()
	{
		$("#content").html(LOADING_HTML);
		if(!this.dashboards_collection_view) {
			this.dashboards_collection_view = new Base_Collection_View({ url : 'core/api/dashboards', templateKey : "dashboard", isNew : "true", window : "dashboards",
				individual_tag_name : 'tr', sortKey : 'name',  
				postRenderCallback : function(el)
				{
					head.js('lib/jquery.timeago.js', function()
					{
						$(".time-ago", el).timeago();
					});					
				} });
			this.dashboards_collection_view.collection.fetch();
			$('#content').html(this.dashboards_collection_view.render().el);
		}else {
			$('#content').html(this.dashboards_collection_view.render(true).el);
		}
				
	},

	/**
	 * Edits dashboard created
	 */
	editDashboard : function(id)
	{
		if (!this.dashboards_collection_view || this.dashboards_collection_view.collection.length == 0 || this.dashboards_collection_view.collection.get(id) == null)
		{
			this.navigate("dashboards", { trigger : true });
			return;
		}

		$("#content").html(LOADING_HTML);
		var that = this;
		var dashboard = this.dashboards_collection_view.collection.get(id);
		var dashboard_json = dashboard.toJSON();
		var dashboard_view = new Base_Model_View({ url : 'core/api/dashboards', model : dashboard, template : "dashboard-add", 
			postRenderCallback : function(el)
			{
				deserializeForm(dashboard_json, $("#dashboardAddForm"));
			},
			saveCallback : function(data)
			{
				if(that.dashboards_collection_view && data) {
					that.dashboards_collection_view.collection.get(id).set(new BaseModel(data));
				}
				if(data) {
					$.each(CURRENT_USER_DASHBOARDS, function(index, value)
					{
						if(id == this.id)
						{
							this.name = data["name"];
							this.description = data["description"];
						}
					});
				}
				that.navigate("dashboards", { trigger : true });
			} });

		$("#content").html(dashboard_view.render().el);

	}
	
	
});