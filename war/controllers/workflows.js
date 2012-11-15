var WorkflowsRouter = Backbone.Router.extend({

    routes: {
    	
        /* Workflows/Campaigns */
        "workflows": "workflows",
        "workflow-add": "workflowAdd",
        "workflow/:id": "workflowEdit",
        "workflows/logs/:id": "logsToCampaign",
        "triggers":"triggers",
        "trigger-add":"triggerAdd",
        "trigger/:id":"triggerEdit"
          },
            
      workflows: function () {
            this.workflowsListView = new Base_Collection_View({
                url: '/core/api/workflows',
                restKey: "workflow",
                templateKey: "workflows",
                individual_tag_name: 'tr',
                cursor: true,
                page_size: 10
            });
            
          
            this.workflowsListView.collection.fetch();
            $('#content').html(this.workflowsListView.el);  
            
            $(".active").removeClass("active");
            $("#workflowsmenu").addClass("active");
        },
        workflowAdd: function () {
            if (!this.workflowsListView || !this.workflowsListView.collection) {
                this.navigate("workflows", {
                    trigger: true
                });
                return;
            }

            /* Reset the designer JSON */
            this.workflow_json = undefined;
            this.workflow_model = undefined;
            
            $('#content').html(getTemplate('workflow-add', {}));
        },
        workflowEdit: function (id) {
            if (!this.workflowsListView || this.workflowsListView.collection.length == 0) {
                this.navigate("workflows", {
                    trigger: true
                });
                return;
            }

            /* Set the designer JSON. This will be deserialized*/
            this.workflow_model = this.workflowsListView.collection.get(id);
            this.workflow_json = this.workflow_model.get("rules");

            $('#content').html(getTemplate('workflow-add', {}));
            
            // Set the name
            $('#workflow-name').val(this.workflow_model.get("name")); 
        },
        logsToCampaign: function (id) {
        	 var logsListView = new Base_Collection_View({
                 url: '/core/api/campaigns/logs/' + id,
                 restKey: "logs",
                 templateKey: "campaign-logs",
                 individual_tag_name: 'tr'
             });
             
           
             logsListView.collection.fetch();
             $('#content').html(logsListView.el); 
        },
        triggers:function () {
        	this.triggersCollectionView = new Base_Collection_View({

                url: '/core/api/workflows/triggers',
                restKey: "triggers",
                templateKey: "triggers",
                individual_tag_name: 'tr',
            });
          
            this.triggersCollectionView.collection.fetch();
            $('#content').html(this.triggersCollectionView.el);  

        },
        triggerAdd:function(){
        	this.triggerModelview = new Base_Model_View({
        		url: 'core/api/workflows/triggers',
                template: "trigger-add",
                isNew: true,
                window: 'triggers',
                postRenderCallback:function(el){

                	head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
	           		    	{	
	           					var LHS, RHS;
	           					
	           					LHS = $("#LHS", el);
	           					RHS = $("#RHS", el);
	           					
	           					// Chaining dependencies of input fields with jquery.chained.js
	           					RHS.chained(LHS);
	            			        	            			    
	           		    	});
	            
	            var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
                fillSelect('campaign-select','/core/api/workflows', 'workflow', 'no-callback', optionsTemplate);

                   }
                 });
        	   
             var view = this.triggerModelview.render();
             $('#content').html(view.el);

        },
        triggerEdit:function(id){
            	
        	// Send to triggers if the user refreshes it directly
        	if (!this.triggersCollectionView || this.triggersCollectionView.collection.length == 0) {
                this.navigate("triggers", {
                    trigger: true
                });
                return;
            }
            var currentTrigger = this.triggersCollectionView.collection.get(id);
            
            var view = new Base_Model_View({
                url: 'core/api/workflows/triggers',
                model: currentTrigger,
                template: "trigger-add",
                window: 'triggers',
                postRenderCallback: function(el){
                	
                	head.js(LIB_PATH + 'lib/agile.jquery.chained.min.js', function()
	           		    	{	
	           					var LHS, RHS;
	           					
	           					LHS = $("#LHS", el);
	           					RHS = $("#RHS", el);
	           					
	           					// Chaining dependencies of input fields with jquery.chained.js
	           					RHS.chained(LHS);
	           					
	           					// To get the input values
	           					var type = currentTrigger.toJSON()['type'];
	           					
	           					$('#trigger-type',el).find('option[value='+type+']').attr("selected", "selected").trigger('change');	           					
	           		    	});
                	
                	
                	var optionsTemplate = "<option value='{{id}}'>{{name}}</option>";
                    fillSelect('campaign-select','/core/api/workflows', 'workflow', function fillCampaign() {
                		var value = currentTrigger.toJSON();
                		if(value)
                		{
                			$('#campaign-select',el).find('option[value='+value.campaign_id+']').attr('selected', 'selected');
                			
                		}			
                	}, optionsTemplate);
                    },
            	});
            
            	var view = view.render();
            	$("#content").html(view.el);  
        }
         
});